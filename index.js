require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const chalk = require("chalk");
const app = express();
const path = require("path");
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const mongoose = require("mongoose");
const { log } = require("./custom_modules/Logger");
const { DB_URI, DB_NAME, DB_USER, DB_USER_PWD } = require("./config");

// body-parser
app.use(bodyParser.json());
const Users = require("./models/Users");

// Connect to datastore
mongoose
  .connect(DB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: DB_USER,
    pass: DB_USER_PWD,
    dbName: DB_NAME,
  })
  .then(() => {
    log(`DB connected`);
  })
  .catch((err) => log(err));

// Constants
const PORT = 3000;
const ADDRESS = process.env.ADDRESS || "0.0.0.0";
const MESSAGE = chalk.keyword("orange")(`Server started on port ${PORT}\n`);
const serverStartMessage = () => log(`\n\t${MESSAGE}\n`);
let clients = [],
  admins = [{ email: "quobod@gmail.com", pwd: "dEeppurple%#" }];

// Configure Routers
const home = require("./routes/landing");
const admin = require("./routes/admin");

// Static assets
app.use(express.static(path.join(__dirname, "public")));

// Set Routes
app.use("/", home);
app.use("/admin", admin);

// Start Server
server.listen(process.env.port || 3000, serverStartMessage);

// Config Socket.io
io.sockets.on("connection", (socket) => {
  initConnection(socket);

  socket.on("registerme", (data) => {
    const { email, uid, isAdmin } = data;
    log(
      `Registration Request Email: ${email} for ${uid} --> isAdmin: ${isAdmin}`
    );
    if (email.length > 0 && uid.length > 0) {
      const client = findClientById(uid);
      if (null !== client) {
        client["email"] = email;
        client["admin"] = isAdmin;
        client.channel.emit("registrationcomplete");
        updateClientList();
      }
    }
  });

  socket.on("disconnect", (reason) => {
    let client = findClientById(socket.id);
    if (null !== client && client.email) {
      log(`Client: ${client.email}, UID: ${client.uid} disconnected`);
      removeClient(client.uid);
      client = null;
      updateClientList();
    }
  });

  socket.on("broadcast", (data) => {
    const { title, alert } = data;
    socket.broadcast.emit("broadcast", { alert: alert, title: title });
  });

  socket.on("messagediscreet", (data) => {
    let { fromUid, toUid, toEmail, fromMessage } = data;
    let from = findClientById(fromUid);
    let to = findClientByEmail(toEmail);

    log(
      `From ${from.email} with ID: ${from.uid} to ${to.email} with ID ${to.uid} Sending Message: ${fromMessage}`
    );

    let message = {
      from: from.email,
      message: fromMessage,
    };

    if (from && to && message) {
      to.channel.emit("privatemessage", message);
      from = null;
      to = null;
      data = null;
      message = null;
    }
  });

  socket.on("message", (data) => {
    let { from, message } = data;
    let client = findClientById(from);

    if (null != client && message.length > 0) {
      log(`From ${client.email} with message ${message}`);
      clients.forEach((c) => {
        c.channel.emit("messagebroadcast", {
          from: client.email,
          message: message,
        });
      });
      client = null;
      data = null;
    }
  });

  socket.on("getmyid", () => {
    socket.emit("hereisyourid", { uid: socket.id });
  });

  socket.on("adminlogin", (data) => {
    const { uid, email, password, isAdmin } = data;
    log(`Admin login data: ${uid} ${email} ${password} ${isAdmin}`);
  });
});

function updateClientList() {
  clients.map((client) => {
    const channel = client.channel;
    const channels = [];
    clients.forEach((client) => {
      channels.push({ email: client.email, uid: client.uid });
    });
    const strChannels = JSON.stringify(channels);
    channel.emit("updatedclientlist", { list: strChannels });
  });
}

function initConnection(socket) {
  if (null === findClientById(socket.id)) {
    addClient(socket);
    socket.emit("registrationrequest", { uid: socket.id });
  }
}

function findClientById(id) {
  const index = clients.findIndex((x) => x.uid == id);
  if (-1 !== index) {
    return clients[index];
  }
  return null;
}

function findClientByEmail(email) {
  const index = clients.findIndex((x) => x.email == email);
  if (-1 !== index) {
    return clients[index];
  }
  return null;
}

function addClient(socket) {
  const newClient = { uid: socket.id, channel: socket };
  clients = [...clients, newClient];
}

function removeClient(id) {
  findClientById(id).channel.disconnect();
  clients = clients.filter((x) => x.uid != id);
}
