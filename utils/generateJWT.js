const jwt = require('jsonwebtoken');

module.exports = async (payload, duration) => {
    const token = await jwt.sign(
        {payload},
        process.env.JWT_SECRET_KEY,
        {expiresIn : duration}
        );
    return token;
}