import express from "express"
const workshiftRouter = express.Router();

import { sendError, sendServerError, sendSuccess } from "../../helper/client.js"
import Workshift from "../../models/workshift.js";
import Tutor from "../../models/tutor.js";

/**
 * @route POST /api/tutor/workshift/new
 * @description tutor register new workshift
 * @access public
 */
workshiftRouter.post('/new', async (req, res) => {
    try {
        let {tutorId, date, startTime, endTime} = req.body;
        const tutor = await Tutor.findById(tutorId);
        if (!tutor) return sendError(res, "Tutor not exists");

        const workshift = await Workshift.create({tutorId: tutor,  date, startTime, endTime})

        if (workshift) return sendSuccess(res, "Register successfully.", workshift);
        return sendError(res, "Information not found.");
        
    } catch (error) {
        console.log(error);
        return sendServerError(res);  
    }
});

export default workshiftRouter