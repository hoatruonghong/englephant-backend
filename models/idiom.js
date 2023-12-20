import mongoose from "mongoose";
const { Schema } = mongoose;

const IdiomSchema = new Schema(
  {
    sentence: {
        type: String,
    },
    meaning: {
        type: String,
    }
  }
);

export default mongoose.model("idiom", IdiomSchema);
