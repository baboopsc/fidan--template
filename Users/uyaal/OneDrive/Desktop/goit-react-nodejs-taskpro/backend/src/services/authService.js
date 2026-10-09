import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../db/models/User.js';
import { env } from '../utils/env.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { ACCESS_TOKEN_LIFETIME, JWT } from '../constants/index.js';

const createToken = (userId) =>
  jwt.sign({ id: userId }, env(JWT.JWT_SECRET), { expiresIn: ACCESS_TOKEN_LIFETIME });

export const toUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatarUrl: user.avatarUrl,
  theme: user.theme,
});

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });
  const token = createToken(user._id);

  return { user: toUserResponse(user), token };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  const token = createToken(user._id);

  return { user: toUserResponse(user), token };
};

export const updateUserProfile = async (currentUser, body, file) => {
  const updates = { ...body };

  if (Object.keys(updates).length === 0 && !file) {
    throw createHttpError(400, 'Nothing to update');
  }

  if (updates.email && updates.email !== currentUser.email) {
    const existingUser = await User.findOne({ email: updates.email });
    if (existingUser) {
      throw createHttpError(409, 'Email in use');
    }
  }

  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  if (file) {
    updates.avatarUrl = await saveFileToCloudinary(file);
  }

  const user = await User.findByIdAndUpdate(currentUser._id, updates, { new: true });

  return toUserResponse(user);
};
