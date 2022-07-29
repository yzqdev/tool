import { AbstractCommand } from "./abstractCommand";
import { Command } from "commander";
import {
  deleteByExtension,
  genName,
  genTxt,
  getFolderSize,
  renameToTs,
  toWebp,
  transferToWebp,
} from "../actions/file";
import fs from "fs";
import crypto from "crypto";
import ora from "ora";
import pc from "picocolors";
import prettyBytes from "pretty-bytes";
import * as path from "path";
import { WebpInterface } from "../interfaces";
import { RenameOption } from "../interfaces/Ioption";
import { FilesizeResult } from "../interfaces/actionOpts";
import { formatDuring } from "../utils/timeUtil";

export class FileCommand extends AbstractCommand {
  load(program: Command): void {
    let fileCmd = program.command("file").description("一些文件操作");

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
      .action((options: RenameOption) => {
        renameToTs("./", options);
      });
    fileCmd
      .command("md5 <file>")
      .description("获取md5")
      .action((file) => {
        const buffer = fs.readFileSync(file);
        const hash = crypto.createHash("md5");
        // @ts-ignore
        hash.update(buffer, "utf8");
        const md5 = hash.digest("hex");
        console.log(pc.cyan(md5));
      });
    fileCmd
      .command("rm <ext> [dirPath]")
      .description("删除文件夹内某类型的文件: ext可以是 js, md, go, ts等等")
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
          prettyBytes(res.size, { locale: "zh" })
        );
        console.log(pc.cyan(`文件数量:`), pc.green(`${res.all - res.folder}`));
        console.log(pc.cyan(`文件夹数量:`), pc.green(`${res.folder}`));
      });
  }
}
