const mongoose = require("mongoose");
const {Presupuesto, Transaction} = require("../models/models.js");

module.exports = async (req, res) => {
  const date = new Date(req.body.date);
  const accountId = mongoose.Types.ObjectId(req.body.accountType.trim());
  const payee = req.body.payee.trim();
  const description = req.body.description.trim();
  const ammount = req.body.ammount.trim();
  const budgetId = mongoose.Types.ObjectId(req.body.budgetId.trim());
  let category = req.body.category.trim();
  if(category == ""){
    category = null;
  } else {
    category = mongoose.Types.ObjectId(category);

  }


  // test
  console.log("CATEGORY: " + category);

  try {
    // save new transction to db.
    await new Transaction({
      date: date,
      account: accountId,
      payee: payee,
      category: category,
      description: description,
      ammount: ammount
    }).save();
    console.log("Transaction succesfully saved to db.");
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }

  // deduct transaction from category available
  Presupuesto.findOne({
      "categories._id": category
    },
    function(err, found) {
      if (err) {
        console.log(err);
      } else {
        console.log("result: ");
        //  console.log(found);
        console.log(found.categories.id(category));

        let foundCat = found.categories.id(category);
        let catAvailable = foundCat.categoryAvailable;
    //    let catAssigned = foundCat.categoryAssigned;
        let newAvailable = Number(catAvailable) + Number(ammount);
    //    let newAssigned = Number(catAssigned) + Number(ammount);
        // test
        console.log("NEW AVAILABLE: " + newAvailable);

        Presupuesto.updateOne({
          found,
          "categories._id": category
        }, {
          $set: {
            "categories.$.categoryAvailable": newAvailable
            // replace for 'activity field'
          //  "categories.$.categoryAssigned": newAssigned
          }
        }, function(err, updated) {
          if (err) {
            console.log(err);
          } else {
            console.log(updated);
          }
        });
      }
    });

  let newAccountTotal = 0;
  // search for 'this account' transactions
  Transaction.find({
      account: accountId
    },
    function(err, transactionsFound) {
      if (err) {
        console.log(err);
      } else {
        transactionsFound.forEach(function(transaction) {
          newAccountTotal += transaction.ammount;
        });

        // update account available in db.
        Presupuesto.updateOne({
            _id: budgetId,
            "accounts._id": accountId
          }, {
            $set: {
              "accounts.$.accountAvailable": newAccountTotal
            }
          },
          function(err) {
            if (err) {
              console.log(err);
            } else {
              console.log("New account total updated succesfully");
              res.redirect("/accounts");
            }
          });
      }
    });
}
