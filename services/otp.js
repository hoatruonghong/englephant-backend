import { OTP_EXPIRED } from './../constant';

export const generateOTP() => {
    return {
        value: Math.floor(100000 + Math.random() * 900000).toString(),
        expired: Date.now() + OTP_EXPIRED
    }
}
