module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const payload = { message: err.message || 'Internal Server Error' };

  if (err.code === 'SQLITE_CONSTRAINT') {
    payload.message = 'Database constraint error';
    if (err.message.includes('users.username')) {
      payload.message = 'Username already exists';
      return res.status(409).json(payload);
    }
    if (err.message.includes('students.email')) {
      payload.message = 'Student email already exists';
      return res.status(409).json(payload);
    }
    return res.status(400).json(payload);
  }

  if (err.isJoi) {
    payload.message = 'Validation error';
    payload.details = err.details.map((item) => item.message);
    return res.status(400).json(payload);
  }

  res.status(status).json(payload);
};
