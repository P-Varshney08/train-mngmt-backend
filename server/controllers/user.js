import User from "../models/User.js"
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'

export const addUser = async(req, res) => {
    const {username, email, password, phone, isAdmin, category} = req.body;
    console.log(username);
    try {
        if( !username || !email || !password || !phone || !category ) return res.json({message: 'Enter all details'});
        const isUesrExist = await User.findOne({ email });
        if (isUesrExist) return res.status(400).json({
            message : 'Email already in use.'
        })
        if(isAdmin===null) isAdmin=false;
        const newUser = await new User({
            email, username, password: bcryptjs.hashSync(password, 20), phone, isAdmin, category
        })
        const savedUser = await newUser.save();
        console.log(savedUser);

    } catch (error) {
        console.log(error); 
    }
}

export const getAllUsers = async(req, res)=>{
    
};
export const getUser = async(req, res)=>{
    
};
export const deleteUser = async(req, res)=>{
    
};