const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const presupuestoSchema = new mongoose.Schema({
  budgetName: String,
  accounts: [{
    accountName: String,
    accountType: Schema.Types.ObjectId,
    accountAvailable: {
      type: Number,
      default: 0
    }
  }],
  categories: [{
    categoryName: String,
    categoryAvailable: {
      type: Number,
      default: 0
    },
    categoryAssigned: {
      type: Number,
      default: 0
    }
  }]
});

const Presupuesto = mongoose.model("Presupuesto", presupuestoSchema);

module.exports = Presupuesto;
