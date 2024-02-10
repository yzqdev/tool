import regedit, { RegistryItemPutCollection } from "regedit";
import shell from "shelljs";
import pc from "picocolors";
import inquirer from "inquirer";
import fs from "node:fs";
import { writeFile } from "node:fs/promises";
import { fixUrl, isWin, npmrc } from "../utils/npmrc";
import { EnvPrompt } from "../interfaces/npmInterface";
import { ToolConfig } from "../toolConfig";
import { confPath, npmrcPath, pipPath } from "../constants/dirs";
import { copy, copyFile, vendorFile } from "../utils/fileUtils";

export async function setAllReg() {
  let toolConfig = new ToolConfig();
  let toolJson = await toolConfig.init();
  let questions = [];
  if (!toolJson.node) {
    questions.push({ name: "node", type: "confirm", message: "设置node镜像?" });
  }
  if (!toolJson.nvm) {
    questions.push({ name: "nvm", type: "confirm", message: "设置nvm镜像?" });
  }
  if (!toolJson.python) {
    questions.push({
      name: "python",
      type: "confirm",
      message: "设置pip镜像?",
    });
  }
  if (!toolJson.flutter) {
    questions.push({
      name: "flutter",
      type: "confirm",
      message: "设置flutter镜像?",
    });
  }
  if (!toolJson.electron) {
    questions.push({
      name: "electron",
      type: "confirm",
      message: "设置electron镜像?",
    });
  }
  let result: EnvPrompt = await inquirer.prompt(questions);
  if (result.node) {
    if (!fs.existsSync(npmrcPath)) {
      console.log(pc.cyan("未找到.npmrc文件,正在创建"));

      try {
        await writeFile(npmrcPath, "");

        console.log(pc.cyan("已经创建完毕"));
        setNodeEnv();
      } catch (e) {
        console.log(e);
      }
    } else {
      setNodeEnv();
    }
  }
  if (result.nvm) {
    setNvmMirror();
    // setEnv("NVM_NODEJS_ORG_MIRROR", "https://npmmirror.com/mirrors/node");
  }
  if (result.flutter) {
    setFlutter();
  }
  if (result.python) {
    setPythonEnv();
  }
  if (result.electron) {
    setElectronEnv();
  }
  await toolConfig.writeJson(result);
}

export function setPythonEnv() {
  if (!shell.which("pip")) {
    shell.echo("你还没有安装python,pip,请注意!");
    if (isWin) {
      copy(vendorFile("pip.ini", "conf"), pipPath);
    }
    shell.exit(1);
  }
  shell.exec(
    `pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple`,
  );
  shell.exec(`pip config set install.trusted-host pypi.tuna.tsinghua.edu.cn`);
  console.log(pc.cyan("设置成功"));
}
export function setElectronEnv() {
  setEnv("ELECTRON_MIRROR", "https://npmmirror.com/mirrors/electron/");
}
export function setNvmMirror() {
  if (!shell.which("nvm")) {
    shell.echo("你还没安装nvm!");
    shell.exit(1);
  }
  shell.exec("nvm npm_mirror https://npmmirror.com/mirrors/npm/");
  shell.exec("nvm node_mirror https://npmmirror.com/mirrors/node/");
  console.log(pc.cyan("设置nvm镜像成功"));
}

export function setEnv(key: string, value: string, type: any = "REG_SZ") {
  let envData: RegistryItemPutCollection = {
    "HKCU\\Environment": {
      [key]: {
        value: value,
        type: type,
      },
    },
  };
  regedit.putValue(envData, function (err) {
    console.log("你已经设置过了!");
    console.log(err ? err : "");
  });
}

/**
 * 设置fluttern的环境变量
 */

export function setFlutter() {
  let valuesToPut: RegistryItemPutCollection = {
    "HKCU\\Environment": {
      FLUTTER_STORAGE_BASE_URL: {
        value: "https://storage.flutter-io.cn",
        type: "REG_SZ",
      },
      PUB_HOSTED_URL: {
        value: "https://pub.flutter-io.cn",
        type: "REG_SZ",
      },
    },
  };
  regedit.putValue(valuesToPut, (err) => {
    console.log("你已经设置过了!");
    console.log(err);
  });
}

export function setNodeEnv() {
  fixUrl(npmrc);

  fs.readFile(npmrcPath, (err, content) => {
    if (err) {
      throw err;
    }
    // 按行遍历原有配置，改其内容
    let config: string | string[] = content
      .toString()
      .match(/^.*$/gm)!
      .filter((line) => {
        let [, matchStr] = line.match(/^(.+?)\s*=/) ?? [""];

        return !(matchStr?.toLowerCase() in npmrc);
      });

    while (config.length && !config[config.length - 1]) {
      config.pop();
    }

    if (config.length) {
      config.push("");
    }

    // 将文件中没有的配置项，追加到其末尾

    Object.keys(npmrc).forEach((key) => {
      console.log(key);
      if (npmrc[key]) {
        console.log("> npm config set", key, npmrc[key]);
        if (typeof config !== "string") {
          config.push(key + "=" + npmrc[key]);
        }
      }
    });

    if (config[config.length - 1]) {
      config.push("");
    }

    // 将配置转换为字符串
    config = config.join("\n");
    // 如果文件内容有变化，保存结果
    if (content.toString() !== config) {
      fs.writeFileSync(npmrcPath, config);
    }
  });
}
export async function removeConfigs() {
  if (fs.existsSync(confPath)) {
    fs.unlinkSync(confPath);
    let result = await inquirer.prompt([
      {
        name: "npmrc",
        type: "confirm",
        message: "是否删除npmrc",
      },
    ]);
    if (result.npmrc) {
      if (fs.existsSync(npmrcPath)) {
        fs.unlinkSync(npmrcPath);
      }
    }

    console.log(pc.cyan("重置成功!"));
  } else {
    console.log(pc.red("您还没有任何配置!"));
  }
}
