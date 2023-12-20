import mongoose from "mongoose";
const { Schema } = mongoose;

const LearnerSchema = new Schema(
{
    username: {
        type: String,
        required: true,
        unique: true,
    },
    fullname: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String, trim: true, index: {
            unique: true,
            partialFilterExpression: {email: {$type: "String"}}
        }
    },
    phone: {
        type: String, trim: true, index: {
            unique: true,
            partialFilterExpression: {phone: {$type: "String"}}
        }
    },
    bornYear: {
        type: Number,
    },
    gender: {
        type: String,
        enum: ["Nam", "Nữ", "Khác"],
    },
    heart: {
        type: Number,
        default: 0,
    },
    bud: {
        type: Number,
        default: 0,
    },
    peanut: {
        type: Number,
        default: 0,
    },
    defaultmode: {
        type: String,
        enum: ["Trẻ em", "Thanh thiếu niên", "Người lớn"],
        default: 'Trẻ em',
    },
    targetTime: {
        type: Number,
        require: true,
    },
    clothesId: {
        type: mongoose.Types.ObjectId, 
        ref: 'clothes' ,
    },
    talkroomTime: {
        type: Number,
        default: 0,
    },
    currentMap: {
        type: Number,
        default: 2,
    }
},
{ timestamps: true}
);

export default mongoose.model("learner", LearnerSchema);