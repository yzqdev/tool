import { Command } from "commander";
import pc from "picocolors";
import { getToolrc } from "@/utils/getToolrc";
export function TestCommand(program: Command): void {
  let test = program
    .command("test")
    .option("-r, --ret")
    .action(async (cmd) => {
      console.log(cmd);
    });

  test.command("md").action(() => {
    let conf = getToolrc();
    console.log(pc.red(JSON.stringify(conf)));
  });

  // program
  //   .command("test <source> [destination]")
  //   .description("clone a repository into a newly created directory")
  //   .action((source, destination) => {
  //     console.log("clone command called");
  //   });
}
