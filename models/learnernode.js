import mongoose from "mongoose";
const { Schema } = mongoose;

const LearnerNodeSchema = new Schema(
  {
    learnerId: {
        type: mongoose.Types.ObjectId, 
        ref: 'learner' ,
    },
    nodeId: {
        type: mongoose.Types.ObjectId, 
        ref: 'node' ,
    },
    mapId: {
      type: Number,
      ref: "map"
    },
    point: {
      type: Number,
      default: 0
    },
    totalnumofquiz: {
      type: Number,
      default: 0
    },
    time: {
      type: Number,
      default: 0
    },
  }
);


export default mongoose.model("learnernode", LearnerNodeSchema);