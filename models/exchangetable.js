import mongoose from "mongoose";
const { Schema } = mongoose;

const ExchangeTableSchema = new Schema(
  {
    fromUnit: String,
    toUnit: String,
    fromAmount: Number,
    toAmount: Number,
  },
  { timestamps: true }
);


export default mongoose.model("exchangetable", ExchangeTableSchema);
