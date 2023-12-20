import express from "express"
import jwt from "jsonwebtoken"
import argon2 from "argon2"
const router = express.Router();

import { sendError, sendServerError, sendSuccess } from "../../helper/client.js"
import { verifyToken} from '../../middleware/index.js'

import Exchangetable from "../../models/exchangetable.js";

/**
 * @route POST /api/admin/exchangetable/new
 * @description create new exchange unit
 * @access public
 */
router.post('/new', async (req, res) => {
    try {
        const {fromUnit, toUnit, fromAmount, toAmount} = req.body 
        const units = await Exchangetable.create({fromUnit, toUnit, fromAmount, toAmount})
        return sendSuccess(res, "Add new exchange units successfully", units);
    } catch (error) {
        console.log(error);
        return sendServerError(res);   
    }
})

/**
 * @route GET /api/admin/exchangetable/
 * @description query exchange units
 * @access public
 */
router.get('/', async (req, res) => {
    try {
        const units = await Exchangetable.find();

        if (units) return sendSuccess(res, "Get successfully.", units);
        return sendError(res, "Information not found.");
        
    } catch (error) {
        console.log(error);
        return sendServerError(res);  
    }
});

/**
 * @route PUT /api/admin/exchangetable/:id
 * @description admin update exchangetable
 * @access public
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { fullname, email, phone } = req.body

        const unit = await Exchangetable.findById(id)
        if (!unit) sendError(res, "Information not found.");

        await Exchangetable.findByIdAndUpdate(id, {phone: phone, email: email, fullname: fullname});
        return sendSuccess(res, "Update successfully.", { fullname, phone, email });        
    } catch (error) {
        console.log(error);
        return sendServerError(res);  
    }
});

/**
 * @route DELETE /api/admin/exchangetable/:id
 * @description admin deletes exchangetable unit
 * @access public
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params

        const unit = await Exchangetable.findById(id)
        if (!unit) return sendError(res, "Information not found.");

        await Exchangetable.deleteOne({_id: id});
        return sendSuccess(res, "Delete successfully.", unit);        
    } catch (error) {
        console.log(error);
        return sendServerError(res);  
    }
});
export default router
