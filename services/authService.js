const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const hashPassword = require('../utils/hashPassword');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

exports.registerUser = (userData, callback) => {
    hashPassword(userData.password)
        .then((hashed) => {
            User.create({ username: userData.username, password: hashed, role: userData.role }, callback);
        })
        .catch(callback);
};

exports.authenticate = (credentials, callback) => {
    User.findByUsername(credentials.username, (err, user) => {
        if (err) return callback(err);
        if (!user) return callback(null, null);
        bcrypt.compare(credentials.password, user.password)
            .then((match) => {
                if (!match) return callback(null, null);
                callback(null, { id: user.id, username: user.username, role: user.role });
            })
            .catch(callback);
    });
};

exports.createRefreshToken = (userId, ttlSeconds, callback) => {
    const token = crypto.randomBytes(48).toString('hex');
    const expiresAt = new Date(Date.now() + (ttlSeconds * 1000)).toISOString();
    RefreshToken.create(token, userId, expiresAt, (err, rec) => callback(err, rec ? { token, expiresAt } : null));
};

exports.verifyRefreshToken = (token, callback) => {
    RefreshToken.find(token, (err, rec) => {
        if (err) return callback(err);
        if (!rec) return callback(null, null);
        if (new Date(rec.expires_at) < new Date()) return callback(null, null);
        callback(null, rec);
    });
};

exports.revokeRefreshToken = (token, callback) => {
    RefreshToken.remove(token, callback);
};
