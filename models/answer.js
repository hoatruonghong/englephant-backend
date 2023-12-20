import mongoose from "mongoose";
const { Schema } = mongoose;

const AnswerSchema = new Schema(
  {
    content: {
        type: String,
    },
    audio: {
        type: String,
    },
    image: {
        type: String,
    },
    isCorrect: {
        type: Boolean,
    },
    quizId: {
      type: mongoose.Types.ObjectId, 
      ref: 'quiz' ,
    }
  },
);


export default mongoose.model("answer", AnswerSchema);
