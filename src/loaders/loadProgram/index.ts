import { Command } from "commander";
import { Logger } from "../../classes";
import { eColors } from "../../constants";

const log = new Logger();

export default function loadProgram(): Command {
  const program = new Command();
  program.version(log.chalk.bgHex(eColors.blue).white("0.0.1"));
  program.name(log.chalk.hex(eColors.blue)("pimster"));
  program.usage(log.chalk.bold.italic("<command> [options]"));
  program.description(log.chalk.hex(eColors.blue)("Version 0.0.1"));
  program.helpOption("--help", "Display help for command");
  return program;
}
