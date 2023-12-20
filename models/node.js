import { ObjectId } from "mongodb";
import mongoose from "mongoose";
const { Schema } = mongoose;

const NodeSchema = new Schema(
  {
    mapId: {
      type: Number, 
      ref: 'map' ,
    },
    position: Number,
    type: {
      type: String,
      enum: ["Học", "Luyện tập", "Tổng kết"],
      default: "Học"
    },
    next: {
      type: mongoose.Types.ObjectId,
      ref: 'node'
    }
  },
);


export default mongoose.model("node", NodeSchema);
