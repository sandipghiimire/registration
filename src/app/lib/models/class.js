import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject", // Ensure this is "Subject"
    },
  ],
});

const Class = mongoose.models.Class || mongoose.model("Class", classSchema);

export default Class;
