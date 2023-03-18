"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/study-programme-error.js");

const WARNINGS = {

};

class StudyProgrammeAbl {

  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("studyProgramme");
  }

  async list(awid, dtoIn) {
    
  }

}

module.exports = new StudyProgrammeAbl();
