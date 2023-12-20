import mongoose from "mongoose";
const { Schema } = mongoose;

const LRQuizSchema = new Schema(
  {
    question: String,
    lesson: {
      type: mongoose.Types.ObjectId, 
      ref: 'lrl' ,
    }
  },
);


export default mongoose.model("lrquiz", LRQuizSchema);
