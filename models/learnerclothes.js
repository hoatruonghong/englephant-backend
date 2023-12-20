import mongoose from "mongoose";
const { Schema } = mongoose;

const LearnerClothesSchema = new Schema(
  {
    learnerId: {
        type: mongoose.Types.ObjectId, 
        ref: 'learner' ,
    },
    clothesId: {
        type: mongoose.Types.ObjectId, 
        ref: 'clothes' ,
    },
  }
);


export default mongoose.model("learnerclothes", LearnerClothesSchema);
