const moment = require("moment");

const {Transaction, Presupuesto, presupuestoTest} = require("../models/models.js");


module.exports = (req, res) => {



  Presupuesto.find({}, async function(err, foundBudget) {
    if (err) {
      console.log(err);
    } else {
      if (foundBudget.length > 0) {
        const cashAccountId = foundBudget[0].accounts[0]._id;
        const debitAccountId = foundBudget[0].accounts[1]._id;
        let cash = foundBudget[0].accounts[0].accountAvailable;
        let debit = foundBudget[0].accounts[1].accountAvailable;
        const budgetId = foundBudget[0]._id;
        const categories = foundBudget[0].categories;

        const accounts = foundBudget[0].accounts;

        let transactions = [];
        Transaction
          .find({})
           //.populate({
             // path: "category",
             // model: "Presupuesto"})
          .populate("category")
          .exec(function(err, foundTransactions) {
            if (err) {
              console.log(err);
            } else {
              transactions = foundTransactions;
              console.log("Found transactions: -get-");
              console.log(foundTransactions);

              res.render("accounts", {
                cashAvailable: cash,
                debitAvailable: debit,
                budgetId: budgetId,
                 cashAccountId: cashAccountId,
                 debitAccountId: debitAccountId,
                transactions: transactions,
                moment: moment,
                categories: categories,

                accounts: accounts
              });
            }
          })

      } else { // not found budget
        console.log("Not transactions found." +
          " Creating example budget.");

        try {
          await presupuestoTest.save();
          res.redirect("/accounts");
        } catch (e) {
          console.log(e);
          res.status(400).send(e);
        }

      }
    }
  })

}
