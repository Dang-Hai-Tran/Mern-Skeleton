import User from '../models/user.model';
import extend from 'lodash/extend';
import errorHandler from '../helpers/dbErrorHandler';

const create = async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        return res.status(200).json({
            message: 'Successfully signed up!',
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};
const list = async (req, res, next) => {
    try {
        // Listing all user in database
        let users = await User.find().select('name email updated created');
        res.json(users);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};
// Find user with specific id and assign it to req.profile
const userByID = async (req, res, next, id) => {
    try {
        let user = await User.findById(id);
        if (!user) {
            return res.status(400).json({
                error: 'User not found!',
            });
        }
        req.profile = user;
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(),
        });
    }
};
const read = (req, res, next) => {
    // Remove hashed_password and salt from request to protect sensitive information
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};
const update = async (req, res, next) => {
    // Use lodash/extend function to update user object
    try {
        let user = extend(req.profile, req.body);
        user.updated = Date.now();
        await user.save();
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json(user);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};
const remove = async (req, res, next) => {
    try {
        let user = req.profile;
        let deleteUser = await user.remove();
        deleteUser.hashed_password = undefined;
        deleteUser.salt = undefined;
        res.json(deleteUser)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
};

export default { create, userByID, read, list, remove, update };
