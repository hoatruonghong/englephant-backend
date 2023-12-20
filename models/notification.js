import mongoose from "mongoose";
const { Schema } = mongoose;

const NotificationSchema = new Schema(
  {
    content: String
  },
  { timestamps: true }
);


export default mongoose.model("notification", NotificationSchema);
