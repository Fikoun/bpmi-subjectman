"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { Profile, UuSubAppInstance, UuAppWorkspace, WorkspaceAuthorizationService } = require("uu_appg01_server").Workspace;
const { UriBuilder } = require("uu_appg01_server").Uri;
const Errors = require("../api/errors/subjectman-main-error.js");
const { Schemas, SubjectMan, Profiles } = require("./constants");

const WARNINGS = {
  initUnsupportedKeys: {
    code: `${Errors.Init.UC_CODE}unsupportedKeys`,
  },
};

const DEFAULT_NAME = "subjectMan";

class SubjectmanMainAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.SUBJECT_MAN);
    this.studyProgrammeDao = DaoFactory.getDao(Schemas.STUDY_PROGRAMME);
  }

  async init(uri, dtoIn) {
    const awid = uri.getAwid();

    // HDS 1
    let validationResult = this.validator.validate("initDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.initUnsupportedKeys.code,
      Errors.Init.InvalidDtoIn
    );

    // 1.4
    dtoIn.state = dtoIn.state || SubjectMan.States.UNDER_CONSTRUCTION;
    dtoIn.name = dtoIn.name || DEFAULT_NAME;

    // HDS 2
    const promises = Object.values(Schemas).map(async (schema) => DaoFactory.getDao(schema).createSchema());
    try {
      await Promise.all(promises);
    } catch (e) {
      throw new Errors.Init.SchemaDaoCreateSchemaFailed({ uuAppErrorMap }, e);
    }

    // HDS 3
    try {
      await Profile.set(awid, Profiles.AUTHORITIES, dtoIn.uuAppProfileAuthorities);
    } catch (e) {
      throw new Errors.Init.SetProfileFailed(
        { uuAppErrorMap },
        { uuAppProfileAuthorities: dtoIn.uuAppProfileAuthorities },
        e
      );
    }

    // HDS 4
    const uuObject = {
      awid,
      state: dtoIn.uuBtLocationUri ? SubjectMan.States.INIT : dtoIn.state,
      name: dtoIn.name,
    };

    let subjectMan;
    try {
      subjectMan = await this.dao.create(uuObject);
    } catch (e) {
      throw new Errors.Init.SubjectManDaoCreateFailed({ uuAppErrorMap }, e);
    }

    // HDS 5
    return { subjectMan, uuAppErrorMap };
  }

  async load(uri, session, uuAppErrorMap = {}) {
    let awid = uri.getAwid();
    let dtoOut = {};

    // hds 1
    const asidData = await UuSubAppInstance.get();

    // hds 2
    const awidData = await UuAppWorkspace.get(awid);

    // hds 4
    const cmdUri = UriBuilder.parse(uri).setUseCase("sys/uuAppWorkspace/load").clearParameters();
    const authorizationResult = await WorkspaceAuthorizationService.authorize(session, cmdUri.toUri());

    const profileData = {
      uuIdentityProfileList: authorizationResult.getIdentityProfiles(),
      profileList: authorizationResult.getAuthorizedProfiles(),
    };

    // hds 5
    dtoOut.sysData = { asidData, awidData, profileData };

    // hds 6, 6.A
    if (awidData.sysState !== "created") {
      // hds 6.A.1
      let subjectMan;
      try {
        subjectMan = await this.dao.getByAwid(awid);
      } catch (e) {
        throw new Errors.Load.SubjectManDoesNotExist({ uuAppErrorMap }, { awid }, e);
      }

      // hds 6.A.2
      dtoOut.data = { ...subjectMan, relatedObjectsMap: {} };

      const studyProgrammesList = await this.studyProgrammeDao.list(awid);
      dtoOut.data.categoryList = studyProgrammesList.itemList;
    }

    // hds 7
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async loadBasicData(uri, session, uuAppErrorMap = {}) {
    // HDS 1
    const dtoOut = await UuAppWorkspace.loadBasicData(uri, session, uuAppErrorMap);

    // TODO Implement according to application needs...
    // const awid = uri.getAwid();
    // const workspace = await UuAppWorkspace.get(awid);
    // if (workspace.sysState !== UuAppWorkspace.SYS_STATES.CREATED &&
    //    workspace.sysState !== UuAppWorkspace.SYS_STATES.ASSIGNED
    // ) {
    //   const appData = await this.dao.get(awid);
    //   dtoOut.data = { ...appData, relatedObjectsMap: {} };
    // }

    // HDS 2
    return dtoOut;
  }
}

module.exports = new SubjectmanMainAbl();
