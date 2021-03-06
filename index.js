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
const { cap } = require("./custom_modules/cfc");
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

// Static assets
app.use(express.static(path.join(__dirname, "public")));

// Set Routes
app.use("/", home);
app.use("/admin", admin);

// Start Server
server.listen(process.env.port || 3000, ADDRESS, serverStartMessage);

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
      if (!_from.isAdmin) {
        log(`Client ${_from.fname} ${_from.lname} sent ${message}`);
      } else {
        log(`Admin ${_from.fname} ${_from.lname} sent ${message}`);
      }
      clients.forEach((client) => {
        client.channel.emit("message", {
          from: `${_from.fname} ${_from.lname}`,
          message: message,
          admin: _from.isAdmin,
        });
      });
    }

    _from = null;
    data = null;
  });

  // Private Message
  socket.on("discreetmessage", (data) => {
    let { toClientSid, fromClientSid, fromClientMessage } = data;

    log(
      `From SID: ${fromClientSid}, From Message: ${fromClientMessage}, To SID: ${toClientSid}`
    );

    let from = findClientById(fromClientSid),
      to = findClientById(toClientSid);

    if (null !== from && null !== to) {
      let message = {
        from: `${from.fname} ${from.lname}`,
        message: fromClientMessage,
        isAdmin: from.isAdmin,
      };
      to.channel.emit("privatemessage", message);

      clients.forEach((client) => {
        if (client.isAdmin) {
          client.channel.emit("capturemessage", {
            from: `${from.fname} ${from.lname}`,
            message: fromClientMessage,
            to: `${to.fname} ${to.lname}`,
          });
        }
      });

      from = null;
      to = null;
      message = null;
      data = null;
    }

    return;
  });

  // Admin
  socket.on("adminlogin", (data) => {
    let { email, password } = data;

    // log(`Admin Login Data --> Email: ${email}, Password: ${password}\n`);

    Users.findOne({ email: `${email}` })
      .then((res) => {
        if (res) {
          const { isAdmin, _id } = res;

          if (!isAdmin) {
            return socket.emit("adminloginfail", {
              status: `Authentication Failure`,
              cause: `Must be an administrator`,
            });
          } else {
            // Check admin credentials
            checkAdminCredentials(_id, email, password, socket);
          }
        } else {
          return socket.emit("adminloginfail", {
            status: `Authentication Failure`,
            cause: `Must be an administrator`,
          });
        }
      })
      .catch((err) => {
        log(err);
        socket.emit("adminloginfail", {
          status: `Authentication Failure`,
          cause: `Must be an administrator`,
        });
      });

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
    fname: doc.firstName,
    lname: doc.lastName,
    email: email,
    isAdmin: false,
  };

  _client = findClientByEmail(user.email);

  if (null !== _client) {
    return socket.emit("alreadysignedin", {
      message: `User is already signed in`,
    });
  }

  addClient(client);

  let hour = new Date().getHours(),
    greeting;

  if (hour >= 0 && hour < 12) {
    greeting = `Good Morning ${cap(doc.firstName)}`;
  } else if (hour >= 12 && hour < 17) {
    greeting = `Good Afternoon ${cap(doc.firstName)}`;
  } else {
    greeting = `Good Evening ${cap(doc.firstName)}`;
  }

  return socket.emit("signinsuccess", {
    uid: user._id,
    sid: socket.id,
    username: user.userName,
    fname: doc.firstName,
    lname: doc.lastName,
    greeting: greeting,
  });
}

function addClient(client) {
  clients = [...clients, { ...client }];
  // log(clients);
}

function addAdmin(admin) {
  admins = [...admins, { ...admin }];
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

function checkAdminCredentials(id, email, pwd, socket) {
  Clients.findOne({ user: `${id}` })
    .populate("user")
    .then((res) => {
      if (res) {
        // log(res.user.email);
        const { firstName, lastName, password } = res;

        comparePassword(pwd, password)
          .then((_res) => {
            // log(res);
            switch (_res.status) {
              case "success":
                return adminLoginSuccess(
                  res,
                  socket,
                  id,
                  firstName,
                  lastName,
                  res.user.isAdmin,
                  res.user.email
                );
            }
          })
          .catch((err) => {
            log(err);
            return adminLoginFailed(socket);
          });
      } else {
        return log(`Client not found`);
      }
    })
    .catch((err) => {
      return log(err.message);
    });
}

function adminLoginSuccess(
  res,
  socket,
  id,
  firstName,
  lastName,
  isAdmin,
  email
) {
  const admin = findClientByEmail(email);

  if (null !== admin && admin.isAdmin) {
    return socket.emit("adminalreadysignedin", {
      message: `Administrator ${cap(stripemail(email))} is already signed in`,
    });
  } else {
    let greeting = createGreeting(res),
      client;

    client = {
      sid: socket.id,
      channel: socket,
      uid: id,
      fname: firstName,
      lname: lastName,
      isAdmin: isAdmin,
      email: email,
    };

    addClient(client);

    return socket.emit("adminloginsuccsess", {
      greeting: greeting,
      sid: socket.id,
      uid: id,
      fname: firstName,
      lname: lastName,
      admin: isAdmin,
    });
  }
}

function adminLoginFailed(socket) {
  return socket.emit("adminloginfail", {
    status: `Authentication Failure`,
    cause: `Invalid Credentials`,
  });
}

function createGreeting(res) {
  let hour = new Date().getHours(),
    greeting;

  if (hour >= 0 && hour < 12) {
    greeting = `Good Morning ${cap(res.firstName)}`;
  } else if (hour >= 12 && hour < 17) {
    greeting = `Good Afternoon ${cap(res.firstName)}`;
  } else {
    greeting = `Good Evening ${cap(res.firstName)}`;
  }
  return greeting;
}
