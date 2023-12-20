import express from "express"
import jwt from "jsonwebtoken"
import argon2 from "argon2"

import Tutor from "../../models/tutor.js"
import Admin from "../../models/admin.js"
import { sendError, sendServerError, sendSuccess} from "../../helper/client.js"
import { learnerRegisterValidate, userLoginValidate } from "../../validation/auth.js"
import { verifyToken} from '../../middleware/index.js'
// import { TOKEN_LIST, TOKEN_BLACKLIST } from './../../index.js';

const authRouter = express.Router()

/**
 * @route POST /api/web/auth/login
 * @description tutor/admin login
 * @access public
 */
authRouter.post('/login', async (req, res) => {
    const errors = userLoginValidate(req.body)
    if (errors) return sendError(res, errors)
    let {username, password} = req.body 
    try {
        let learner = await Learner.findOne({
            username
        })
        let successLogin = true 
        if (learner) {
            const passwordValid = await argon2.verify(learner.password, password)
            if (!passwordValid) successLogin = false
        }
        else return sendError(res, 'learner not exists')
        if (!successLogin) return sendError(res, 'password is wrong')
        const learnerData = {
            id: learner._id,
            username: username,
            email: learner.email,
            phone: learner.phone,
            mode: learner.defaultMode
        }
        const accessToken = jwt.sign(
            {user: learnerData},
            process.env.JWT_SECRET_KEY,
            // {expiresIn: '5m'}
        )

        const response = {
            accessToken,
        }

        return sendSuccess(res, 'Login successfully.', {
            response,
            user: learnerData
        })

    } catch (error) {
        console.log(error);
        return sendServerError(res);  
    }
})

/**
 * @route POST /api/web/auth/logout
 * @description tutor/admin log out
 * @access private
 */
// authRouter.post('/logout', verifyToken, async (req, res) => {
//     const { refreshToken } = req.body
//     if (refreshToken in TOKEN_LIST)
//         delete TOKEN_LIST[refreshToken]
//     else return sendError(res, 'refresh token is invalid.', 401)
//     try {
//         jwt.verify(req.verifyToken, process.env.JWT_SECRET_KEY, {
//             complete: true
//         })
//         TOKEN_BLACKLIST[req.verifyToken] = req.verifyToken
//         clearTokenList(TOKEN_BLACKLIST)
//     } catch (error) { }
//     return sendSuccess(res, 'log out successfully.')
// })

export default authRouter