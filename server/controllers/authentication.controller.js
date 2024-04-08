const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const signup = async (req, res) => {
    try {
        const body = req.body;
        const isEmailExists = await UserModel.exists({ email: body.email });
        if (isEmailExists) return res.status(400).send({ status: 'EMAIL_ALREADY_EXISTS' });

        await UserModel.create({
            name: body.name,
            phone: body.phone,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
        })

        res.status(200).send({ message: 'User registered successfully.' });
    } catch (err) {
        console.log('signup', err);
        res.status(500).send({ message: 'Something went wrong' });
    }
}

const login = async (req, res) => {
    try {
        const body = req.body;
        const user = await UserModel.findOne({ email: body.email });
        if (!user) return res.status(400).send({ status: 'NOT_EXISTS' });

        if (!bcrypt.compareSync(body.password, user.password)) return res.status(400).send({ status: 'PASSWORD_NOT_MATCHED' });

        const loginSessionId = crypto.randomBytes(24).toString('hex');
        // 86400 means 24 x 60 x 60
        const token = jwt.sign({ userId: user._id, loginSessionId }, process.env.JWT_KEY, { expiresIn: 86400 });

        await UserModel.updateOne({ _id: user._id }, { $set: { loginSessionId } });

        res.status(200).send({
            message: 'Login successfully',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
        });
    } catch (err) {
        console.log('login', err);
        res.status(500).send({ message: 'Something went wrong' });
    }
}

const session = async (req, res) => {
    try {
        const user = req.user

        res.status(200).send({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            }
        });
    } catch (err) {
        console.log('session', err);
        res.status(500).send({ message: 'Something went wrong' });
    }
}

module.exports = {
    signup,
    login,
    session,
}