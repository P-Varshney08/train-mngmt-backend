import User from "../models/User.js"

export const getAllUsers = async(req, res) => {
    try {
        const users = await User.find();
        if(!users) {
            return res.status(404).json({msg: 'No Users Found'});
        }
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Internal Server Error'});
    } 
}