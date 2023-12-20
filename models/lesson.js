import mongoose from "mongoose";
const { Schema } = mongoose;

const LessonSchema = new Schema(
  {
    image: String,
    content: String,
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
  },
);


export default mongoose.model("lesson", LessonSchema);
