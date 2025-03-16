import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  creditHour: {
    type: Number,
    required: true,
  },
  classes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class", // ✅ Reference to Class model
    },
  ],
});

const Subject = mongoose.models.Subject || mongoose.model("Subject", subjectSchema);

export default Subject;
