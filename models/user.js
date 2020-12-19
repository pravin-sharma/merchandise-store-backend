const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require('uuid')

const Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true,
    },
    lastname: {
        type: String,
        maxlength: 32,
        required: false,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    userinfo: {
        type: String,
        trim: true,
    },
    encry_password: {
        type: String,
        required: true,
    },
    salt: String,
    role: {
        type: Number,
        default: 0,
    },
    purchases: {
        type: Array,
        default: [],
    },
}, { timestamps: true });

userSchema.virtual("password")
    .set(function (password) {
        this._password = password;
        this.salt = uuidv1();
        this.encry_password = this.securePassword(password);
    })
    .get(function () {
        return this._password;
    })

userSchema.methods = {
    securePassword: function (plainpassword) {
        return crypto
            .createHmac("sha256", this.salt)
            .update(plainpassword)
            .digest("hex");
    },
    authenticate: function (password) {
        return this.securePassword(password) === this.encry_password;
    }
}

module.exports = mongoose.model("User", userSchema);
