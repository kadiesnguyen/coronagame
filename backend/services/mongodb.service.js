"use strict";
const mongoose = require("mongoose");
const { mongodbConnectionString } = require("../configs/database");
class MongoDBService {
  constructor() {
    this.instance = null;
  }
  static async connect() {
    try {
      await mongoose.connect(mongodbConnectionString, {});
      console.log("MongoDB connected successful");
      return mongoose;
    } catch (err) {
      console.log(`MongoDB error connected`);
      process.exit(1);
    }
  }
  static async getInstance() {
    if (!this.instance) {
      this.instance = await MongoDBService.connect();
    }
    return this.instance;
  }
}

module.exports = MongoDBService.getInstance();
