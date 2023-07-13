const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
router.use(express.json());
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");
const bcrypt = require("bcryptjs");

router.post("/", async (req, res) => {
  const { Email } = req.body;
  const User = await UserModel.findOne({ Email });
  if (!User) return res.send("Email Not Found");
  const secret = process.env.TOKEN_SECRET + User.Password;
  const payload = {
    id: User._id,
    Email: User.Email,
  };
  let link = "";
  jwt.sign(payload, secret, { expiresIn: "10m" }, async (err, token) => {
    if (err) console.log(err.message);
    link = `${process.env.CLIETN_URL}/reset-password/${User._id}/${token}`;
    const sender = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.Email,
        pass: process.env.Email_password,
      },
    });

    let info = await sender.sendMail({
      from: process.env.Email,
      to: Email, // list of receivers
      subject: "Password Reset", // Subject line
      html: `<div>
        <h1>Password Reset</h1>
        <p>Reset Your Password : <a href = ${link}>Click Here To Change Password</a></p>
      </div>`,
    });
    nodemailer.getTestMessageUrl(info);
    res.status(200).json({ message: "Email Sent", type: "success" });
  });
});

const validateToken = (token, secret) => {
  try {
    const tkn = jwt.verify(token, secret);
    return true;
  } catch (err) {
    // const res = err.message === "jwt expired" ? false : err.message;
    return false;
  }
};

router.get("/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  try {
    const user = await UserModel.findById({ _id: id });
    if (!user) return res.send("user Not Found");
    const secret = process.env.TOKEN_SECRET + user.Password;
    const isValid = validateToken(token, secret);
    res.send(isValid);
  } catch (err) {
    res.send(err.message);
  }
});

router.post("/:id/:token", async (req, res) => {
  const { Password } = req.body;
  const { id, token } = req.params;
  try {
    const User = await UserModel.findById({ _id: id });
    if (!User) return res.send("User Not Found");
    const secret = process.env.TOKEN_SECRET + User.Password;
    const isValid = validateToken(token, secret);
    if (isValid === true) {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(Password, salt);
      User.Password = hashedPass;
      const cus = await UserModel.findByIdAndUpdate(id, User);
      res.status(200).json({ message: "Password Updated", type: "success" });
    }
  } catch (err) {
    res.send(err.message);
  }
});
module.exports = router;
