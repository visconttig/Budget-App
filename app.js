const express = require("express");
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
//const moment = require("moment");

const Presupuesto = require("./models/Presupuesto");
const Transaction = require("./models/Transaction");
const presupuestoTest = require("./models/presupuestoTest");

// check date
const options = {
  day: "numeric",
  month: "numeric",
  year: "numeric"
};
let date = new Date();
date = date.toLocaleDateString();
console.log(date);

let assignedTotal = 0;
let availableTotal = 0;

const app = express();
app.use(express.static(path.resolve(__dirname, "public")));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: false
}));



//mongoose.connect("mongodb://localhost:27017/budgetDB");
mongoose.connect("mongodb+srv://visconttig2015:" + process.env.ATLAS_PASSWORD +
"@cluster0.xokad.mongodb.net/budgetDB");


const homeController = require("./controllers/home");
app.get("/", homeController);

const getAccountsControler = require("./controllers/getAccounts");
app.get("/accounts", getAccountsControler);



app.get("/budget", function(req, res) {
  Presupuesto.find({}, async function(err, foundBudget) {
    if (err) {
      console.log(err);
    } else {
      let excedeMaximo = false;
      if (foundBudget.length > 0) {
        let totalDisponible = 0;
        const accounts = foundBudget[0].accounts;
        accounts.forEach(function(account) {
          totalDisponible += account.accountAvailable;
        });

        assignedTotal = 0;
        const categories = foundBudget[0].categories;
        categories.forEach(function(category) {
          assignedTotal += category.categoryAssigned;

        });

        if (assignedTotal > totalDisponible ||
          assignedTotal < 0) {
          excedeMaximo = true;
        }

        totalDisponible -= assignedTotal;

        res.render("budget", {
          budget: foundBudget,
          categories: categories,
          totalDisponible: totalDisponible,
          excedeMaximo: excedeMaximo
        });
      } else {
        console.log("Budget not found. ---creating example budget---");

        try {
          // create example budget here...
          await presupuestoTest.save();

          res.redirect("/budget");
        } catch (e) {
          console.log(e);
          res.status(400).send(e);
        }

      }
    }
  })
});

app.post("/budget", async function(req, res) {
  const assigned = req.body.assigned;
  const budgetId = req.body.presupuestoId;
  const categoryId = req.body.categoryId;

  try {
    // Update assigned field in database
    await Presupuesto.updateOne({
      _id: budgetId,
      "categories._id": categoryId
    }, {
      "$set": {
        "categories.$.categoryAssigned": assigned,
        "categories.$.categoryAvailable": assigned
      }
    });
    console.log("Assigned field succesfully updated.")

    res.redirect("/budget");
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }

});

app.post("/add-category", async function(req, res) {
  console.log(req.body);
  const categoryName = req.body.categoryName;
  const budgetId = req.body.addCatButton;

  Presupuesto.updateOne({
      _id: budgetId
    }, {
      $push: {
        categories: {
          categoryName: categoryName
        }
      }
    },
    function(err, updated) {
      if (err) {
        console.log(err);
      } else {
        console.log(updated);
        res.redirect("/budget");
      }
    });

});


const postAccountsController = require("./controllers/postAccounts");
app.post("/accounts", postAccountsController);



app.listen(process.env.PORT || 3000, function() {
  console.log("Listening on port 3000...");
});
