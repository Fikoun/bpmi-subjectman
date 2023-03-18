"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class JokesMainMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async getByAwid(awid) {
    return await super.findOne({ awid });
  }
}

module.exports = JokesMainMongo;
