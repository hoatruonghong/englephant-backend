import mongoose from "mongoose";
const { Schema } = mongoose;

const TutorSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String, trim: true, index: {
        unique: true,
        partialFilterExpression: {email: {$type: "String"}}
      }
    },
    phone: {
      type: String, trim: true, index: {
        unique: true,
        partialFilterExpression: {phone: {$type: "String"}}
      }
    },
    fullname: {
      type: String,
      required: true,
    },
    bornyear: {
      type: String,
      required: true,
    },
    nationality: String,
    introduction: String,
    avatar: String,
    numofrating: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);


export default mongoose.model("tutor", TutorSchema);
