import path from "path";
import fs from "fs";
import { Logger } from "../../classes";
import {
  spawn,
  execSync,
  spawnSync,
  type ExecSyncOptionsWithBufferEncoding,
  type SpawnOptionsWithoutStdio,
  type SpawnSyncOptions,
} from "child_process";

const log = new Logger();

class FileService {
  joinPaths(...paths: string[]): string {
    return path.join(...paths);
  }

  getFilesInDirectory(
    directoryPath: string,
    condition?: (fileName: string) => boolean
  ): string[] {
    const files = fs.readdirSync(path.join(__dirname, directoryPath));
    if (!condition) return files;
    return files.filter(condition);
  }

  isFileExisting(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  async createDirectory(...paths: string[]) {
    const directoryPath = path.join(...paths);
    log.info(directoryPath);
    await fs.promises.mkdir(directoryPath, { recursive: true });
  }

  createFile(filePath: string, content: string): void {
    fs.writeFileSync(filePath, String(content));
  }

  async executeCommand(command: string, withLog = true) {
    const { exec } = await import("child_process");

    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          log.error("ERROR:\n\n");
          log.error(error);
          reject(error);
        }
        if (stderr) {
          log.error("STDERR:\n\n");
          log.print(`stderr: ${stderr}`);
          reject(stderr);
        }
        void withLog;

        console.log(stdout);
        resolve(stdout);
      });
    });
  }

  execCommandAndWait(
    command: string,
    opts?: ExecSyncOptionsWithBufferEncoding
  ): void {
    execSync(command, opts || { stdio: "inherit" });
  }

  async spawnAsync(
    command: string,
    args: string[],
    options?: any,
    shouldLog = true
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const childProcess = spawn(
        command,
        args,
        options as SpawnOptionsWithoutStdio
      );

      childProcess?.on("error", (error) => {
        log.error(`Failed to start command: ${command} ${args.join(" ")}`);
        reject(
          new Error(`Failed to start command: ${command}. ${error.message}`)
        );
      });

      childProcess?.on("exit", (code) => {
        if (code === 0) {
          resolve();
        } else {
          log.error(`Command failed: ${command} ${args.join(" ")}`);
          reject(new Error(`Command ${command} exited with code ${-1}`));
        }
      });

      if (shouldLog) {
        childProcess.stdout?.on("data", (chunk: string) => {
          process.stdout.write(chunk);
        });
      }
    });
  }

  spawnSync(command: string, args: string[], options?: SpawnSyncOptions): void {
    const { error, status } = spawnSync(command, args, options);

    if (error) {
      throw new Error(`Failed to start command: ${command}. ${error.message}`);
    } else if (status !== 0) {
      throw new Error(`Command ${command} exited with code ${-1}`);
    }
  }

  executeShellScript(shellScriptPath: string) {
    try {
      // Execute the shell script using the "source" command to run it in the current shell session
      const result = execSync(`${shellScriptPath}`).toString();
      console.log(result);
    } catch (error) {
      console.error(`An error occurred: ${error}`);
    }
  }
}

export default FileService;
