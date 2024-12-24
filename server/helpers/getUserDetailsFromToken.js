const jwt = require('jsonwebtoken');

const getUserDetailsFromToken = async (token) => {
    if (!token) {
        return null; // Return null or handle logout differently
    }

    try {

        const decode = await jwt.verify(token, process.env.JWT_SECREAT_KEY);
        return decode.id; // Ensure this returns an ID only
    } catch (error) {
        console.log(error);

        return null; // Return null if token verification fails
    }
};

module.exports = getUserDetailsFromToken;
