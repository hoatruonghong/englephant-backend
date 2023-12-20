import mongoose from "mongoose";
const { Schema } = mongoose;

const PronunciationLessonSchema = new Schema(
  {
    name: String,
    sound1: {
        type: mongoose.Types.ObjectId, 
        ref: 'sound' ,
    },
    sound2: {
      type: mongoose.Types.ObjectId, 
      ref: 'sound' ,
    }
  }
);


export default mongoose.model("pl", PronunciationLessonSchema);
