import { Question } from "../types";

export enum eColors {
  blue = "#1B47FF",
  green = "#94FBAB",
}

export const HOME_DIRECTORY = String(process.env.HOME);
export const CURRENT_DIRECTORY = String(process.env.PWD);
export const CONFIG_FILE_NAME = "pimster.config.json";
export const CONFIG_FILE_PATH = HOME_DIRECTORY + CONFIG_FILE_NAME;
export const ARGS = process.argv;
export const COMMAND = ARGS[2];

export enum eQuestions {
  ASK_AWS_PROD_OR_STAGING = "ASK_AWS_PROD_OR_STAGING",
}

export const QUESTIONS: Record<eQuestions, Question> = {
  [eQuestions.ASK_AWS_PROD_OR_STAGING]: {
    type: "list",
    name: "prodOrStage",
    message: "Do you want to connect to staging or production?",
    choices: [
      {
        name: "Staging",
        value: "staging",
      },
      {
        name: "Production",
        value: "production",
      },
    ],
  },
};
