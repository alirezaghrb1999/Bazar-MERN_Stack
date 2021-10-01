const HttpError = require('../http-error');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password')
    } catch (err) {
        const error = new HttpError('Fetching users failed, please try again later.', 500);
        return next(error)
    }

    res.json({ users: users.map(user => user.toObject({ getters: true })) });
};


const register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new HttpError('Invalid inputs passed, please check your data.', 422);
        return next(error);
    }

    const { name, lastname, email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError('Signing up failed, please try again later.', 500);
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError('User exists already, please login instead.', 422);
        return next(error);
    }

    let photo;
    if (req.file) {
        photo = "http://localhost:5000/" + req.file.path.replace(/\\/g, '/');
    }
    else {
        photo = "http://localhost:5000/uploads/images/anonymous.jpg";
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError('Could not create user, please try again.', 500);
        return next(error);
    }

    const createdUser = new User({
        name,
        lastname,
        email,
        image: photo,
        password: hashedPassword,
        items: []
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError('Signing up failed, please try again', 500);
        return next(error);
    }

    let token;
    try {
        token = jwt.sign({ userId: createdUser.id, email: createdUser.email }, 'Bazar-app', { expiresIn: '1h' });
    } catch (err) {
        const error = new HttpError('Signing up failed, please try again later.', 500);
        return next(error);
    }

    res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token, name: createdUser.name, image: createdUser.image });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email })
    } catch (err) {
        const error = new HttpError('Logging in failed, please try again later.', 500);
        return next(error);
    }

    if (!existingUser) {
        return res.status(401).json({ message: 'Invalid credentials, could not log you in.' });
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        const error = new HttpError('Could not log you in, please check your credentials and try again.', 500);
        return next(error);
    }
    if (!isValidPassword) {
        const error = new HttpError('Invalid credentials, could not log you in.', 403);
        return next(error);
    }

    let token;
    try {
        token = jwt.sign({ userId: existingUser.id, email: existingUser.email }, 'Bazar-app', { expiresIn: '1h' });
    } catch (err) {
        const error = new HttpError('Logging in failed, please try again later.', 500);
        return next(error);
    }

    res.json({ userId: existingUser.id, email: existingUser.email, token: token, name: existingUser.name, image: existingUser.image });
};

exports.getUsers = getUsers;
exports.register = register;
exports.login = login;
