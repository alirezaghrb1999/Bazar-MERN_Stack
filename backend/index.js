const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('./http-error');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const usersRoutes = require('./routes/user-route');
const itemsRoutes = require('./routes/item-route');
const commentRoutes = require('./routes/comment-route');

const app = express();
app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers', '*'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

app.use('/users', usersRoutes);
app.use('/items', itemsRoutes);
app.use('/comments', commentRoutes);
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, err => {
            console.log(err);
        });
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose.connect('mongodb://127.0.0.1:27017/Bazar')
    .then(() => {
        app.listen(5000);
    })
    .catch(err => {
        console.log(err);
    });



