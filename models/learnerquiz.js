import mongoose from "mongoose";
const { Schema } = mongoose;

const LearnerQuizSchema = new Schema(
  {
    learnerId: {
        type: mongoose.Types.ObjectId, 
        ref: 'learner' ,
    },
    quizId: {
        type: mongoose.Types.ObjectId, 
        ref: 'quiz' ,
    },
    accuracy: Number
  }
);


export default mongoose.model("learnerquiz", LearnerQuizSchema);
