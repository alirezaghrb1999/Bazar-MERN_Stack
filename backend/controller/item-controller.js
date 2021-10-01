const HttpError = require('../http-error');
const Item = require('../models/item');
const User = require('../models/user');
const Comment = require('../models/comment');
const { validationResult } = require('express-validator');
const comment = require('../models/comment');

const createItem = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new HttpError('Invalid inputs passed, please check your data.', 422);
        return next(error);
    }

    const { name, description, price, creator } = req.body;

    let photo;
    if (req.file) {
        photo = "http://localhost:5000/" + req.file.path.replace(/\\/g, '/');
    }
    else {
        photo = "http://localhost:5000/uploads/images/item.png";
    }


    const createdItem = new Item({
        name,
        description,
        price,
        image: photo,
        creator
    });

    let user;
    try {
        user = await User.findById(creator);
    } catch (err) {
        const error = new HttpError('Creating item failed, please try again.', 500);
        return next(error);
    }

    if (!user) {
        const error = new HttpError('Could not find user for provided id.', 404);
        return next(error);
    }

    try {
        await createdItem.save();
        user.items.push(createdItem);
        await user.save();
    } catch (err) {
        const error = new HttpError('Creating item failed, please try again.', 500);
        return next(error);
    }

    res.status(201).json({ item: createdItem });
};


const getItemById = async (req, res, next) => {
    const Itemid = req.params.itemid;

    let item;
    try {
        item = await Item.findById(Itemid);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a item.', 500);
        return next(error);
    }

    if (!item) {
        const error = new HttpError('Could not find a item for the provided id.', 404);
        return next(error);
    }

    res.json({ item: item.toObject({ getters: true }) });
};

const getItemByUserId = async (req, res, next) => {
    const userId = req.params.userid;
    let userWithItems;
    try {
        userWithItems = await User.findById(userId).populate('items');
    } catch (err) {
        const error = new HttpError('Fetching items failed, please try again later', 500);
        return next(error);
    }

    if (!userWithItems) {
        const error = new HttpError('Could not find items for the provided user id.', 404);
        return next(error);
    }

    if (userWithItems.items.length === 0) {
       return res.json({ items: userWithItems.items.map(item => item.toObject({ getters: true })) });
    }

    res.json({ items: userWithItems.items.map(item => item.toObject({ getters: true })) });
};


const UpdateItem = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new HttpError('Invalid inputs passed, please check your data.', 422);
        return next(error);
    }

    const { name, description, price } = req.body;
    const itemID = req.params.itemid;

    let item;
    try {
        item = await Item.findById(itemID);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update item.', 500);
        return next(error);
    }


    if (item.creator.toString() !== req.userData.userId) {
        const error = new HttpError('You are not allowed to edit this place.', 401);
        return next(error);
    }

    item.name = name;
    item.description = description;
    item.price = price;

    try {
        await item.save();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update item.', 500);
        return next(error);
    }

    res.status(200).json({ item: item.toObject({ getters: true }) });
};


const DeleteItem = async (req, res, next) => {
    const itemID = req.params.itemid;
    let item;
    try {
        item = await (await Item.findById(itemID)).populate('creator');
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete item.', 500);
        return next(error);
    }
    if (!item) {
        const error = new HttpError('Could not find item for this id.', 404);
        return next(error);
    }

    if (item.creator.id !== req.userData.userId) {
        const error = new HttpError('You are not allowed to delete this item.', 401);
        return next(error);
    }

    try {
        await Comment.deleteMany({relateditem : item.id})
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete comments of item.', 500);
        return next(error);
    }

    try {
        await item.remove();
        item.creator.items.pull(item);
        await item.creator.save();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete item.', 500);
        return next(error);
    }

    res.status(200).json({ message: 'Deleted item.' });
};

exports.createItem = createItem;
exports.getItemById = getItemById;
exports.getItemByUserId = getItemByUserId;
exports.UpdateItem = UpdateItem;
exports.DeleteItem = DeleteItem;
