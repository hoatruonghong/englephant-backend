import express from "express"
const talkroomRouter = express.Router();
import { sendError, sendServerError, sendSuccess } from "../helper/client.js"
import Workshift from "../models/workshift.js"; // tutor register workshifts
import Session from "../models/session.js"; // actual joining to learn
import Learner from "../models/learner.js";

// api liên quan tới phòng giao tiếp cho learner

/**
 * @route GET /api/talkroom/available
 * @description query available talkrooms
 * @access public
 */
talkroomRouter.get('/available', async (req, res) => {
    try {
        const currentTime = new Date().toISOString();
        const rooms = await Workshift.find(
            {
                "startTime": { $lte: currentTime },
                "endTime": { $gte: currentTime },
            },
        );
        console.log(rooms[0].endTime-rooms[0].startTime, );
        if (rooms) return sendSuccess(res, "Get rooms successfully", rooms);
        return sendError(res, "No room available");        
    } catch (error) {
        console.log(error);
        return sendServerError(res);  
    }
});

/**
 * @route GET /api/talkroom/choose-room
 * @description system random choose room for learner
 * @access public
 */
talkroomRouter.get('/choose-room', async (req, res) => {
    try {
        const { learningTime, learnerId  } = req.body
        const currentTime = new Date().toISOString();
        const rooms = await Workshift.find(
            {
                "startTime": { $lte: currentTime },
                "endTime": { $gte: currentTime },
            },
        );
        if (rooms) return sendSuccess(res, "System choose this room", rooms);
        return sendError(res, "No room available");        
    } catch (error) {
        console.log(error);
        return sendServerError(res);  
    }
});

export default talkroomRouter