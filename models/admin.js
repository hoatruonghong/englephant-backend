import mongoose from "mongoose";
const { Schema } = mongoose;

const AdminSchema = new Schema(
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
  },
  { timestamps: true }
);

AdminSchema.pre("validate", function (next) {
  let hasProvider = false;
  if (
    (this.email && this.email.length > 0) ||
    (this.phone && this.phone.length > 0)
  ) {
    hasProvider = true;
  }
  return hasProvider ? next() : next(new Error("No Provider provided"));
});

export default mongoose.model("admin", AdminSchema);