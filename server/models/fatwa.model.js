import mongoose from 'mongoose';
const { Schema } = mongoose;

const fatwaSchema = new Schema(
  {
    title: {
      type: String
    },
    brief: {
      type: String
    },
    question: {
      type: String
    },
    description: {
      type: String
    },
    src: {
      type: String
    },
    url: {
      type: String
    },
    lan: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const Fatwa = mongoose.model('Fatwa', fatwaSchema);

export default Fatwa;
