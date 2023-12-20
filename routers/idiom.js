import express from "express"
const idiomRouter = express.Router();

import { sendError, sendServerError, sendSuccess } from "../helper/client.js"
import Idiom from "../models/idiom.js";

/**
 * @route GET /api/idiom
 * @description get all idioms
 * @access public
 */
idiomRouter.get('/', async (req, res) => {
    try {
        const idioms = await Idiom.find();

        if (idioms) return sendSuccess(res, "Get idioms successfully.", idioms);
        return sendError(res, "Information not found.");
        
    } catch (error) {
        console.log(error);
        return sendServerError(res);  
    }
});

/**
 * @route GET /api/idiom/random
 * @description get a random idiom
 * @access public
 */
idiomRouter.get('/random', async (req, res) => {
    try {
        const count = await Idiom.count();
        var index = Math.floor(Math.random()*count);
        const idiom = await Idiom.findOne().skip(index);
        if (idiom) return sendSuccess(res, "get successfully", idiom);
        return sendError(res, "Information not found.");
    } catch (error) {
        console.log(error);
        return sendServerError(res);  
    }
});

/**
 * @route POST /api/idiom
 * @description post an idiom
 * @access public
 */
idiomRouter.post('/', async (req, res) => {
    try {
        let {sentence, meaning} = req.body;
        const idiom = await Idiom.create({sentence, meaning});
        if (idiom) return sendSuccess(res, "Post an idiom successfully.", idiom);
        return sendError(res, "Fail!!");
        
    } catch (error) {
        console.log(error);
        return sendServerError(res);  
    }
});

/**
 * @route PUT /api/idiom/:id
 * @description update an idiom
 * @access public
 */
idiomRouter.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { sentence, meaning} = req.body

        const idiom = await Idiom.findById(id)
        if (!idiom) return sendError(res, "Information not found.");

        await Idiom.findByIdAndUpdate(id, {sentence: sentence, meaning: meaning});
        return sendSuccess(res, "Update successfully.", { sentence, meaning });        
    
    } catch (error) {
        console.log(error);
        return sendServerError(res);  
    }
});

/**
 * @route DELETE /api/idiom/:id
 * @description learner deletes idiom
 * @access public
 */
idiomRouter.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params

        const idiom = await Idiom.findById(id)
        if (!idiom) return sendError(res, "Information not found.");

        await Idiom.deleteOne({_id: id});
        return sendSuccess(res, "Delete successfully.", idiom);        
    } catch (error) {
        console.log(error);
        return sendServerError(res);  
    }
});

export default idiomRouter