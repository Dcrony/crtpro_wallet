import mongoose from 'mongoose';

const conversionRateSchema = new mongoose.Schema(
  {
    rate: {
      type: Number,
      required: true,
      default: 1.0, // Default 1 USD = 1 USDT
      min: [0.0001, 'Rate must be positive'],
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Singleton pattern - only one rate document should exist
conversionRateSchema.statics.getCurrentRate = async function () {
  let rateDoc = await this.findOne();
  if (!rateDoc) {
    // Create default rate if none exists
    rateDoc = await this.create({
      rate: 1.0,
      updatedBy: new mongoose.Types.ObjectId(), // Placeholder, should be admin
    });
  }
  return rateDoc;
};

const ConversionRate = mongoose.model('ConversionRate', conversionRateSchema);
export default ConversionRate;