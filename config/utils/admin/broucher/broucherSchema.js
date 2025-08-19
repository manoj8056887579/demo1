import mongoose from "mongoose";

const broucherSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
});

const Broucher = mongoose.models.Broucher || mongoose.model("Broucher", broucherSchema);
export default Broucher;
