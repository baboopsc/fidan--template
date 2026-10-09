import * as authService from '../services/authService.js';

export const register = async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.status(201).json(result);
};

export const login = async (req, res) => {
  const result = await authService.loginUser(req.body);
  res.status(200).json(result);
};

// Stateless JWT, nothing to invalidate server-side — no service call needed here.
export const logout = async (req, res) => {
  res.status(204).send();
};

export const getCurrentUser = async (req, res) => {
  res.status(200).json(authService.toUserResponse(req.user));
};

export const updateUser = async (req, res) => {
  const user = await authService.updateUserProfile(req.user, req.body, req.file);
  res.status(200).json(user);
};
