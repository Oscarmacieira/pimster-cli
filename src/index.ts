#!/usr/bin/env node

import { Logger } from "./classes";
import { loadCommands, loadProgram } from "./loaders";
import { ConfigService } from "./services";

(async () => {
  const log = new Logger();
  const configService = new ConfigService();

  log.asciiArt();
  const program = loadProgram();
  await loadCommands(program, configService.config);
})();
