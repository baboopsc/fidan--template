import createHttpError from 'http-errors';

export const errorHandler = (err, req, res, next) => {
    if (createHttpError.isHttpError(err)) {
        res.status(err.status).json({
            status: err.status,
            message: err.message,
            data: err,
        });
        return;
    }

    res.status(500).json({
        status: 500,
        message: 'Something went wrong',
        data: err.message,
    });
};

export const notFoundHandler = (req, res, next) => {
    next(createHttpError(404, 'Route not found'));
};
