const jwt = require("jsonwebtoken")
const UserModel = require("../models/user.model")

const checkUserAuthentication = async (req, res, next) => {
    try {
        const token = req.headers.token
        if (!token)
            return res.status(401).send({ status: 'TERMINATE' })

        const { userId, loginSessionId } = jwt.verify(token, process.env.JWT_KEY)
        const user = await UserModel.findById(userId).lean();

        if (!user) return res.status(401).send({ status: 'TERMINATE' })
        if (user.loginSessionId !== loginSessionId) return res.status(401).send({ status: 'TERMINATE' })

        req['user'] = user;

        next()
    } catch (err) {
        console.log('checkUserAuthentication', err)
        res.status(401).send({ status: 'TERMINATE' })
    }
}

module.exports = {
    checkUserAuthentication,
}