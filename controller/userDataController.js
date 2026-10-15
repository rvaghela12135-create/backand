import userData from '../model/user.js'
import bcrypt from 'bcrypt';
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {folder: 'devb_users'},
            (error,result) => {
                if (error) return reject(error)
                resolve(result)
            })
        stream.end(buffer)
    })
}

export const addUser = async (req, res) => {
    try {
        // Hash password before saving
        const password = await bcrypt.hash(req.body.password, 10);
        let imageUrl = ""
        if(req.file) {
            const result = await uploadToCloudinary(req.file.buffer)
            imageUrl = result.secure_url
        }

        const userDataval = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            password: password,
            image:imageUrl                                                                                                                                                                                                                                                        
        };

        const saveUSerData = await userData.create(userDataval);

        res.status(200).json({
            message: "user added successfully",
            data: saveUSerData
        });

    } catch (error) {
        res.status(500).json({
            errorMessage: error.message
        });
    }
};


export const getUser = async (req, res) => {
    try {
        const getuserData = await userData.find();

        res.status(200).json({
            message: "user get successfully",
            data: getuserData
        });

    } catch (error) {
        res.status(500).json({
            errorMessage: error.message
        });
    }
};


export const getSingleUser = async (req, res) => {
    try {
        const id = req.params.uid;

        const getsingleUserdata = await userData.findById(id);

        res.status(200).json({
            message: "user get successfully",
            data: getsingleUserdata
        });

    } catch (error) {
        res.status(500).json({
            errorMessage: error.message
        });
    }
};


export const deleteUSer = async (req, res) => {
    try {
        const id = req.params.uid;

        const deleteuserData = await userData.findByIdAndDelete(id);

        res.status(200).json({
            message: "user deleted successfully",
            data: deleteuserData
        });

    } catch (error) {
        res.status(500).json({
            errorMessage: error.message
        });
    }
};


export const login = async (req, res) => {
    try {
        // Find user by email
        const uData = await userData.findOne({
            email: req.body.email
        });

        if (!uData) {
            return res.status(200).json({
                message: "User Not Found",
                status: 0
            });
        }

        // Compare entered password with hashed password
        const passwordMatch = await bcrypt.compare(
            req.body.password,
            uData.password
        );

        if (passwordMatch) {
            return res.status(200).json({
                message: "Login successfully",
                status: 1,
                data: uData
            });
        }

        return res.status(200).json({
            message: "Password Not Match",
            status: 0
        });

    } catch (error) {
        res.status(500).json({
            errorMessage: error.message
        });
    }
};