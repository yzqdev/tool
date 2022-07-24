import * as fs from "fs";
import * as path from "path";
import pc from "picocolors";
import { IConfig } from "./interfaces";
import { confPath, npmrcPath } from "./constants/dirs";
import { npmrc } from "./utils/npmrc";
import { defaultConfig } from "./constants/strs";

export class ToolConfig {
  /**
   * 默认位置`C:\Users\<user>\toolConfig.json`
   * @private
   */
  private confPath: string;
  private jsonData: object = {};
  constructor() {
    this.confPath = confPath;

    if (fs.existsSync(this.confPath)) {
      console.log(pc.cyan("已找到"));
      fs.readFile(this.confPath, (err, data) => {
        if (err) {
        } else {
          this.jsonData = JSON.parse(data.toString());
        }
      });
    } else {
      fs.writeFileSync(this.confPath, "{}");
    }
  }
  async init(): Promise<IConfig> {
    let data = await fs.readFileSync(this.confPath);
    return JSON.parse(data.toString());
  }
  async writeJson(json: object) {
    fs.readFile(this.confPath, (err, content) => {
      if (err) {
        throw err;
      }
      // 按行遍历原有配置，改其内容

      let conf: IConfig = JSON.parse(content.toString());
      let config = Object.assign(conf, json);
      // 如果文件内容有变化，保存结果
      if (content.toString() !== JSON.stringify(config)) {
        fs.writeFileSync(this.confPath, JSON.stringify(config));
      }
    });
  }
}
