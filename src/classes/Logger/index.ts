import chalk from "chalk";
import ora from "ora";
import { eColors } from "../../constants";

class Logger {
  chalk = chalk;
  ora = ora;

  public print(message: any) {
    console.log(message);
  }

  public blue(message: string) {
    console.log(chalk.hex(eColors.blue)(message));
  }

  public asciiArt() {
    this.blue(
      `\n
 ██████╗ ██╗███╗   ███╗███████╗████████╗███████╗██████╗ 
 ██╔══██╗██║████╗ ████║██╔════╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝██║██╔████╔██║███████╗   ██║   █████╗  ██████╔╝
 ██╔═══╝ ██║██║╚██╔╝██║╚════██║   ██║   ██╔══╝  ██╔══██╗
 ██║     ██║██║ ╚═╝ ██║███████║   ██║   ███████╗██║  ██║
 ╚═╝     ╚═╝╚═╝     ╚═╝╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
 \n`
    );
  }

  public title(message: string) {
    console.log(
      chalk.white.bgHex(eColors.blue).bold(`      ${message}      ` + "\n")
    );
  }

  public error(message: any) {
    console.log(chalk.red.bold(message));
  }

  public info(message: any) {
    console.log(chalk.blue.bold(message));
  }

  public success(message: any) {
    console.log(chalk.green.bold(message));
  }

  public warning(message: any) {
    console.log(chalk.yellow.bold(message));
  }

  start(text: string) {
    const spinner = ora({
      text,
      color: "blue",
      spinner: "dots",
    }).start();
    return spinner;
  }
}

export default Logger;
