"use strict";

const SubjectmanMainUseCaseError = require("./subjectman-main-use-case-error.js");
const STUDY_PROGRAMME_ERROR_PREFIX = `${SubjectmanMainUseCaseError.ERROR_PREFIX}studyProgramme/`;

const List = {
  UC_CODE: `${STUDY_PROGRAMME_ERROR_PREFIX}list/`,
  
};

module.exports = {
  List
};
