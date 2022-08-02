import { AbstractCommand } from "./abstractCommand";
import { Command } from "commander";
import { expServer } from "../actions/serveAction";
import { ServeOption } from "../interfaces/Ioption";

export class ServeCommand implements AbstractCommand {
  load(program: Command): void {
    let serve = program
      .command("serve")
      .description("一个web服务器")
      .option("-p, --port <port>", "例子:tool serve -p 9090")
      .option("-d, --dir <dir>", "例子:tool serve -d /atools")
      .action(async (opt: ServeOption) => {
        console.log(opt);
          expServer(opt);
      });
  }
}
