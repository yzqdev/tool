import { IConfig } from "../interfaces";

export const questions = [
  { name: "node", type: "confirm", message: "设置node镜像?" },
  { name: "nvm", type: "confirm", message: "设置nvm镜像?" },
  { name: "flutter", type: "confirm", message: "设置flutter镜像?" },
  { name: "electron", type: "confirm", message: "设置electron镜像?" },
];
export const defaultConfig: IConfig = {
  electron: false,
  flutter: false,
  node: false,
  nvm: false,
  python: false,
};

export const yarnCmd = [
  ["yarn config list", "查看配置信息"],
  ["yarn global add npm-check-updates", "全局安装包"],
];

export const pnpmCmd = [
  ["pnpm init", "初始化package.json"],
  ["pnpm config set auto-install-peers true", "自动安装peer"],
  ["pnpm add -g serve", "安装全局包"],
  ["pnpm link -g ", "链接全局包"],
  ["pnpm un -g ", "卸载全局包"],
];
export const flutterCmd = [
  ["flutter create --platforms=windows,macos,linux .", "给现有项目添加支持"],
  ["flutter create my_app", "创建flutter应用"],
  ["flutter run -d windows", "运行windows程序"],
  ["flutter build windows", "打包发布windows"],
  ["flutter create --platforms=windows .", "添加windows支持"],
  ["flutter build apk --split-per-abi", "分开打包"],
  ["flutter build apk --obfuscate --split-debug-info debuginfo   --target-platform android-arm,android-arm64,android-x64 --split-per-abi", "分开打包"],
];
