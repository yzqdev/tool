import { AbstractCommand } from "./abstractCommand";
import { Command } from "commander";
import { removeConfigs, setAllReg, setElectronEnv, setFlutter, setNodeEnv, setPythonEnv } from "../actions/reg";
import pc from "picocolors";
export type LangType = "py" | "node" | "flutter" | "electron";
export class RegCommand extends AbstractCommand {
  load(program: Command): void {
    let regCommand = program.command("reg").description("设置环境变量");
    regCommand
      .command("setall")
      .description("设置一些国内需要的环境变量")
      .action(async () => {
        await setAllReg();
      });
    regCommand
      .command("set <lang>")
      .description("设置环境变量")
      .action((lang: LangType) => {
        switch (lang) {
          case "py":
            setPythonEnv();
            break;
          case "node":
            setNodeEnv();
            break;
          case "flutter":
            setFlutter();
            break;
          case "electron":
            setElectronEnv();
            break;
        }
      });
    regCommand
      .command("un")
      .description("重置所有设置")
      .action(async () => {
        console.log(pc.cyan("删除toolconfig和npmrc"));
        await removeConfigs();
      });
    regCommand
      .command("reset")
      .description("重新设置")
      .action(async () => {
        await removeConfigs();

        await setAllReg();
      });
  }
}
