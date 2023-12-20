import mongoose from "mongoose";
const { Schema } = mongoose;

const MapSchema = new Schema(
  {
    _id: Number,
    name: String,
    mode: String,
    price: Number,
    image: String,
    previousmap: {
      type: Number, 
      ref: 'map' ,
    },
    nextmap: {
      type: Number, 
      ref: 'map' ,
    },
  },
);


export default mongoose.model("map", MapSchema);
