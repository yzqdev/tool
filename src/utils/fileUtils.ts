import {
  createReadStream,
  createWriteStream,
  mkdirSync,
  readdirSync,
  statSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * 获取vendor文件的路径
 * @param name 文件名称
 * @param folder  文件夹名称
 * @returns
 */
export function vendorFile(name: string, folder: string): string {
  const templateDir = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "../vendor/" + folder,
    name,
  );
  return templateDir;
}
/**
 * @param {string | undefined} targetDir
 */
export function formatTargetDir(targetDir: string) {
  return targetDir?.trim().replace(/\/+$/g, "");
}

/**
 * 文件夹是否存在
 * @param dirPath
 */
export const ensureDirExistSync = (dirPath: string): void => {
  try {
    readdirSync(dirPath);
  } catch (err) {
    mkdirSync(dirPath, { recursive: true });
  }
};
/**
 * 复制文件(使用steam)
 * @param srcFile 源
 * @param targetFile 目标
 */
export const copyFile = (srcFile: string, targetFile: string): void => {
  const targetDir = dirname(targetFile);

  ensureDirExistSync(targetDir);

  const rs = createReadStream(srcFile); // create read stream
  const ws = createWriteStream(targetFile); // create write stream

  rs.pipe(ws);
};
/**
 * 复制文件夹
 * @param srcDir
 * @param targetDir
 */
export const copyDir = (srcDir: string, targetDir: string): void => {
  ensureDirExistSync(targetDir);

  const files = readdirSync(srcDir, { withFileTypes: true });

  files.forEach((file) => {
    if (file.isFile())
      copyFile(`${srcDir}/${file.name}`, `${targetDir}/${file.name}`);
    else if (file.isDirectory())
      copyDir(`${srcDir}/${file.name}`, `${targetDir}/${file.name}`);
  });
};
/**
 * 复制文件夹或者文件
 * @param src
 * @param target
 */
export const copy = (src: string, target: string): void => {
  if (statSync(src).isDirectory()) copyDir(src, target);
  else if (statSync(src).isFile()) copyFile(src, target);
};
