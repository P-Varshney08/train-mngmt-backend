import jwt from 'jsonwebtoken';
import User from '../models/User.js';


export const isAuthenticatedUser = (req, res, next) => {
    let access_token;

    // Check for access_token in cookies
    if (req.cookies && req.cookies.access_token) {
        access_token = req.cookies.access_token;
    }

    // If access_token not found in cookies, try to extract from Authorization header
    const authorizationHeader = req.headers.authorization;
    if (!access_token && authorizationHeader) {
        const [bearer, token] = authorizationHeader.split(' ');

        if (bearer === 'Bearer' && token) {
            access_token = token;
        }
    }

    // If access_token is not present, return an error
    if (!access_token) {
        return res.json({ msg: 'Not an Authenticated User' });
    }
    // console.log(access_token)

    // Proceed to the next middleware or route handler
    next();
};



export const isAdmin = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (authorizationHeader) {
        const [bearer, access_token] = authorizationHeader.split(' ');
        console.log(access_token);
        if (bearer === 'Bearer' && access_token) {
            try {
                const verifyToken = jwt.verify(access_token, process.env.JWT_SECRET);
                const user = await User.findOne({ email: verifyToken.email });

                if (!user) {
                    return res.json({ message: 'User does not exist' });
                }

                if (!user.isAdmin) {
                    return res.status(401).json({ message: 'Wrong Admin credentials' });
                }
                // console.log('isAdmin page m try k andar h')

                next(); // Only call next() if everything is valid
            } catch (error) {
                return res.json({ msg: 'Invalid Token' });
            }
        } else {
            return res.json({ msg: 'Invalid Authorization header format' });
        }
    } else {
        return res.json({ msg: 'Authorization header is missing' });
    }
};



