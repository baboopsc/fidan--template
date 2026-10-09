import createHttpError from 'http-errors';

export const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return next(createHttpError(400, error.message));
  }

  req.body = value;
  next();
};
