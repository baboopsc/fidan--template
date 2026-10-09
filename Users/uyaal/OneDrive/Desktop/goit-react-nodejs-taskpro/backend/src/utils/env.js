import { ENV_VARS } from "../constants/index.js";

export const env = (key, defaultValue) => {
  const value = process.env[key];

  if (value) {
    return value;
  }

  if (defaultValue) {
    return defaultValue;
  }

  throw new Error(`Missing: process.env['${key}']`);
};
