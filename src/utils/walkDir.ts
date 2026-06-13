import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const DEFAULT_IGNORES = ["node_modules", ".git", ".vuepress"];

export interface WalkDirOptions {
  ignore?: string[];
  followSymlinks?: boolean;
}

/**
 * Recursively walk a directory, calling `callback` for each file/directory.
 */
export async function walkDir(
  dir: string,
  callback: (
    filePath: string,
    stats: Awaited<ReturnType<typeof stat>>,
  ) => Promise<void> | void,
  options: WalkDirOptions = {},
): Promise<void> {
  const { ignore = DEFAULT_IGNORES } = options;
  const entries = await readdir(dir);

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const fileStat = await stat(fullPath);

    if (fileStat.isDirectory()) {
      if (!ignore.includes(entry)) {
        await callback(fullPath, fileStat);
        await walkDir(fullPath, callback, options);
      }
    } else {
      await callback(fullPath, fileStat);
    }
  }
}

/**
 * Recursively collect file paths matching an extension.
 */
export async function findFilesByExt(
  dir: string,
  ext: string,
  options: WalkDirOptions = {},
): Promise<string[]> {
  const results: string[] = [];
  await walkDir(
    dir,
    (filePath, fileStat) => {
      if (fileStat.isFile() && path.extname(filePath) === ext) {
        results.push(filePath);
      }
    },
    options,
  );
  return results;
}

/**
 * Recursively collect all file paths.
 */
export async function findAllFiles(
  dir: string,
  options: WalkDirOptions = {},
): Promise<string[]> {
  const results: string[] = [];
  await walkDir(
    dir,
    (filePath, fileStat) => {
      if (fileStat.isFile()) {
        results.push(filePath);
      }
    },
    options,
  );
  return results;
}
