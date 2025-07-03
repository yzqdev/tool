import { Command } from "commander";
import {
  addLanguageIdentity,
  genMarkdownImgs,
  genReadme,
  genRecurseReadme,
  genSingleReadme,
  getAllMarkdowns,
} from "@/actions/md";

import path from "node:path";

import inquirer from "inquirer";

export function MarkCommand(program: Command): void {
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

    md.command("addLang")
      .argument("<file>", "要装换的文件")
      .description("添加代码块标识符")
      .option("-l, --lang <langId>", "语言id")
      .action(async (file,option:{lang:string}) => {
        console.log(file,option.lang)
        addLanguageIdentity(file,option.lang);
      });
}
