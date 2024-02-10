import { Command } from "commander";
import pc from "picocolors";

export function HelpCommand(program: Command): void {
  program.command("help").action(() => {
    console.log(pc.red("输入tool -h查看帮助"));
  });
}
