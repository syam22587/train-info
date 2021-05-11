require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");

const dbConnection = require("../database");
const db = dbConnection.db;

app.use(express.json());
app.use(cors());

app.post("/login", async (req, res) => {
  // authenticate user
  console.log("request.body", req.body);

  const userEmail = req.body.userName;
  const userPassword = req.body.password;

  try {
    let user = await getUserDetails(userEmail, userPassword);
    if (user.row) {
      const payloadUser = { userEmail };

      const accessToken = jwt.sign(
        payloadUser,
        process.env.ACCESS_TOKEN_SECRET
      );
      console.log(" generated token ", accessToken);

      res.send({
        token: accessToken,
      });
    }
  } catch (error) {
    console.log(" catch error ", error);
    return res.status(404).send(error.error);
  }
});

///////////
app.post("/signup", async (req, res) => {
  // authenticate user
  console.log("request.body for signup ", req.body);

  const userName = req.body.userName;
  const userEmail = req.body.userEmail;
  const userPassword = req.body.password;

  try {
    let user = await signUpDetails(userName, userEmail, userPassword);
    if (user.insertedId) {
      const payloadUser = { userEmail };

      const accessToken = jwt.sign(
        payloadUser,
        process.env.ACCESS_TOKEN_SECRET
      );
      console.log(" generated token ", accessToken);

      res.send({
        token: accessToken,
      });
    }
  } catch (error) {
    console.log(" catch error ", error);
    return res.status(404).send(error.error);
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  //the above contains a bearer and token seperated by a single "space"
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(" verify log ", user);
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

app.get("/getUserDetails", authenticateToken, async (req, res) => {
  // get user details implementation
  console.log("Received user details ", req.user);

  let userDetails = undefined;

  if (req.user) {
    try {
      userDetails = await getUserDetailsByEmail(req.user.userEmail);
      if (userDetails) {
        res.send({
          user: userDetails,
        });
      }
    } catch (error) {
      console.log(
        "error received while retrieving the user details by email",
        error
      );
      res.send({ error });
    }
  }
});

const getUserDetails = (userEmail, userPassword) => {
  return new Promise((resolve, reject) => {
    const query = `select  UserEmail  from users where UserEmail = '${userEmail}' and UserPassword ='${userPassword}'`;
    console.log("query ", query);
    db.get(query, (err, row) => {
      //

      console.log("errr ", err);
      console.log(" row ", row);

      if (err) {
        reject({ error: "Error retrieving user details " });
      } else {
        if (row) resolve({ row });
        else reject({ error: "Username / Password wrong" });
      }
    });
  });
};

const signUpDetails = (userName, userEmail, userPassword) => {
  return new Promise((resolve, reject) => {
    const query = `insert into users (UserName , UserEmail, UserPassword) values( '${userName}', '${userEmail}', '${userPassword}')`;
    console.log("query ", query);
    db.run(query, function (error) {
      if (error) {
        reject({ error: "Error retrieving user details " });
      } else {
        console.log("inserted record ", this.lastID);
        resolve({ insertedId: this.lastID });
      }
    });
  });
};

const getUserDetailsByEmail = (userEmail) => {
  return new Promise((resolve, reject) => {
    const query = `select  UserName ,  UserEmail  from users where UserEmail = '${userEmail}'`;
    console.log("query ", query);
    db.get(query, (err, row) => {
      if (err) {
        console.log("errorr form function ", err);
        reject({ error: "Error retrieving user details " });
      } else {
        if (row) {
          console.log("row from method ", row);
          resolve({ row });
        } else reject({ error: "Coudn't find details with this email" });
      }
    });
  });
};

module.exports = app;
