export type CommandOption = {
  flags: string;
  description: string;
  defaultValue?: string | boolean | string[];
};

export type CommandProps = {
  name: string;
  args?: string;
  title?: string;
  description: string;
  options?: CommandOption[];
  action: (config: PimsterConfig, ...args: any[]) => void | Promise<void>;
};

export type Choice = {
  name: string;
  value: any; // Value could be any type, you can replace 'any' with the actual type if known
  action?: () => Promise<void>;
};

export type Question = {
  type: string;
  name: string;
  message: string;
  choices?: Choice[];
};

export type Project = {
  name: string;
  path: string;
};

export type Database = {
  host: string;
  username: string;
  name: string;
  password: string;
};

export type PimsterConfig = {
  projects: Project[];
  database: {
    production: Database;
    staging: Database;
    [key: string]: Database;
  };
};
