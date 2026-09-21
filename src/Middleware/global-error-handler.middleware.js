const globalErrorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    code: err.code,
    data: err.data,
    source: err.source,
  });
};

export default globalErrorHandler;
