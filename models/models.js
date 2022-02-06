const mongoose = require("mongoose");
//const Schema = mongoose.Schema;


const presupuestoSchema = new mongoose.Schema({
  budgetName: String,
  accounts: [{
    accountName: String,
    accountType: mongoose.Types.ObjectId,
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



const transactionSchema = new mongoose.Schema({
  date: Date,
  account: {
    type: mongoose.Types.ObjectId,
    ref: "Presupuesto"
  },
  payee: String,
  category: {
    type: mongoose.Types.ObjectId,
    ref: "Presupuesto"
  },
  description: String,
  ammount: Number
});


const Transaction = mongoose.model("Transaction", transactionSchema);



const presupuestoTest = new Presupuesto({
  budgetName: "Test",
  accounts: [{
      accountName: "Efectivo"
    },
    {
      accountName: "Fan Banco Chile"
    }
  ],
  categories: [
    // GASTOS FIJOS
    {
      categoryName: "=Ready to assign="
    },
    {
      categoryName: "1 CUOTA AUTITO $ 214.507"
    },
    {
      categoryName: "1 ESTACIONAMIENTO $ 60.000"
    },
    {
      categoryName: "2 TELEFONO MOVIL $ 4.000"
    },
    {
      categoryName: "3 COPAGOS ANGIE $ 195.000"
    },
    {
      categoryName: "Cuota *mensual* YNAB $ 13.000"
    },
    // GASTOS 'REALES'
    {
      categoryName: "1/SEM BENCINA $ 25.000"
    },
    {
      categoryName: "Medicamentos $ 14.000"
    },
    {
      categoryName: "Supermercado & compras de camino."
    },
    {
      categoryName: "Premios / regaloneos personales."
    },
    {
      categoryName: "Otros"
    },
    {
      categoryName: "**Ajustes/conciliaciones**"
    },
    // METAS / OBJETIVOS
    {
      categoryName: "FONDO DE EMERGENCIA"
    },
    {
      categoryName: "DESARROLLO PERSONAL"
    },
    // PRÉSTAMOS
    {
      categoryName: "Préstamo Vale2"
    },
    // CAPRICHOS
    {
      categoryName: "Otros gastos (Ej: Mercadolibre, Aliexpress, etc.)"
    },
    {
      categoryName: "Regaloneos Angie 💖"
    },
    // GASTOS ANUALES / ESPORÁDICOS
    {
      categoryName: "Corte de cabello"
    },
    {
      categoryName: "Automóvil: Otros."
    }
    // OTHER HIDDEN CATEGORIES
    // *Revisión Técnica
    // *Permiso de Circulación
    // *Seguro SOAP
    // *Multas de Tránsito
    // *Vulcanización
    // *Cambio de aceite
    // *Uber-Driver: Otros (ej: guantes).
  ]
});

module.exports = {Presupuesto, Transaction, presupuestoTest};
