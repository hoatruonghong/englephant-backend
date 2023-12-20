import mongoose from "mongoose";
const { Schema } = mongoose;

const QuizSchema = new Schema(
  {
    image: String,
    question: String,
    video: String,
    audio: String,
    node: {
      type: mongoose.Types.ObjectId, 
      ref: 'node' ,
    },
    flashcard: {
      type: mongoose.Types.ObjectId, 
      ref: 'flashcard' ,
    },
    type: {
      type: String,
      enum: ["Từ - Nghe", "Từ - Hình", "Phát âm - Hình", "Phát âm - Nghe", "Điền - Nghe", "Điền - Hình", "Học"],
      default: "Học"
    }
  },
);


export default mongoose.model("quiz", QuizSchema);
