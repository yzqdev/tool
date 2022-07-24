import fg from "fast-glob";
import prettyBytes from "pretty-bytes";
import * as fs from "fs";
import * as path from "path";
import { SingleDirPath } from "../interfaces/mdInterface";
import pc from "picocolors";
import shell from "shelljs";
import { WebpInterface } from "../interfaces";
import { RenameOption } from "../interfaces/Ioption";
import { FilesizeOpts } from "../interfaces/actionOpts";
import { join } from "path";
import { writeFileSync } from "fs";

export function genTxt(dir: string) {
  let files = fs.readdirSync(dir);

  let arr = [];
  for (let i of files) {
    arr.push(`"${encodeURIComponent(i)}"`);
  }

  fs.writeFileSync("arr.txt", `[${arr.join(",")}]`);
}

export function genName(dir: string) {
  let files = fs.readdirSync(dir);

  let arr = [];
  for (let i of files) {
    arr.push(`"${i}"`);
  }

  fs.writeFileSync("name.txt", arr.join("\n"));
}

function fileRename(filePath: string, options: RenameOption) {
  let shouldRenameExt = options.from ? options.from.split(",") : [".mjs", ".js", ".cjs"];

  let renameTo = options.to ? options.to : ".ts";
  if (shouldRenameExt) {
    for (let item of shouldRenameExt) {
      console.log(item);
      if (!item.includes(".")) {
        throw new Error("请输入输入参数后缀,类似 .txt,.js");
      }
    }
  }
  if (options.to) {
    if (!options.to.includes(".")) {
      throw new Error("请输入参数后缀,类似 .txt,.js");
    }
  }

  let excludeDir = ["node_modules", ".vuepress"];
  //   console.log(8977)
  //根据文件路径读取文件，返回文件列表
  fs.readdir(filePath, function (err, files) {
    if (err) {
      console.warn(err);
    } else {
      //遍历读取到的文件列表
      files.forEach(function (filename) {
        //获取当前文件的绝对路径
        let filedir = path.join(filePath, filename);
        console.log("file dir =>", filedir);
        //根据文件路径获取文件信息，返回一个fs.Stats对象

        fs.stat(filedir, function (eror, stats) {
          if (eror) {
            console.warn("获取文件stats失败");
            throw eror;
          }

          let isFile = stats.isFile(); //是文件
          let isDir = stats.isDirectory(); //是文件夹
          if (isFile) {
            if (shouldRenameExt.includes(path.extname(filedir))) {
              fs.rename(filedir, filedir.replace(path.extname(filedir), renameTo), (err) => {
                if (err) {
                  throw err;
                }
                console.log(`rename ${path.basename(filedir)} to ${path.basename(filedir.replace(path.extname(filedir), ".ts"))}`);
              });
            }
          }
          if (isDir) {
            if (!excludeDir.includes(path.basename(filedir))) {
              fileRename(filedir, options);
            } //递归，如果是文件夹，就继续遍历该文件夹下面的文件
          }
        });
      });
    }
  });
}

export function renameToTs(dir: string, options: RenameOption) {
  let filePath = path.resolve(dir);
  //调用文件遍历方法
  fileRename(filePath, options);
}

export function deleteFileRecurse(ext: string, dir: string) {
  const files = fs.readdirSync(dir);

  files.forEach((item, index) => {
    let fullPath = path.join(dir, item);
    console.log(pc.red(fullPath));
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && item != "res" && item != ".vuepress") {
      console.log("删除的路径");
      console.log(`进入文件夹:${path.join(dir, item)}`);
      deleteFileRecurse(ext, path.join(dir, item)); //递归读取文件
    } else {
      if (path.extname(item) == `.${ext}`) {
        fs.unlinkSync(path.join(dir, item));
      }
    }
  });
}

export function deleteByExtension(ext: string, dir: string = "./") {
  deleteFileRecurse(ext, dir);
}

export function toWebp(img: string, option: WebpInterface) {
  let reg = new RegExp(/(.jpg|.png|.jpeg|.gif|.bmp)$/);
  if (shell.which("cwebp")) {
    console.log(pc.red("你还没有安装cwebp! https://developers.google.cn/speed/webp/docs/cwebp"));
  }
  let script = `cwebp.exe -q ${option.quality ?? 90} ${img} -o ${img?.replace(reg, ".webp")}`;
  console.log(script);
  shell.exec(script);
  console.log(pc.cyan("转换成功!"));
}

export function transferToWebp(dir: string, option: WebpInterface) {
  let files = fs.readdirSync(dir);

  for (let i of files) {
    if (fs.statSync(i).isFile() && path.extname(i) != ".webp") {
      toWebp(i, option);
    }
  }
}

/**
 * Returns an object containing the size of the folder and a list of errors encountered while traversing the folder.
 *
 * If any errors are returned, the returned folder size is likely smaller than the real folder size.
 *
 * @param {string} itemPath         - Path of the folder.
 * @param {object} [options]        - Options.
 * @param {object} [options.ignore] - If a file's path matches this regex object, its size is not counted.
 * @param {object} [options.fs]     - The filesystem that should be used. Uses node fs by default.
 *
 * @returns {Promise<{size: number, errors: Array<Error> | null}>} - An object containing the size of the folder in bytes and a list of encountered errors.
 */
export async function getFolderSize(itemPath: string, options?: FilesizeOpts): Promise<any> {
  return await core(itemPath, options, { errors: true });
}

async function core(rootItemPath: string, options: FilesizeOpts = {}, returnType: { strict?: boolean; errors?: boolean } = {}) {
  // const fs = options.fs || (await import("fs/promises"));
  let fileNum = {
    all: 0,
    folder: 0,
  };
  const fileSizes = new Map();
  const errors: Error[] = [];

  await processItem(rootItemPath);

  async function processItem(itemPath: string) {
    if (options.ignore?.test(itemPath)) return;

    const stats = returnType.strict ? fs.lstatSync(itemPath) : fs.lstatSync(itemPath);
    if (typeof stats !== "object") return;
    fileSizes.set(stats.ino, stats.size);

    if (stats.isDirectory()) {
      ++fileNum.folder;
      const directoryItems = returnType.strict ? fs.readdirSync(itemPath) : fs.readdirSync(itemPath);
      if (typeof directoryItems !== "object") return;
      await Promise.all(directoryItems.map((directoryItem: string) => processItem(join(itemPath, directoryItem))));
    }
    ++fileNum.all;
  }

  const folderSize = Array.from(fileSizes.values()).reduce((total, fileSize) => total + fileSize, 0);

  if (returnType.errors) {
    return {
      size: folderSize,
      all: fileNum.all,
      folder: fileNum.folder,
      num: fileNum.all - fileNum.folder,
      errors: errors.length > 0 ? errors : null,
    };
  } else {
    return folderSize;
  }
}
