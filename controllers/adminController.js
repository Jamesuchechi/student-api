exports.dashboard = async (req, res, next) => {
  res.json({ message: 'admin dashboard', user: req.user });
};
