import express, { Route } from "express"
import {addUser,getUser,getSingleUser,deleteUSer,login} from "../controller/userDataController.js"
import upload from "../utils/uploadMiddleware.js";

const router = express.Router()
router.POST('/api/add-User',upload.single('image'),addUser)
router.get('/api/get-user',getUser)
router.get('/api/get-singleuser/:uid',getSingleUser)
router.delete('/api/delete-user/:uid',deleteUSer)
router.post('/api/login',login)


export default router