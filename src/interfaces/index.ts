import { EnvPrompt } from "./npmInterface";

export interface IConfig extends EnvPrompt {
  [name: string]: string | boolean | null;
}
export interface WebpInterface {
  quality: string | number;
}
