import mongoose from "mongoose";
const { Schema } = mongoose;

const FlashCardSchema = new Schema(
  {
    _id: mongoose.Types.ObjectId,
    word: String,
    viemeaning: String,
    pos: String,
    audio: String,
    pronunciation: String,
    star: Number,
    synonym: [Object],
    antonym: [Object],
    prefix: String,
    postfix: String,
    image: String,
    familywords: String,
    nodeId: {
      type: mongoose.Types.ObjectId, 
      ref: 'node' ,
    }
  }
);


export default mongoose.model("flashcard", FlashCardSchema);
