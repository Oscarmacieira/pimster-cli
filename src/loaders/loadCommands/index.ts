import { type Command } from "commander";
import { PimsterConfig, CommandProps } from "../../types";
// import { join } from "path";
import { FileService } from "../../services";
import { Logger } from "../../classes";
import { ARGS } from "../../constants";
import { join } from "path";

const fileService = new FileService();
const logger = new Logger();

export default async function loadCommands(
  program: Command,
  config: PimsterConfig
) {
  const commandsDir = join("../../commands");
  const commandFiles = fileService
    .getFilesInDirectory(commandsDir)
    .filter((file) => file.endsWith(".js"));

  const commandPromises = commandFiles.map(async (file) => {
    const commandPath = join(commandsDir, file);
    const commandModule = (await import(commandPath)).default as CommandProps;

    const command = program
      .createCommand(commandModule.name)
      .description(commandModule.description);

    if (commandModule.args) {
      command.arguments(commandModule.args);
    }

    if (commandModule.options) {
      commandModule.options.forEach((option: any) => {
        command.option(option.flags, option.description);
      });
    }

    command.action(async (opts: any) => {
      await commandModule.action((config as PimsterConfig) || {}, opts);
      console.log("\n");
    });

    program.addCommand(command);
  });

  await Promise.all(commandPromises);

  const projectsCommandsPromises = config.projects.map(async (project) => {
    const projectCommand = program
      .createCommand(project.name)
      .description(`Commands related to the ${project.name} project`);

    projectCommand.option("-y, --yarn", "Run a yarn script in the project");
    projectCommand.option("-c, --code", "Open the project in VSCode");
    projectCommand.option("-e, --exec", "Execute a command in the project");

    projectCommand.action(async (...args) => {
      logger.title(project.name.toUpperCase());

      const { exec, yarn, code } = args[0];

      if (ARGS.length === 3) {
        projectCommand.help();
      }

      if (exec) {
        const script = ARGS.length === 5 ? ARGS[ARGS.length - 1] : "";

        fileService
          .spawnAsync(script, [], { cwd: project.path, stdio: "inherit" }, true)
          .then(() => {})
          .catch((error) => {
            logger.error(error);
          });

        return;
      }

      if (yarn) {
        const script = ARGS.length === 5 ? ARGS[ARGS.length - 1] : "";

        fileService
          .spawnAsync(
            "yarn",
            [script],
            { cwd: project.path, stdio: "inherit" },
            true
          )
          .then(() => {})
          .catch((error) => {
            logger.error(error);
          });

        return;
      }

      if (code) {
        const spinner = logger.start("Opening project in VSCode");
        try {
          fileService.spawnSync("code", [project.path]);
          //  await fileService.executeCommand(`code ${project.path}`);
          spinner.succeed();
        } catch (error) {
          spinner.fail();
          logger.error(error);
        }

        return;
      }
    });

    program.addCommand(projectCommand);
  });

  await Promise.all(projectsCommandsPromises);

  program.parse(ARGS);
}
