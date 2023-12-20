import mongoose from "mongoose";
const { Schema } = mongoose;

const ListeningReadingLessonSchema = new Schema(
  {
    name: String,
    image: String,
    description: String,
    audio: String,
    price: Number,
    next: {
      type: mongoose.Types.ObjectId, 
      ref: 'lrl' ,
    }
  }
);


export default mongoose.model("lrl", ListeningReadingLessonSchema);
