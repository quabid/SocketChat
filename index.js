require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const stringify = require("fast-safe-stringify");
const chalk = require("chalk");
const app = express();
const path = require("path");
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("02468ouqtyminv", 13);
const mongoCollection = `users`;
const {
  hashPassword,
  comparePassword,
} = require("./custom_modules/PasswordHasher");
const { log } = require("./custom_modules/Logger");
const { DB_URI } = require("./config");
const {
  stringUtils: { stripemail, truncate },
  stringUtils,
} = require("./custom_modules/utils");

// body-parser
app.use(bodyParser.json());

// Models
const Users = require("./models/Users");
const Clients = require("./models/Clients");

// Connect to datastore
mongoose
  .connect(DB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    log(`${chalk.keyword("orange")("\tDB Connected")}`);
  })
  .catch((err) => log(err));

// Constants
const PORT = 3000;
const ADDRESS = process.env.ADDRESS || "0.0.0.0";
const MESSAGE = chalk.keyword("orange")(`Server started on port ${PORT}\n`);
const serverStartMessage = () => log(`\n\t${MESSAGE}`);

let clients = [];

// Configure Routers
const home = require("./routes/landing");
const admin = require("./routes/admin");
const { hash } = require("bcryptjs");
const { update } = require("./models/Users");

// Static assets
app.use(express.static(path.join(__dirname, "public")));

// Set Routes
app.use("/", home);
app.use("/admin", admin);

// Start Server
server.listen(process.env.port || 3000, serverStartMessage);

// Config Socket.io
io.sockets.on("connection", (socket) => {
  // Upon connection
  socket.emit("signin");

  // User Signin Data
  socket.on("signmein", (data) => {
    const { email, password } = data;
    log(`User Signin Data: Email: ${email}, Password: ${password}`);

    Users.findOne({ email: `${email}` }).exec((err, doc) => {
      if (err) {
        log(`\n\n\t\tAn Error Occurred: ${err.message}\n\n`);
        return socket.emit("signinerror", { errorMessage: `${err.message}` });
      }
      if (doc) {
        // log(doc);
        log(`Found user proceeding to signin`);
        signinClient(doc, password, socket);
      } else {
        socket.emit("register", { sid: socket.id });
      }
    });
  });

  // User Registration Data
  socket.on("registerme", (data) => {
    const { email, fname, lname, pwd1, pwd2 } = data;

    log(
      `Registration Data: Email: ${email}, First Name: ${fname}, Last Name: ${lname}, PWD1: ${pwd1}, PWD2: ${pwd2}`
    );

    if (
      email.length > 0 &&
      fname.length > 0 &&
      lname.length > 0 &&
      pwd1.length > 0 &&
      pwd2.length > 0
    ) {
      // Registration Passwords Error
      if (pwd1 !== pwd2) {
        log(`Passwords don't match: ${pwd1} !== ${pwd2}`);
        return socket.emit("registration-error", {
          errorMessage: `Passwords don't match`,
        });
      } else if (pwd1.length < 6) {
        log(`Password does not meet minimum requirement`);
        return socket.emit("registration-error", {
          errorMessage: `Password must be at least 6 characters`,
        });
      }

      const username = `${stripemail(email)}${nanoid()}`;
      const newUser = {
        email: `${email}`,
        userName: username,
        isAdmin: false,
      };

      new Users(newUser).save((err, user) => {
        if (err) {
          log(err.message);
          return socket.emit("registration-error", {
            errorMessage: `${err.message}`,
          });
        }

        createClient(user, fname, lname, pwd1, socket);
      });
    } else {
      return socket.emit("registration-error", {
        errorMessage: `All fields are required`,
      });
    }
  });

  socket.on("updateclientlist", () => {
    updateClientList();
  });

  // User Disconnected
  socket.on("disconnect", (reason) => {
    removeClient(socket.id);
    updateClientList();
  });

  // Generel Message
  socket.on("message", (data) => {
    let { from, message } = data,
      _from = findClientById(from);

    if (null !== _from) {
      log(`Client ${_from.fname} ${_from.lname} sent ${message}`);
    }

    clients.forEach((client) => {
      client.channel.emit("message", {
        from: `${_from.fname} ${_from.lname}`,
        message: message,
      });
    });

    _from = null;
    data = null;
  });

  // Private Message
  socket.on("discreetmessage", (data) => {
    let {
      toClientUid,
      toClientSid,
      toClientEmail,
      fromClientSid,
      fromClientMessage,
    } = data;

    log(
      `From SID: ${fromClientSid}, From Message: ${fromClientMessage}, To SID: ${toClientSid}`
    );

    let from = findClientById(fromClientSid),
      to = findClientById(toClientSid);

    if (null !== from && null !== to) {
      let message = {
        from: `${from.fname} ${from.lname}`,
        message: fromClientMessage,
      };
      to.channel.emit("privatemessage", message);
      from = null;
      to = null;
      message = null;
      data = null;
    }

    return;
  });
});

function signinClient(user, password, socket) {
  log(user._id);
  Clients.findOne({ user: user._id }, (err, doc) => {
    if (err) {
      log(`\n\n\t\tAn Error Occurred: ${err.message}\n\n`);
      return socket.emit("signinerror", { errorMessage: `${err.message}` });
    }

    if (doc) {
      log(`Found client ... commencing signin procedure`);
      comparePassword(password, doc.password)
        .then((res) => {
          log(`Signin Status: ${res.status}`);
          switch (res.status.trim()) {
            case "success":
              return signedIn(socket, doc, user);
          }
        })
        .catch((err) => {
          log(err.status);
          log(`\n\n\t\tSignin Failed: ${err.message}\n\n`);
          return socket.emit("signinerror", {
            errorMessage: `Authentication Failed`,
          });
        });
    }
  });
}

function signedIn(socket, doc, user) {
  const fname = doc.firstName,
    lname = doc.lastName,
    email = user.email;
  const client = {
    sid: socket.id,
    channel: socket,
    fname,
    lname,
    email,
  };

  _client = findClientByEmail(user.email);

  if (null !== _client) {
    return socket.emit("alreadysignedin", {
      message: `User ${user.email} is already signed in`,
    });
  }

  addClient(client);

  return socket.emit("signinsuccess", {
    uid: user._id,
    sid: socket.id,
    username: user.userName,
    fname: doc.firstName,
    lname: doc.lastName,
  });
}

function addClient(client) {
  clients = [...clients, { ...client }];
  // log(clients);
}

function createClient(user, fname, lname, pwd1, socket) {
  hashPassword(pwd1, (res) => {
    const newClient = {
      user: user._id,
      firstName: fname,
      lastName: lname,
      password: res.payload,
    };

    new Clients(newClient).save((err, client) => {
      if (err) {
        log(err.message);
        return socket.emit("registration-error", {
          errorMessage: `${err.message}`,
        });
      }

      return socket.emit("registrationsuccess");
    });
  });
}

function updateClientList() {
  let strClients = stringify(clients);
  clients.forEach((client) => {
    client.channel.emit("updatedclientlist", {
      clientList: strClients,
    });
  });
  strClients = null;
}

function purgeClientList() {
  clients.forEach((client) => {
    client.channel.disconnect(true);
  });
  clients = [];
}

function findClientById(id) {
  return clients.find((x) => x.sid == id) || null;
}

function findClientByEmail(email) {
  return clients.find((x) => x.email == email) || null;
}

function removeClient(id) {
  let client = findClientById(id);
  if (null !== client) {
    client.channel.disconnect(true);
  }
  client = null;
  clients = clients.filter((x) => x.sid != id);
}
