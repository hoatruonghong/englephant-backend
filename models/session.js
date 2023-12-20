import mongoose from "mongoose";
const { Schema } = mongoose;

const SessionSchema = new Schema(
  {
    startTime: {
        type: Date,
    },
    duration: Number,
    tutorId: {
      type: mongoose.Types.ObjectId, 
      ref: 'tutor' ,
    }
  },
);


export default mongoose.model("session", SessionSchema);
