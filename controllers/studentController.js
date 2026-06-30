const Student = require('../models/Student');

exports.getAll = (req, res, next) => {
  Student.findAll((err, students) => {
    if (err) return next(err);
    res.json(students);
  });
};

exports.getById = (req, res, next) => {
  Student.findById(req.params.id, (err, student) => {
    if (err) return next(err);
    if (!student) return res.status(404).json({ message: 'Not found' });
    res.json(student);
  });
};

exports.create = (req, res, next) => {
  Student.create(req.body, (err, created) => {
    if (err) return next(err);
    res.status(201).json(created);
  });
};

exports.update = (req, res, next) => {
  Student.update(req.params.id, req.body, (err, updated) => {
    if (err) return next(err);
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'updated' });
  });
};

exports.remove = (req, res, next) => {
  Student.remove(req.params.id, (err, deleted) => {
    if (err) return next(err);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.status(204).end();
  });
};
