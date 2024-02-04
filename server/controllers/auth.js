import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import User from '../models/User.js';
 
export const signup = async(req, res)=>{
    const {username, email, password, phone, isAdmin, category} = req.body;
    const duplicate = await User.findOne({email});
    if(duplicate) return res.status(500).json({ msg: 'User already exist' });
    const hashedPassword = await bcryptjs.hashSync(password, 10);
    if(isAdmin === null) isAdmin=false;
    const newUser = new User({username, email, password:hashedPassword, phone, isAdmin, category});
    try{
        await newUser.save();
        console.log('new user created');
        res.status(201).json(newUser)
    }catch (err){
        if(!err.message.includes("E11000")){
            throw err;
        }
        else{
            return res.status(409).send("Error: Email already in use");   
        }
    }
};

export const signin = async(req, res, next) => {
    const {password, email} = req.body;
    try {
        console.log("try k andar");
        const validUser = await User.findOne({email:email});
        console.log(validUser);
        if(!validUser){
            return res.status(404).json({message:'user not found'});
        }
        console.log("email is matched");
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword){
            return res.status(401).json({message:'invalid credentials'});
        }
        console.log("User logged in successfully");
        const {password:hashedPassword,...rest}=validUser._doc;
        const token = jwt.sign({email: validUser.email , id: validUser._id}, process.env.JWT_SECRET);
        // res.cookie('access_token', token, {httpOnly: true, secure: true, sameSite: 'None'}).status(200).json(validUser); 
        res.cookie('access_token', token, {httpOnly: false, secure: true, sameSite: 'None'}).status(200).json(validUser);
        console.log("Cookie saved");
    } catch (error) {
        console.log("Error signing in", error.message);
        next(error);
    }
};

export const logout = async(req, res)=>{
    res.clearCookie('access_token').json({message: 'Logged out successfully'});
};
