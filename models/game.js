import mongoose from "mongoose";
const { Schema } = mongoose;

const GameSchema = new Schema(
  {
    name: {
        type: Number,
    },
  },
  { timestamps: true }
);


export default mongoose.model("game", GameSchema);
