import mongoose from "mongoose";
const { Schema } = mongoose;

const LearnerPLSchema = new Schema(
  {
    learnerId: {
        type: mongoose.Types.ObjectId, 
        ref: 'learner' ,
    },
    plId: {
        type: mongoose.Types.ObjectId, 
        ref: 'pl' ,
    },
    progress: Number
  }
);


export default mongoose.model("learnerpl", LearnerPLSchema);
