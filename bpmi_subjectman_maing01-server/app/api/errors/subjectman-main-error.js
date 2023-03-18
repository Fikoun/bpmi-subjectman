"use strict";
const SubjectmanMainUseCaseError = require("./subjectman-main-use-case-error.js");

const Init = {
  UC_CODE: `${SubjectmanMainUseCaseError.ERROR_PREFIX}init/`,

  InvalidDtoIn: class extends SubjectmanMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  SchemaDaoCreateSchemaFailed: class extends SubjectmanMainUseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${Init.UC_CODE}schemaDaoCreateSchemaFailed`;
      this.message = "Create schema by Dao createSchema failed.";
    }
  },

  SetProfileFailed: class extends SubjectmanMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}sys/setProfileFailed`;
      this.message = "Set profile failed.";
    }
  },

  SubjectManDaoCreateFailed: class extends SubjectmanMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}subjectManDaoCreateFailed`;
      this.message = "Create SubjectMan by DAO method failed.";
    }
  },
};

const Load = {
  UC_CODE: `${SubjectmanMainUseCaseError.ERROR_PREFIX}load/`,

  SubjectManDoesNotExist: class extends SubjectmanMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Load.UC_CODE}subjectManDoesNotExist`;
      this.message = "UuObject SubjectMan does not exist.";
    }
  },
};

module.exports = {
  Init,
  Load,
};
