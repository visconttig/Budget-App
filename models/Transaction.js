const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new mongoose.Schema({
  date: Date,
  account: {
    type: Schema.Types.ObjectId,
    ref: "Presupuesto"
  },
  payee: String,
  category: {
    type: Schema.Types.ObjectId,
    ref: "Presupuesto"
  },
  description: String,
  ammount: Number
});


const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
