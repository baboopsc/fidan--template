import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { User } from '../db/models/User.js';
import { env } from '../utils/env.js';
import { JWT } from '../constants/index.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    return next(createHttpError(401, 'Authorization header missing'));
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Auth header should be of type Bearer'));
  }

  let payload;
  try {
    payload = jwt.verify(token, env(JWT.JWT_SECRET));
  } catch {
    return next(createHttpError(401, 'Access token expired or invalid'));
  }

  const user = await User.findById(payload.id);

  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }

  req.user = user;
  next();
};
