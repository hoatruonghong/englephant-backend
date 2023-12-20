import mongoose from "mongoose";
const { Schema } = mongoose;

const HistorySchema = new Schema(
  {
    learningTime: Number,
    learnerId: {
      type: mongoose.Types.ObjectId, 
      ref: 'learner' ,
    },
    flcNum: Number,
  },
  { timestamps: true }
);


export default mongoose.model("history", HistorySchema);
