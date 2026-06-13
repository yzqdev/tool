import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import pc from "picocolors";
import { IConfig } from "./interfaces";
import { confPath, npmrcPath } from "./constants/dirs";
import { defaultConfig } from "./constants/strs";

export class ToolConfig {
  private confPath: string;
  constructor() {
    this.confPath = confPath;

    if (!fsSync.existsSync(this.confPath)) {
      fsSync.writeFileSync(this.confPath, "{}");
    } else {
      console.log(pc.cyan("已找到配置文件"));
    }
  }
  async init(): Promise<IConfig> {
    const data = await fs.readFile(this.confPath);
    return JSON.parse(data.toString());
  }
  async writeJson(json: object) {
    const content = await fs.readFile(this.confPath);
    const conf: IConfig = JSON.parse(content.toString());
    const config = Object.assign(conf, json);
    if (content.toString() !== JSON.stringify(config)) {
      await fs.writeFile(this.confPath, JSON.stringify(config));
    }
  }
}
