import mongoose from "mongoose";
const { Schema } = mongoose;

const SoundSchema = new Schema(
  {
    name: String,
    audio: String,
    video: String
  }
);


export default mongoose.model("sound", SoundSchema);
