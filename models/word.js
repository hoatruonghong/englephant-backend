import mongoose from "mongoose";
const { Schema } = mongoose;

const WordSchema = new Schema(
  {
    word: {
        type: Number,
    },
    familyWords: {
        type: String,
    }
  },
  { timestamps: true }
);


export default mongoose.model("word", WordSchema);
