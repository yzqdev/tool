import { npmrc } from "../utils/npmrc";

export interface CommonObj {
  [name: string | number]: string | object;
}

export interface Npmrc extends CommonObj {}

export interface Apts extends CommonObj {}

export interface Opts extends CommonObj {
  aptMirrorsPrefix: string;
  binMirrorsPrefix: string;
  aliMirrorsPrefix: string;
  npmrc: Npmrc;
  apt: Apts;
  env: Env;
}

export interface EnvPrompt {
  node: boolean;
  nvm: boolean;
  flutter: boolean;
  electron: boolean;
  python: boolean;
}

export interface Env {
  https_proxy?: string ;
  http_proxy?: string  ;

  // https://github.com/nodejs/node-gyp/
  NODEJS_ORG_MIRROR: string | object;
  IOJS_ORG_MIRROR: string;
  NVMW_NPM_MIRROR?: string;
  Path?: string;
  PATH?: string;
  HOMEBREW_BOTTLE_DOMAIN?: string;
}
