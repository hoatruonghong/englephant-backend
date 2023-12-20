import mongoose from "mongoose";
const { Schema } = mongoose;

const LearnerCardSchema = new Schema(
  {
    learnerId: {
        type: mongoose.Types.ObjectId, 
        ref: 'learner' ,
    },
    cardId: {
        type: mongoose.Types.ObjectId, 
        ref: 'card' ,
    },
    nodeId: {
      type: mongoose.Types.ObjectId, 
      ref: 'node' ,
    },
    mapId: {
      type: Number, 
      ref: 'map' ,
    },
    status: {
      type: String,
      enum: ["Mới học", "Gần nhớ", "Đã nhớ"],
      default: "Mới học"
    }
  }
);


export default mongoose.model("learnercard", LearnerCardSchema);
