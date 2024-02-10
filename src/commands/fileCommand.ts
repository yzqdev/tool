import { AbstractCommand } from "./abstractCommand";
import { Command } from "commander";
import {
  deleteByExtension,
  genCodeDemo,
  genName,
  genTxt,
  getFolderSize,
  getLargeMd5,
  renameToTs,
  toWebp,
  transferToWebp,
} from "@/actions/file";

import crypto from "crypto";
import ora from "ora";
import pc from "picocolors";
import prettyBytes from "pretty-bytes";
import * as path from "path";
import { WebpInterface } from "@/interfaces";
import { RenameOption } from "@/interfaces/Ioption";
import { FilesizeResult } from "@/interfaces/actionOpts";
import { formatDuring } from "@/utils/timeUtil";
import { readFile } from "fs/promises";
interface CodeOption {
  path: string;
}
export class FileCommand extends AbstractCommand {
  load(program: Command): void {
    let fileCmd = program.command("file").description("一些文件操作");
    fileCmd
      .command("code")
      .option("-p, --path [path]", "路径,例子: ./res")
      .description("生成代码引用")
      .action((cmd: CodeOption) => {
        if (cmd.path) {
          genCodeDemo(cmd.path);
        } else {
          genCodeDemo(".");
        }
      });
    fileCmd
      .command("txt")
      .description("生成文本文件")
      .action(() => {
        genTxt("./");
      });
    fileCmd
      .command("name")
      .description("打印名字")
      .action(() => {
        genName("./");
      });
    fileCmd
      .command("rename")
      .option("-f, --from <file>", "输入文件")
      .option("-t, --to <file>", "输出文件")
      .description("转为ts")
      .action(async (options: RenameOption) => {
        let start = performance.now();
        const spinner = ora({
          discardStdin: false,
          text: pc.cyan(`重命名中\n`),
        }).start();
        await renameToTs("./", options);
        let end = performance.now();
        spinner.succeed("重命名完毕,用时" + formatDuring(end - start));
      });
    fileCmd
      .command("md5 <file>")
      .description("获取md5")
      .action(async (file) => {
        console.log("计算文件md5");
        getLargeMd5(file);
      });
    fileCmd
      .command("rm <ext> [dirPath]")
      .description("删除文件夹内某类型的文件: ext可以是 .js, .md, .go, .ts等等")
      .action((ext, dirPath) => {
        deleteByExtension(ext, dirPath);
      });
    fileCmd
      .command("webp [img]")
      .description("图片转换为webp")
      .option("-q, --quality")
      .action((img: string, option: WebpInterface) => {
        if (img) {
          toWebp(img, option);
        } else {
          console.log("没有参数");
          transferToWebp(path.resolve(), option);
        }
      });
    fileCmd
      .command("size [folder]")
      .description("查看文件夹大小")
      .action(async (folder) => {
        let start = performance.now();
        const spinner = ora({
          discardStdin: false,
          text: pc.cyan(`计算${folder ? folder : "当前"}文件夹大小中...\n`),
        }).start();
        let res: FilesizeResult;
        if (folder) {
          res = await getFolderSize(folder);
          let end = performance.now();
          spinner.succeed("查询完毕,用时" + formatDuring(end - start));
        } else {
          res = await getFolderSize("./");
          let end = performance.now();
          spinner.succeed("查询完毕,用时" + formatDuring(end - start));
        }
        console.log(
          pc.cyan(`文件夹的大小是:`),
          prettyBytes(res.size, { locale: "zh" }),
        );
        console.log(pc.cyan(`文件数量:`), pc.green(`${res.all - res.folder}`));
        console.log(pc.cyan(`文件夹数量:`), pc.green(`${res.folder}`));
      });
  }
}
