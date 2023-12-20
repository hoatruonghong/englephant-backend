import mongoose from "mongoose";
const { Schema } = mongoose;

const LearnerGameSchema = new Schema(
  {
    learnerId: {
        type: mongoose.Types.ObjectId, 
        ref: 'learner' ,
    },
    gameId: {
        type: mongoose.Types.ObjectId, 
        ref: 'game' ,
    },
    highestScore: Number,
  }
);


export default mongoose.model("learnergame", LearnerGameSchema);
