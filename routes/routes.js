const express = require("express");
const User = require("../models/User");
const Contact = require("../models/Contact"); // Import the Contact model
const route = express.Router();
const path = require("path");

route.get("/", (req, res) => {
  const loginUser = req.session.loginUser;
  res.render("index", {
    loginUser: loginUser,
  });
});
route.get("/register", (req, res) => {
  const loginUser = req.session.loginUser;
  res.render("registration", {
    loginUser: loginUser,
  });
});

route.get("/login", (req, res) => {
  const loginUser = req.session.loginUser;
  //   console.log("loginUser:", loginUser);

  res.render("login", {
    loginUser: loginUser,
    invalid: req.session.invalid || false,
    logout: req.session.logout || false,
    loginFirst: req.session.loginFirst || false,
    newRegister: req.session.newRegister || false,
  });
});

route.post("/loginUser", async (req, res) => {
  const data = await User.findOne({ email: req.body.email });
  console.log("🚀 ~ route.post ~ data:", data);
  if (data == null) {
    res.render("login", {
      invalid: true,
      email: req.body.email,
    });
  } else {
    req.session.loginUser = data;
    res.redirect("/dashboard");
  }
});

route.get("/logout", (req, res) => {
  req.session.destroy();
  res.render("login", {
    logout: true,
  });
});

route.post("/saveRegistration", async (req, res) => {
  await User.create(req.body);
  res.render("login", {
    newRegister: true,
    loginUser: req.body,
    invalid: req.session.invalid || false,
    logout: req.session.logout || false,
    loginFirst: req.session.loginFirst || false,
    newRegister: req.session.newRegister || false,
  });
});

route.get("/admin", (req, res) => {
  res.render("adminLogin");
});

route.post("/loginAdmin", async (req, res) => {
  const loginUser = await User.findOne({ email: req.body.email });
  if (loginUser.type == "normal") {
    res.render("login", {
      loginFirst: true,
    });
  } else {
    res.render("adminDashboard", {
      loginUser: loginUser,
    });
  }
});
route.get("/dashboard", (req, res) => {
  if (req.session.loginUser) {
    const loginUser = req.session.loginUser;
    // console.log("🚀 ~ route.get ~ loginUser:", loginUser);
    if (req.session.loginUser.type == "normal") {
      res.render("userPages/userDashboard", {
        loginUser: loginUser,
      });
    } else if (req.session.loginUser.type == "admin") {
      res.render("adminDashboard", {
        loginUser: loginUser,
      });
    }
  } else
    res.render("login", {
      loginFirst: true,
    });
});

route.get("/message", (req, res) => {
  const loginUser = req.session.loginUser;
  res.render("message", {
    loginUser: loginUser,
  });
});

// Render contactus.ejs for contact page
route.get("/contactus", (req, res) => {
  const loginUser = req.session.loginUser;
  console.log("🚀 ~ route.get ~ loginUser:", loginUser);
  res.render("contactus", {
    loginUser: loginUser,
  });
});

// Handle form submission
route.post("/contactus", async (req, res) => {
  try {
    const loginUser = req.session.loginUser;
    console.log("🚀 ~ route.get ~ loginUser:", loginUser);
    const { name, email, phone, message } = req.body;
    const contact = new Contact({ name, email, phone, message });
    await contact.save();
    res.status(200).render("message", {
      loginUser: loginUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to send message");
  }
});

// Render aboutus.ejs for about us page
route.get("/aboutus", (req, res) => {
  const loginUser = req.session.loginUser;
  console.log("🚀 ~ route.get ~ loginUser:", loginUser);
  res.render("aboutus", {
    loginUser: loginUser,
  });
});

module.exports = route;
