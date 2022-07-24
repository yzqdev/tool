import { AbstractCommand } from "./abstractCommand";
import { Command } from "commander";
import pc from "picocolors";

export class HelpCommand extends AbstractCommand {
  load(program: Command): void {
    program.command("help").action(() => {
      console.log(pc.red("输入tool -h查看帮助"));
    });
  }
}
