import mongoose from "mongoose";
const { Schema } = mongoose;

const LearnerSoundSchema = new Schema(
  {
    learnerId: {
        type: mongoose.Types.ObjectId, 
        ref: 'learner' ,
    },
    soundId: {
        type: mongoose.Types.ObjectId, 
        ref: 'sound' ,
    },
    accuracy: Number
  }
);


export default mongoose.model("learnersound", LearnerSoundSchema);
