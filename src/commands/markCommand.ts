import { AbstractCommand } from "./abstractCommand";
import { Command } from "commander";
import {
  genMarkdownImgs,
  genReadme,
  genRecurseReadme,
  genSingleReadme,
  getAllMarkdowns,
} from "../actions/md";

import * as path from "path";

import inquirer from "inquirer";

export class MarkCommand extends AbstractCommand {
  load(program: Command): void {
    let md = program.command("md").description("对markdown文件的操作");

    // .option("-r, --recurse", "遍历文件夹生成readme")
    md.command("readme").action(() => {
      console.log(`当前路径是${path.resolve()}`);
      inquirer
        .prompt([
          {
            type: "list",
            name: "action",
            message: "你想做什么?",
            choices: [
              { name: "遍历所有文件夹生成目录readme", value: "r" },
              { name: "遍历当前文件夹的md生成目录readme", value: "s" },
              { name: "每个文件夹都生成README.md", value: "a" },
              { name: "生成filelist.txt", value: "txt" },
            ],
          },
        ])
        .then((answers) => {
          switch (answers.action) {
            case "r":
              genRecurseReadme("./");
              break;
            case "a":
              genReadme("./");
              break;
            case "s":
              genSingleReadme("./");
              break;
            case "txt":
              getAllMarkdowns("./");
              break;
            default:
              break;
          }
        });
    });

    md.command("img")
      .argument("<file>", "要转换的文件")
      .description("下载md文件里面的图片")
      .action(async (file) => {
        await genMarkdownImgs(file);
      });
  }
}
