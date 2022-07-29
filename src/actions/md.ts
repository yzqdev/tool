import { pipeline } from "node:stream/promises";
import { createWriteStream } from "node:fs";
import got from "got";

import * as crypto from "crypto";
import mime from "mime";
import { customAlphabet } from "nanoid";
/*
  1、fs.stat 获取文件状态
  2、fs.readdir 读取文件夹数据
  3、fs.access 判断文件夹是否存在
  4、path.join 拼路径
*/
//操作文件
import * as fs from "fs";
import pc from "picocolors";
//操作路径
import path from "node:path";
import { DirPath, SingleDirPath } from "../interfaces/mdInterface";

/**
 * 每个文件夹都生成README.md
 * @param inputPath
 */
export function genReadme(inputPath: any) {
  //1.接受命令行命令
  //3.判断路径是否存在
  //2.修正路径
  //[2]是输入的路径名
  if (!inputPath) {
    //判断有没有输入内容
    throw "请输入文件夹！";
  }
  //转换路径格式为绝对路径

  //输入的路径存在就执行递归
  try {
    //扩展：'.F_OK'==='检查目录中是否存在文件'
    //'.R_OK'==='检查文件是否可读',详细见nodejs文档
    //也可以这样写 ：判断是否存在，以及是否可读
    //fs.accessSync(inputPath,fs.constants.F_OK|fs.constants.R_OK);
    //这里的 fs.constants.F_OK 是默认值，不用写
    fs.accessSync(inputPath);
    genReadmeFiles(inputPath);
  } catch (err) {
    console.log(err);
  }

  function genReadmeFiles(filePath: string) {
    let state = fs.statSync(filePath);
    if (state.isFile()) {
      //是文件
      // console.log(filePath);
    } else if (state.isDirectory() && !filePath.includes("vuepress")) {
      //是文件夹
      //先读取

      if (fs.existsSync(path.resolve(filePath, "README.md"))) {
        console.log(`${filePath}已经有readme了`);
      } else {
        let fileName = "README.md";
        let content = "# " + filePath.split("\\").pop();
        fs.writeFileSync(path.join(filePath, fileName), `\n---\nindex: false\n---\n` + content);
      }
      let files = fs.readdirSync(filePath);
      files.forEach((file) => {
        //   console.log(path.join(filePath, file) + "，file");

        genReadmeFiles(path.join(filePath, file));
      });
    }
  }
}

/**
 * 遍历所有文件夹生成目录readme
 * @param inputPath
 */
export function genRecurseReadme(inputPath: string) {
  function readFileList(dir: string, filesList: SingleDirPath[] = []) {
    const files = fs.readdirSync(dir);
    let dirPath: SingleDirPath = {
      name: path.resolve(dir).split("\\").pop(),
      files: [],
    };
    files.forEach((item, index) => {
      let fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && item != "res" && item != ".vuepress") {
        console.log(path.join(dir, item));
        console.log("files=", filesList);
        readFileList(path.join(dir, item), filesList); //递归读取文件
      } else {
        if (path.extname(item) == ".md") {
          dirPath.files.push(fullPath.split(path.sep).join("/"));
        }
        // filesList.push(fullPath.replace("\\", "/"));
      }
    });
    filesList.push(dirPath);
    return filesList;
  }
  let filesList: SingleDirPath[] = [];
  readFileList(inputPath, filesList);
  console.log("filelist=", filesList);
  let md = "";
  let head = path.resolve().split("\\").pop();
  for (let link of filesList) {
    md += `\n## ${link.name}\n\n`;
    for (let file of link.files) {
      let data = fs.readFileSync(file);
      let pattern = /# [\S]{0,20}/;
      if (pattern.test(data.toString())) {
        md += `- [${data.toString().match(pattern)![0].slice(2)}](./${file})\n`;
      }
    }
  }

  let fileName = "README.md";
  let finalMd = `# ${head}\n` + md;
  try {
    fs.writeFileSync(fileName, finalMd);
    //文件写入成功。
    console.log(`${fileName}创建成功`);
  } catch (err) {
    console.error(err);
  }
}
export function genSingleReadme(inputPath: any) {
  function readFileList(dir: string, filesList: DirPath[] = []) {
    const files = fs.readdirSync(dir);
    let dirPath: DirPath = {
      name: path.resolve().split("\\").pop(),
      files: [],
    };
    files.forEach((item, index) => {
      let fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      // console.log(path.extname(item));
      // console.log(fullPath);
      if (stat.isDirectory() || path.extname(item).toLowerCase() != ".md" || item.toLowerCase() == "readme.md") {
        //   console.log("not markdown", item.toString());
      } else {
        let data = fs.readFileSync(fullPath);
        let pattern = /# \S{0,20}/;
        if (pattern.test(data.toString())) {
          dirPath.files.push({
            content: data.toString().match(pattern)![0].slice(2),
            filename: fullPath.replace("\\", "/"),
          });
        } else {
          console.log(fullPath);
          dirPath.files.push({
            content: fullPath.split(".")[0],
            filename: fullPath.replace("\\", "/"),
          });
        }

        // filesList.push(fullPath.replace("\\", "/"));
      }
    });
    filesList.push(dirPath);
    return filesList;
  }
  let filesList: DirPath[] = [];
  readFileList(inputPath, filesList);

  let mdContent = "";
  for (let link of filesList) {
    mdContent += `\n# ${link.name}\n\n## 目录\n\n`;
    for (let file of link.files) {
      mdContent += `- [${file.content}](./${file.filename})\n`;
    }
  }

  console.log(mdContent);
  let fileName = "README.md";
  try {
    fs.writeFileSync(fileName, mdContent);
    //文件写入成功。
    console.log(`${fileName}创建成功`);
  } catch (err) {
    console.error(err);
  }
}
export function getAllMarkdowns(inputPath: any) {
  function readFileList(dir: string, filesList: string[] = []) {
    const files = fs.readdirSync(dir);
    let dirPath = { name: path.resolve().split("\\").pop(), files: [] };
    files.forEach((item, index) => {
      let fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory() || path.extname(item).toLowerCase() != ".md") {
        //   console.log("not markdown", item.toString());
      } else {
        filesList.push(fullPath.replace("\\", "/"));
      }
    });
    // filesList.push(dirPath);
    return filesList;
  }
  let filesList: string[] = [];
  readFileList(inputPath, filesList);
  console.log(filesList);
  fs.writeFile("filelist.txt", filesList.join(`\n`), { encoding: "utf-8" }, (err: any) => {
    if (err) {
    } else {
      console.log("success");
    }
  });
}

