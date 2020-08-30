const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.listen(3000, function () {
  console.log("App listening on port 3000!");
});
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: "tst28463@gmail.com",
    pass: "tst_12345678",
  },
});

app.post("/sendEmail", function (req, res) {
  const email = JSON.parse(req.body.email);
  var orderProducts = JSON.parse(req.body.data);
  var receipt = "";
  var totalPrice = 0;
  for (var i = 0; i < orderProducts.length; i++) {
    receipt +=
      i +
      1 +
      "-" +
      orderProducts[i].product.name +
      "        " +
      orderProducts[i].quantity +
      "        $" +
      orderProducts[i].quantity * orderProducts[i].product.price +
      "\n";
    totalPrice += orderProducts[i].quantity * orderProducts[i].product.price;
  }
  console.log(orderProducts);
  console.log(email);
  const mailOptions = {
    from: "tst28463@gmail.com",
    to: email,
    subject: "ACME Inventory Customer Comfirmation Order",
    text:
      "Message From: " +
      "ACME Inventory" +
      "This is a Comfirmation email of your order!" +
      "\n" +
      receipt +
      "---------------------" +
      "\n" +
      "Total Price: $" +
      totalPrice,
  };
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log("Error Occurs", err);
    } else {
      res.send();
      console.log("Email sent!!" + data);
    }
  });
});
