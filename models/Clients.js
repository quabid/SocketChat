const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ClientSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  profileUrl: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  password: {
    type: String,
  },
});

// ClientSchema.index({ email: 1, userName: 1 }, { unique: true });

ClientSchema.methods.withoutPassword = function () {
  const client = this.toObject();
  delete client.password;
  return client;
};

// Create collection and add schema
const Clients = mongoose.model("Client", ClientSchema, "Client");
module.exports = Clients;
