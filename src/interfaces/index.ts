import { EnvPrompt } from "./npmInterface";

export interface IConfig extends EnvPrompt {
  [name: string]: string | boolean | null;
}
export interface WebpInterface {
  quality: string | number;
}

export * from './actionOpts'
export * from './Ioption'
export * from './mdInterface'
export * from './npmInterface'
