import mongoose from "mongoose";
const { Schema } = mongoose;

const LearnerSessionSchema = new Schema(
  {
    learnerId: {
        type: mongoose.Types.ObjectId, 
        ref: 'learner' ,
    },
    sessionId: {
        type: mongoose.Types.ObjectId, 
        ref: 'session' ,
    },
    rating: Number
  }
);


export default mongoose.model("learnersession", LearnerSessionSchema);
