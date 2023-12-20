import express from "express"
import jwt from "jsonwebtoken"
import argon2 from "argon2"
const learnerRouter = express.Router();

import { sendError, sendServerError, sendSuccess } from "../helper/client.js"
import { verifyToken} from '../middleware/index.js'
import Learner from "../models/learner.js";

/**
 * @route GET /api/learner
 * @description get learner information
 * @access public
 */
learnerRouter.get('/', verifyToken, async (req, res) => {
    try {
        const learners = await Learner.find();

        if (learners) return sendSuccess(res, "Get learners successfully.", learners);
        return sendError(res, "Information not found.");
        
    } catch (error) {
        console.log(error);
        return sendServerError(res);  
    }
});

/**
 * @route GET /api/learner/:id
 * @description get learner information
 * @access public
 */
learnerRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const learner = await Learner.findById(id).
        select("-password");

        if (learner) return sendSuccess(res, "Get user successfully.", learner);
        return sendError(res, "Information not found.");
        
    } catch (error) {
        console.log(error);
        return sendServerError(res);  
    }
});

/**
 * @route PUT /api/learner/:id
 * @description update learner information
 * @access public
 */
learnerRouter.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { fullname, email, phone, bornYear, gender } = req.body

        const learner = await Learner.findById(id)
        if (!learner) sendError(res, "Information not found.");

        await Learner.findByIdAndUpdate(id, {phone: phone, email: email, fullname: fullname, bornYear: bornYear, gender: gender});
        return sendSuccess(res, "Update account information successfully.", { fullname, phone, email, bornYear, gender });        
    } catch (error) {
        console.log(error);
        return sendServerError(res);  
    }
});

/**
 * @route PUT /api/learner/:id/change-password
 * @description learner change password
 * @access public
 */
learnerRouter.put('/:id/change-password', async (req, res) => {
    try {
        const { id } = req.params
        const { oldPassword, newPassword } = req.body

        const learner = await Learner.findById(id)
        if (learner) {
            const passwordValid = await argon2.verify(learner.password, oldPassword)
            if (!passwordValid) return sendError(res, 'current password is wrong')
        }
        else return sendError(res, 'learner not exists')    

        const password = await argon2.hash(newPassword)

        await Learner.findByIdAndUpdate(id, {password: password});
        return sendSuccess(res, "Change password successfully.");

    } catch (error) {
        console.log(error);
        return sendServerError(res);
    }
});

/**
 * @route DELETE /api/learner/:id
 * @description learner deletes account
 * @access public
 */
learnerRouter.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params

        const learner = await Learner.findById(id)
        if (!learner) return sendError(res, "Information not found.");

        await Learner.deleteOne({_id: id});
        return sendSuccess(res, "Delete account information successfully.", learner);        
    } catch (error) {
        console.log(error);
        return sendServerError(res);  
    }
});
export default learnerRouter
