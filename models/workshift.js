import mongoose from "mongoose";
const { Schema } = mongoose;

const WorkshiftSchema = new Schema(
  {
    tutorId: {
      type: mongoose.Types.ObjectId, 
      ref: 'tutor' ,
    },
    date: { type: Date, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
  },
  { timestamps: true }
);


export default mongoose.model("workshift", WorkshiftSchema);
