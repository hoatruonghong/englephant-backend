import express from "express"
import jwt from "jsonwebtoken"
import argon2 from "argon2"
const router = express.Router();

import { sendError, sendServerError, sendSuccess } from "../../helper/client.js"
import { verifyToken} from '../../middleware/index.js'
import { tutorRegisterValidate } from "../../validation/auth.js"

import Tutor from "../../models/tutor.js";

/**
 * @route POST /api/admin/tutor/create
 * @description create new tutor
 * @access public
 */
router.post('/create', async (req, res) => {
    const errors = tutorRegisterValidate(req.body)
    if (errors) return sendError(res, errors)
    let {username, password, email, phone, fullname, bornyear, nationality} = req.body 

    try {
        const isExistTutor = await Tutor.exists({
            $or: [
                { email, phone},
                { email, phone: null },
                { phone, email: null }
            ]
        })
        if (isExistTutor) return sendError(res, "Tutor already exists!")

        let oldPassword = password
        password = await argon2.hash(password)

        const tutor = await Tutor.create({username, password, email, phone, fullname, bornyear, nationality})
        return sendSuccess(res, "Register successfully", {tutor_id: tutor._id, username: username, password: oldPassword});
    } catch (error) {
        console.log(error);
        return sendServerError(res);   
    }
})

/**
 * @route GET /api/admin/tutor/
 * @description get tutors
 * @access public
 */
router.get('/', async (req, res) => {
    try {
        const tutors = await Tutor.find().select("-password");

        if (tutors) return sendSuccess(res, "Get tutors successfully.", tutors);
        return sendError(res, "Information not found.");
        
    } catch (error) {
        console.log(error);
        return sendServerError(res);  
    }
});

/**
 * @route GET /api/admin/tutor/:id
 * @description get tutor information
 * @access public
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const tutor = await Tutor.findById(id).select("-password");

        if (tutor) return sendSuccess(res, "Get user successfully.", tutor);;
        return sendError(res, "Information not found.");
        
    } catch (error) {
        console.log(error);
        return sendServerError(res);  
    }
});

/**
 * @route PUT /api/admin/tutor/:id
 * @description admin update tutor information
 * @access public
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { fullname, email, phone } = req.body

        const tutor = await Tutor.findById(id)
        if (!tutor) sendError(res, "Information not found.");

        await Tutor.findByIdAndUpdate(id, {phone: phone, email: email, fullname: fullname});
        return sendSuccess(res, "Update account information successfully.", { fullname, phone, email });        
    } catch (error) {
        console.log(error);
        return sendServerError(res);  
    }
});

/**
 * @route DELETE /api/admin/tutor/:id
 * @description admin deletes tutor account
 * @access public
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params

        const tutor = await Tutor.findById(id)
        if (!tutor) return sendError(res, "Information not found.");

        await Tutor.deleteOne({_id: id});
        return sendSuccess(res, "Delete account information successfully.", tutor);        
    } catch (error) {
        console.log(error);
        return sendServerError(res);  
    }
});
export default router
