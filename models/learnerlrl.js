import mongoose from "mongoose";
const { Schema } = mongoose;

const LearnerLRLSchema = new Schema(
  {
    learnerId: {
        type: mongoose.Types.ObjectId, 
        ref: 'learner' ,
    },
    lrlId: {
        type: mongoose.Types.ObjectId, 
        ref: 'lrl' ,
    },
    point: Number,
    total: Number
  }
);


export default mongoose.model("learnerlrl", LearnerLRLSchema);
