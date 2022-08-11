import * as path from "path";
import pc from "picocolors";
import shell from "shelljs";
import { WebpInterface } from "@/interfaces";
import { RenameOption, RenameParams } from "@/interfaces/Ioption";
import { FilesizeOpts } from "@/interfaces/actionOpts";
import { basename, extname, join } from "path";

import { lstat, readdir, readFile, rename, stat, unlink, writeFile } from "fs/promises";
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";

export async function getSimpleMd5(file:string){
    const buffer = await readFile(file);
    const hash =  createHash("md5");
    // @ts-ignore
    hash.update(buffer, "utf8");
    const md5 = hash.digest("hex");
    console.log(pc.cyan(md5));
}
export async function getLargeMd5(file:string){
  let start=performance.now()
  const stream = createReadStream(file);
  const hash =  createHash("md5");
  stream.on("data", (chunk:any) => {
    hash.update(chunk, "utf8");
  });
  stream.on("end", () => {
    const md5 = hash.digest("hex");
    console.log(md5);
    let end = performance.now();
    console.log(`用时${(end - start)/1000}s`);
  });
  
}
export async function genCodeDemo(dir:string ) {
  console.log(pc.cyan(`路径是:${dir}`));
  let files= await readdir('.')
  let arr=[]
  let exts=['.ts','.js']
  for (const item of files) {
    
    if (exts.includes(extname(item))) {
      arr.push(`@[code](${dir}/${item})\n`);
    }
    
  }
   
  await writeFile('code.txt',arr.join(''))
}
export async function genTxt(dir: string) {
  let files = await readdir(dir);

  let arr = [];
  for (let i of files) {
    arr.push(`"${encodeURIComponent(i)}"`);
  }

  await writeFile("arr.txt", `[${arr.join(",")}]`);
}

export async function genName(dir: string) {
  let files = await readdir(dir);

  let arr = [];
  for (let i of files) {
    arr.push(`"${i}"`);
  }

  await writeFile("name.txt", arr.join("\n"));
}

/**
 * 重命名文件后缀
 * @param dir
 * @param options
 */
export async function renameToTs(dir: string, options: RenameOption) {
  let filePath = path.resolve(dir);
  //调用文件遍历方法
  let fromExt = options.from
    ? options.from.split(",")
    : [".mjs", ".js", ".cjs"];

  let toExt = options.to ? options.to : ".ts";

  if (fromExt) {
    for (let item of fromExt) {
      if (!item.includes(".")) {
        console.log(pc.red("请输入输入参数后缀,类似 .txt,.js"));
        return;
      }
    }
  }
  if (options.to) {
    if (!options.to.includes(".")) {
      console.log(pc.red("请输入输入参数后缀,类似 .txt,.js"));
      return;
    }
  }
  console.log(pc.red(`rename extension ${fromExt.join(",")} to ${toExt}`));
  await fileRename(filePath, { fromExt, toExt });
}

async function fileRename(filePath: string, options: RenameParams) {
  let excludeDir = ["node_modules", ".vuepress", ".git"];
  //   console.log(8977)
  //根据文件路径读取文件，返回文件列表
  let files = await readdir(filePath);

  //遍历读取到的文件列表
  for (const filename of files) {
    //获取当前文件的绝对路径
    let filedir = path.join(filePath, filename);
    // console.log("file dir =>", filedir);
    //根据文件路径获取文件信息，返回一个fs.Stats对象
    try {

      let stats = await stat(filedir);
      let isFile = stats.isFile(); //是文件
      let isDir = stats.isDirectory(); //是文件夹
      if (isFile) {
        if (options.fromExt.includes(path.extname(filedir))) {
         rename(
           filedir,
           filedir.replace(path.extname(filedir), options.toExt),
         ).then(() => {
           console.log(
             `rename ${pc.cyan(path.basename(filedir))} to ${pc.cyan(
               path.basename(
                 filedir.replace(path.extname(filedir), options.toExt)
               )
             )}`
           );
         })

        }
      }
      if (isDir) {
        if (!excludeDir.includes(path.basename(filedir))) {
          await fileRename(filedir, options);
        } //递归，如果是文件夹，就继续遍历该文件夹下面的文件
      }
    } catch (e) {
      console.warn("获取文件stats失败");
      throw e;
    }
  }


}

/**
 * 删除后缀为..的文件
 * @param ext
 * @param dir
 */
export async function deleteFileRecurse(ext: string, dir: string) {
  const files = await readdir(dir);

  for (const item of files) {
    const index = files.indexOf(item);
    let fullPath = path.join(dir, item);
    // console.log(pc.red(fullPath));
    const fileStat = await stat(fullPath);
    let ignores = ["img", "vuepress", ".git", "node_modules"];
    if (fileStat.isDirectory() && !ignores.includes(item)) {
      
      // console.log(`进入文件夹:${path.join(dir, item)}`);
      await deleteFileRecurse(ext, path.join(dir, item)); //递归读取文件
    } else {
      if (path.extname(item) == `${ext}`) {
        await unlink(path.join(dir, item));
        console.log(pc.red(`删除的路径=> ${path.join(dir, item)}`));
      }
    }
  }
}

export async function deleteByExtension(ext: string, dir: string = "./") {
  await deleteFileRecurse(ext, dir);
}

export function toWebp(img: string, option: WebpInterface) {
  let reg = new RegExp(/(.jpg|.png|.jpeg|.gif|.bmp)$/);
  if (shell.which("cwebp")) {
    console.log(
      pc.red(
        "你还没有安装cwebp! https://developers.google.cn/speed/webp/docs/cwebp"
      )
    );
  }
  let script = `cwebp.exe -q ${option.quality ?? 90} ${img} -o ${img?.replace(
    reg,
    ".webp"
  )}`;
  console.log(script);
  shell.exec(script);
  console.log(pc.cyan("转换成功!"));
}

export async function transferToWebp(dir: string, option: WebpInterface) {
  let files = await readdir(dir);

  for (let i of files) {
    if ((await stat(i)).isFile() && path.extname(i) != ".webp") {
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
export async function getFolderSize(
  itemPath: string,
  options?: FilesizeOpts
): Promise<any> {
  return await core(itemPath, options, { errors: true });
}

async function core(
  rootItemPath: string,
  options: FilesizeOpts = {},
  returnType: { strict?: boolean; errors?: boolean } = {}
) {
  // const fs = options.fs || (await import("fs/promises"));
  let fileNum = {
    all: 0,
    folder: 0
  };
  const fileSizes = new Map();
  const errors: Error[] = [];

  await processItem(rootItemPath);

  async function processItem(itemPath: string) {
    if (options.ignore?.test(itemPath)) return;

    const stats = returnType.strict
      ? await lstat (itemPath)
      : await lstat (itemPath);
    if (typeof stats !== "object") return;
    fileSizes.set(stats.ino, stats.size);

    if (stats.isDirectory()) {
      ++fileNum.folder;
      const directoryItems = returnType.strict
        ?  await readdir(itemPath)
        :  await readdir(itemPath);
      if (typeof directoryItems !== "object") return;
      await Promise.all(
        directoryItems.map((directoryItem: string) =>
          processItem(join(itemPath, directoryItem))
        )
      );
    }
    ++fileNum.all;
  }

  const folderSize = Array.from(fileSizes.values()).reduce(
    (total, fileSize) => total + fileSize,
    0
  );

  if (returnType.errors) {
    return {
      size: folderSize,
      all: fileNum.all,
      folder: fileNum.folder,
      num: fileNum.all - fileNum.folder,
      errors: errors.length > 0 ? errors : null
    };
  } else {
    return folderSize;
  }
}
