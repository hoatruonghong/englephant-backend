import mongoose from "mongoose";
const { Schema } = mongoose;

const TransactionSchema = new Schema(
  {
    code: {
        type: String,
    },
    amount: {
        type: Number,
    },
    paymentMethod: {
        type: String,
    },
    description: {
        type: String,
    }
  },
  { timestamps: true }
);


export default mongoose.model("transaction", TransactionSchema);
