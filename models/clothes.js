import mongoose from "mongoose";
const { Schema } = mongoose;

const ClothesSchema = new Schema(
  {
    name: {
        type: String,
    },
    image: {
        type: String,
    },
    price: {
        type: Number,
    }
  },
  { timestamps: true }
);


export default mongoose.model("clothes", ClothesSchema);
