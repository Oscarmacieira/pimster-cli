// import { Logger } from "../../classes";
import { CONFIG_FILE_NAME, CURRENT_DIRECTORY } from "../../constants";
import { PimsterConfig } from "../../types";
// import FileService from "../FileService";
import findConfig from "find-config";

// const fileService = new FileService();
// const log = new Logger();

class ConfigService {
  private _config: PimsterConfig;

  constructor() {
    this._config = this.readPimsterConfig();
  }

  get config(): PimsterConfig {
    return this._config;
  }

  public readPimsterConfig() {
    return findConfig.require(CONFIG_FILE_NAME, {
      cwd: CURRENT_DIRECTORY,
      home: true,
    }) as PimsterConfig;
  }
}

export default ConfigService;
