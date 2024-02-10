import { Command } from "commander";
import pc from "picocolors";

export function DefaultOptions(program: Command): void {
  program.option("-m, --message", "帮助").action(() => {
    console.log(pc.red("输入tool -h查看帮助"));
  });
}
