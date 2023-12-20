import mongoose from "mongoose";
const { Schema } = mongoose;

const PAnswerSchema = new Schema(
  {
    content: {
        type: String,
    },
    isCorrect: {
        type: Boolean,
    },
    quizId: {
      type: mongoose.Types.ObjectId, 
      ref: 'pquiz' ,
    }
  },
);


export default mongoose.model("panswer", PAnswerSchema);
