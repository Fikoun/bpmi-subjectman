"use strict";
const StudyProgrammeAbl = require("../../abl/study-programme-abl.js");

class StudyProgrammeController {

  list(ucEnv) {
    return StudyProgrammeAbl.list(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

}

module.exports = new StudyProgrammeController();
