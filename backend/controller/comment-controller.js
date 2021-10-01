const HttpError = require('../http-error');
const Comment = require('../models/comment');
const User = require('../models/user');
const Item = require('../models/item');
const { validationResult } = require('express-validator');
const { populate } = require('../models/comment');


const getCommentsByItemId = async (req, res, next) => {
    const itemId = req.params.itemid;

    let ItemWithcomments;
    try {
        ItemWithcomments = await Item.findById(itemId).populate({path:'comments',populate: {path: 'creator'}}).exec();;
    } catch (err) {
        const error = new HttpError('Fetching comments failed, please try again later', 500);
        return next(error);
    }

    if (!ItemWithcomments) {
        const error = new HttpError('Could not find comments for the provided item id.', 404);
        return next(error);
    }

    if (ItemWithcomments.comments.length === 0) {
        return res.json({ comments: ItemWithcomments.comments.map(row => row.toObject({ getters: true })) });
    }

    res.json({ comments: ItemWithcomments.comments.map(row => row.toObject({ getters: true })) });
}

const createComment = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new HttpError('Invalid inputs passed, please check your data.', 422);
        return next(error);
    }

    const { content,creator, relateditem,createdat } = req.body;
    const createdComment = new Comment({
        content,
        creator,
        relateditem,
        createdat
    });

    let user;
    try {
        user = await User.findById(creator);
    } catch (err) {
        const error = new HttpError('sending comment failed, please try again.', 500);
        return next(error);
    }
    if (!user) {
        const error = new HttpError('Could not find user for provided id.', 404);
        return next(error);
    }

    let item;
    try {
        item = await Item.findById(relateditem);
    } catch (err) {
        const error = new HttpError('sending comment failed, please try again.', 500);
        return next(error);
    }
    if (!item) {
        const error = new HttpError('Could not find item for provided id.', 404);
        return next(error);
    }

    try {
        await createdComment.save();
        item.comments.push(createdComment);
        await item.save();
    } catch (err) {
        const error = new HttpError('sending comment failed, please try again.', 500);
        return next(error);
    }

    res.status(201).json({ comment: createdComment });
};


const deleteComment = async (req, res, next) => {
    const CommentId = req.params.commentid;
    let comment;
    try {
        comment = await (await Comment.findById(CommentId)).populate('relateditem');
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete comment.', 500);
        return next(error);
    }
    if (!comment) {
        const error = new HttpError('Could not find item for this id.', 404);
        return next(error);
    }

    if (comment.creator.toString() !== req.userData.userId) {
        const error = new HttpError('You are not allowed to delete this comment.', 401);
        return next(error);
    }

    try {
        await comment.remove();
        comment.relateditem.comments.pull(comment);
        await comment.relateditem.save();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete comment.', 500);
        return next(error);
    }

    res.status(200).json({ message: 'comment Deleted.' });
}



exports.getCommentsByItemId = getCommentsByItemId;
exports.createComment = createComment;
exports.deleteComment = deleteComment;