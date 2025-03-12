import mongoose from 'mongoose';

export async function connectionStr() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Database Connected");
  } catch (error) {
    console.error("❌ Database Connection Failed", error.message);
  }
}
