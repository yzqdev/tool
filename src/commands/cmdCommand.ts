import { Command } from "commander";
import {
  flutterCommands,
  nameCommands,
  npmActions,
  pnpmCommands,
  yarnActions,
} from "@/actions/cmds";

export function CmdCommand(program: Command) {
  let cmdCommand = program.command("cmd").description("显示常用的cmd命令");
  cmdCommand
    .command("yarn")
    .description("yarn常用操作")
    .action(() => {
      yarnActions();
    });
  cmdCommand
    .command("npm")
    .description("npm常用操作")
    .action(() => {
      npmActions();
    });
  cmdCommand
    .command("pnpm")
    .description("pnpm常用命令")
    .action(() => {
      pnpmCommands();
    });
  cmdCommand
    .command("flutter")
    .description("flutter用法")
    .description("flutter常用命令")
    .action(() => {
      flutterCommands();
    });
  cmdCommand
    .command("name")
    .description("name 用法")
    .action(() => {
      nameCommands()
    });
}