/**
 * 把markdown里面的文件下载到本地
 * @param file markdown文件
 */
export async function genMarkdownImgs(file: string) {
  let beforeName = path.resolve(process.cwd(), file);
  let backupFile = `${path.basename(beforeName, ".md")}.bak.md`;
  let data = fs.readFileSync(beforeName);
  let reg = new RegExp(/!\[.*\]\(.+\)/, "gi");
  let imgFolder = "img";
  let imgs: string[] = data.toString().match(reg) ?? [];
  for (let item of imgs) {
    let uri = replacerMdTagToUrl(item);
    console.log("图片url=>", pc.cyan(`${uri}`));
    let fileId = replacerFileName(item);
    if (!fs.existsSync(imgFolder)) {
      fs.mkdirSync(imgFolder);
    }
    await downloadImage(uri, imgFolder, fileId);
  }
  function replacerMdTagToUrl(urlString: string) {
    let reg = new RegExp(/\((.+)\)/, "g");
    let pureUrl = reg.exec(urlString)![0];
    let httpStr = pureUrl.slice(1, pureUrl.length - 1);
    if (!httpStr.includes("http")) {
      httpStr = `https://${pureUrl}`;
    }
    return httpStr;
  }
  /**
   * 生成如下的格式(1624847415629-4a7a5f1e-7644-4370-9ed7-e1f83ce4873f.png)
   * @param {s} fileName
   * @returns
   */
  function replacerFileName(fileName: string) {
    // let extReg = new RegExp(/\d*-.*\.(png|jpg|gif|webp|awebp)/, "gi");
    // let spited = fileName.split("/");
    // let finalName = spited[spited.length - 1].substring(0, spited[spited.length - 1].length - 1);
    // console.log(pc.magenta(`最后的文件名:${finalName}`));
    let finalName = crypto.createHash("md5").update(fileName).digest("hex");

    return finalName;
  }
  /**
   * 下载文件
   * @param url 下载图片地址
   * @param folder 文件地址
   * @param fileId
   */
  async function downloadImage(url: string, folder: string, fileId: string) {
    if (!url.includes("http")) {
      url = "https://" + url;
    }
    const readStream = got.stream(url);

    const onError = (error: any) => {
      console.log(pc.red(error));
      // Do something with it.
    };

    readStream.on("response", async (response) => {
      if (response.headers.age > 3600) {
        console.log("Failure - response too old");
        readStream.destroy(); // Destroy the stream to prevent hanging resources.
        return;
      }

      readStream.off("error", onError);

      try {
        let contentType = response.headers["content-type"];
        let fileName = fileId + "." + mime.getExtension(contentType);

        await pipeline(readStream, createWriteStream(path.join(folder, fileName)));
        //写入文件
        function replacerMd(match: string) {
          return `![${replacerFileName(match)}](./${imgFolder}/${fileName})`;
        }
        let arr = data.toString().replaceAll(reg, replacerMd);
        fs.writeFileSync(backupFile, data.toString());
        fs.writeFileSync(beforeName, arr);
      } catch (error) {
        onError(error);
      }
    });

    readStream.once("error", onError);
  }
}
