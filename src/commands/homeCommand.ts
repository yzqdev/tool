import { Command } from "commander";
import pc from "picocolors";
import { HomeOption } from "../interfaces/Ioption";
import { openGit, openPub, openPypiHome } from "@/actions/homeAction";

export function HomeCommand(program: Command): void {
  program
    .command("home")
    .description("打开git仓库地址")
    .option("-g, --git", "打开git仓库")
    .option("-p, --python <pyName>", "python仓库")
    .option("-d, --dart <dartName>", "dart pub仓库")
    .action(async (param: HomeOption) => {
      if (param.python) {
        console.log(pc.cyan("python仓库"));
        await openPypiHome(param.python);
      }
      if (param.dart) {
        console.log(pc.cyan("dart仓库"));
        await openPub(param.dart);
      }
      if (param.git) {
        console.log(pc.cyan("git仓库"));
        openGit();
      }
    });
}
