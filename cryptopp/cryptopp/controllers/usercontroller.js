const User = require('../models/user');
const sendEmail = require('../services/sendEmail');
const crypto = require('crypto');

exports.registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            return res.status(400).json({
                message: 'All Fields Required',
                success: false
            })
        }

        let emailExist = await User.findOne({ email });

        if (emailExist) {
            return res.status(400).json({
                message: 'Email Already Exist',
                success: false,
            })
        }

        let user = await User.create({ username, email, password });
        await user.save();

        const token = user.getJWTToken();

        res.status(201).json({
            success: true,
            token,
            user,
            message: 'User created successfully'
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message || "Interna;l Server Error",
            success: false
        })
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'All Fields Required',
                success: false
            })
        }

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid Email or Password',
                success: false
            })
        }

        let ismatched = await user.comparePassword(password);

        if (!ismatched) {
            return res.status(401).json({
                message: 'Invalid Email or Password',
                success: false
            })
        }

        const token = user.getJWTToken();

        return res.status(200).json({
            message: 'Login Successful',
            success: true,
            user,
            token
        })

    } catch (err) {
        return res.status(500).json({
            message: err.message || "Interna;l Server Error",
            success: false
        })
    }
}


exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid Email',
                success: false
            })
        }

        const resetToken = user.getresetPasswordToken();

        await user.save({ validateBeforeSave: false });
        const resetPasswordUrl = `${req.get('Origin')}/user/password/reset/${resetToken}`;

        const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it`;

        try {
            await sendEmail({
                email: user.email,
                subject: `Crypto Reset Password`,
                message,
            });

            res.status(200).json({
                success: true,
                message: `Email sent successfully`,
            });

        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                message: err.message || "Interna;l Server Error",
                success: false
            })

        }
    } catch (err) {
        return res.status(500).json({
            message: err.message || "Interna;l Server Error",
            success: false
        })
    }
}

exports.resetPassword = async (req, res, next) => {
    try {
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                message: 'Link has been Expired',
                success: false
            })
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        const token = user.getJWTToken();

        res.status(200).json({
            user,
            token,
            success: true,
            message: 'Password Changed Successfully'
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message || "Interna;l Server Error",
            success: false
        })
    }
}