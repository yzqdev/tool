import path from "node:path";
import pc from "picocolors";
import shell from "shelljs";
import { WebpInterface } from "@/interfaces";
import { RenameOption, RenameParams } from "@/interfaces/Ioption";
import { FilesizeOpts } from "@/interfaces/actionOpts";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import {
  readdir,
  readFile,
  rename,
  stat,
  lstat,
  unlink,
  writeFile,
} from "fs/promises";
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { walkDir } from "@/utils/walkDir";

const execAsync = promisify(exec);

/**
 * 使用 PowerShell 获取文件夹大小和文件/文件夹数量
 */
export async function getFolderSizeUsePwsh(itemPath: string): Promise<{
  size: number;
  all: number;
  folder: number;
  num: number;
  errors: Error[] | null;
}> {
  // 构建 PowerShell 命令
  // 1. 获取所有子项（递归）
  // 2. 分别计算总大小、文件总数、文件夹总数
  const absPath = path.resolve(itemPath);

  const psCommand = `
    $items = Get-ChildItem -Path "${absPath}" -Recurse -ErrorAction SilentlyContinue;
    $stats = $items | Measure-Object -Property Length -Sum;
    $fileCount = ($items | Where-Object { !$_.PSIsContainer }).Count;
    $folderCount = ($items | Where-Object { $_.PSIsContainer }).Count;
    @{
        size = if ($stats.Sum -eq $null) { 0 } else { $stats.Sum };
        all = $fileCount + $folderCount;
        files = if ($fileCount -eq $null) { 0 } else { $fileCount };
        folders = if ($folderCount -eq $null) { 0 } else { $folderCount };
    } | ConvertTo-Json
  `;

  try {
    // 调用 PowerShell (设置 powershell 编码为 UTF8 避免中文路径乱码)
    const { stdout } = await execAsync(
      `powershell -NoProfile -Command "${psCommand.replace(/\n/g, "")}"`,
      {
        maxBuffer: 1024 * 1024 * 10, // 增加 buffer 以防输出过多
      },
    );

    const result = JSON.parse(stdout);

    return {
      size: result.size,
      all: result.all,
      folder: result.folders,
      num: result.files,
      errors: null,
    };
  } catch (e) {
    console.error(pc.red("PowerShell 查询失败:"), e);
    // 如果失败，可以降级回你原来的 JS 递归逻辑，或者直接报错
    throw e;
  }
}

export function getLargeMd5(file: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const start = performance.now();
    const stream = createReadStream(file);
    const hash = createHash("md5");

    stream.on("data", (chunk: Buffer) => {
      hash.update(chunk);
    });

    stream.on("end", () => {
      const md5 = hash.digest("hex");
      const end = performance.now();
      console.log(`MD5: ${md5}`);
      console.log(`用时:${(end - start) / 1000}s`);
      resolve(md5);
    });

    stream.on("error", (err) => {
      reject(err);
    });
  });
}
export async function genCodeDemo(dir: string) {
  console.log(pc.cyan(`路径是:${dir}`));
  let files = await readdir(".");
  let arr = [];
  let exts = [".ts", ".js"];
  for (const item of files) {
    if (exts.includes(path.extname(item))) {
      arr.push(`@[code](${dir}/${item})\n`);
    }
  }

  await writeFile("code.txt", arr.join(""));
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
  await walkDir(filePath, async (filedir, fileStat) => {
    if (fileStat.isFile()) {
      if (options.fromExt.includes(path.extname(filedir))) {
        const newPath = filedir.replace(path.extname(filedir), options.toExt);
        console.log(
          `rename ${pc.cyan(filedir)} to ${pc.cyan(path.basename(newPath))}`,
        );
        await rename(filedir, newPath);
      }
    }
  });
}

/**
 * 删除后缀为..的文件
 * @param ext
 * @param dir
 */
export async function deleteFileRecurse(ext: string, dir: string) {
  await walkDir(dir, async (fullPath, fileStat) => {
    if (fileStat.isFile() && path.extname(fullPath) === ext) {
      await unlink(fullPath);
      console.log(pc.red(`删除的路径=> ${fullPath}`));
    }
  });
}

export async function deleteByExtension(ext: string, dir: string = "./") {
  await deleteFileRecurse(ext, dir);
}

export function toWebp(img: string, option: WebpInterface) {
  const reg = /(\.(?:jpg|png|jpeg|gif|bmp))$/i;
  if (!shell.which("cwebp")) {
    console.log(
      pc.red(
        "你还没有安装cwebp! https://developers.google.cn/speed/webp/docs/cwebp",
      ),
    );
    return;
  }
  const out = img?.replace(reg, ".webp");
  const script = `cwebp.exe -q ${option.quality ?? 90} "${img}" -o "${out}"`;
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
  options?: FilesizeOpts,
): Promise<{
  size: number;
  all: number;
  folder: number;
  num: number;
  errors: Error[] | null;
}> {
  return await core(itemPath, options, { errors: true });
}

async function core(
  rootItemPath: string,
  options: FilesizeOpts = {},
  returnType: { strict?: boolean; errors?: boolean } = {},
): Promise<
  | {
      size: number;
      all: number;
      folder: number;
      num: number;
      errors: Error[] | null;
    }
  | number
> {
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

    const stats = await lstat(itemPath);
    if (typeof stats !== "object") return;
    fileSizes.set(stats.ino, stats.size);

    if (stats.isDirectory()) {
      ++fileNum.folder;
      const directoryItems = await readdir(itemPath);
      if (typeof directoryItems !== "object") return;
      await Promise.all(
        directoryItems.map((directoryItem: string) =>
          processItem(path.join(itemPath, directoryItem)),
        ),
      );
    }
    ++fileNum.all;
  }

  const folderSize = Array.from(fileSizes.values()).reduce(
    (total, fileSize) => total + fileSize,
    0,
  );

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
