const mongoose = require('mongoose');
const crypto = require('crypto')
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email Field is required"],
        unique: true,
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date }
}, {
    timestamps: true
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

//JWT Token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

// Compare Password

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.getresetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
}


module.exports = mongoose.model('User', userSchema)