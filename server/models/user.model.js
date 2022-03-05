import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required',
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is required',
    },
    created: {
        type: Date,
        default: Date.now,
    },
    updated: Date,
    // hashed_password and salt represent the encrypted user password to use for authentication
    hashed_password: {
        type: String,
        required: 'Password is required',
    },
    salt: String,
});

// Password is not stored directly in the user document, instead it is handled as a virtual field
UserSchema.virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

UserSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    // Generate an encrypted hash from text password and salt value using crypto module from NodeJS
    encryptPassword: function (password) {
        if (!password) return '';
        try {
            // sha1 is a hashing algorithm, createHmac is a method of crypto to Generate the cryptographic HMAC
            return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
        } catch (err) {
            return '';
        }
    },
    makeSalt: function () {
        // Algo to return a random value
        return Math.round(new Date().valueOf() * Math.random()) + '';
    },
};

export default mongoose.model('User', UserSchema);
