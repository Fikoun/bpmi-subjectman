"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class StudyProgrammeMongo extends UuObjectDao {
  constructor(...args) {
    super(...args);
  }

  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, name: 1 }, { unique: true });
  }

  // create DAO method

  // get DAO method

  // getByName DAO method

  // update DAO method

  // delete DAO method

  async list(awid, order, pageInfo) {
    const filter = { awid };
    const sort = { name: order === "asc" ? 1 : -1 };

    return await super.find(filter, pageInfo, sort);
  }
}

module.exports = StudyProgrammeMongo;
