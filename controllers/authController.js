const authService = require('../services/authService');
const generateToken = require('../utils/generateToken');

exports.register = (req, res, next) => {
    authService.registerUser(req.body, (err, user) => {
        if (err) return next(err);
        res.status(201).json({ user });
    });
};

exports.login = (req, res, next) => {
    authService.authenticate(req.body, (err, user) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        const token = generateToken({ id: user.id, username: user.username, role: user.role });
        // create refresh token (7 days)
        authService.createRefreshToken(user.id, 60 * 60 * 24 * 7, (err2, refresh) => {
            if (err2) return next(err2);
            res.json({ token, refreshToken: refresh.token, refreshExpiresAt: refresh.expiresAt });
        });
    });
};

exports.refresh = (req, res, next) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Missing refreshToken' });
    authService.verifyRefreshToken(refreshToken, (err, rec) => {
        if (err) return next(err);
        if (!rec) return res.status(401).json({ message: 'Invalid refresh token' });
        // issue new access token
        User = require('../models/User');
        User.findById(rec.user_id, (err2, user) => {
            if (err2) return next(err2);
            if (!user) return res.status(401).json({ message: 'User not found' });
            const token = generateToken({ id: user.id, username: user.username, role: user.role });
            res.json({ token });
        });
    });
};

exports.logout = (req, res, next) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Missing refreshToken' });
    authService.revokeRefreshToken(refreshToken, (err, removed) => {
        if (err) return next(err);
        res.json({ revoked: !!removed });
    });
};
