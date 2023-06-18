import { type CommandProps } from "../types";
import { Logger } from "../classes";
import { askQuestion } from "../utils";
import { eColors, eQuestions } from "../constants";
import { FileService } from "../services";
const log = new Logger();
const fileService = new FileService();

const projectCommand: CommandProps = {
  name: "db",
  description: "to connect to the pg database",
  options: [],
  async action(config) {
    async function askProjectName() {
      let { prodOrStage }: { prodOrStage: "staging" | "production" } =
        await askQuestion(eQuestions.ASK_AWS_PROD_OR_STAGING);
      if (!prodOrStage) prodOrStage = "staging";
      return prodOrStage;
    }

    log.title(this.name.toUpperCase());

    const prodOrStage = await askProjectName();

    if (!config.database[prodOrStage]) {
      log.print("\n");
      log.error(
        `No database configuration found for ${prodOrStage} in pimster.config.json`
      );
      return;
    }

    const { host, username, name, password } = config.database[prodOrStage];

    const command = `set PGPASSWORD=${password} && psql -h ${host} -U ${username} -d ${name}`;

    log
      .start("")
      .info(
        log.chalk
          .bgHex(eColors.blue)
          .white(`Connecting to ${prodOrStage} database`)
      );
    log.print("\n");

    try {
      fileService.execCommandAndWait(command);
    } catch (error) {
      log.error(error);
    }
  },
};

export default projectCommand;
