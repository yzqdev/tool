import pc from "picocolors";
import { Command } from "commander";
import { TestCommand } from "./testCommand";
import { DefaultOptions } from "./defaultOptions";
import { MarkCommand } from "./markCommand";
import { HelpCommand } from "./helpCommand";
import { RegCommand } from "./regCommand";
import { FileCommand } from "./fileCommand";
import { CmdCommand } from "./cmdCommand";
import { ServeCommand } from "./serveCommand";
import { HomeCommand } from "./homeCommand";
export class CommandLoader {
  public static load(program: Command): void {
    DefaultOptions(program);
    CmdCommand(program);
    FileCommand(program);
    HelpCommand(program);
    HomeCommand(program)
    MarkCommand(program);
    RegCommand(program);
    ServeCommand(program);
    TestCommand(program);
    handleInvalidCommand(program);
  }
}
export function handleInvalidCommand(program: Command) {
  program.on("command:*", () => {
    console.error(
      `\n Invalid command: ${pc.red("%s")}`,
      program.args.join(" "),
    );
    console.log(`输入${pc.red("--help")}查看命令  \n`);
    process.exit(1);
  });
}
