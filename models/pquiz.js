import mongoose from "mongoose";
const { Schema } = mongoose;

const PQuizSchema = new Schema(
  {
    question: String,
    word: String,
    audio: String,
    type: {
        type: String,
        enum: ["IPA", "Nghe", "Phát âm"]
    },
    sound: {
        type: mongoose.Types.ObjectId, 
        ref: 'sound' ,
    },
    category: {
        type: String,
        enum: ["Luyện tập", "Phân biệt"]
    }
  },
);


export default mongoose.model("pquiz", PQuizSchema);
