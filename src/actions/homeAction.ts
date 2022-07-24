import shell from "shelljs";
import open from "open";
import got from "got";
interface PypiRes {
  info: {
    home_page: string;
  };
}
interface PubRes {
  latest: {
    pubspec: { homepage: string };
  };
}
export async function openPypiHome(pkg: string) {
  let res: PypiRes;
  try {
    res = await got(`https://pypi.python.org/pypi/${pkg}/json`, {
      timeout: {
        request: 3000,
      },
    }).json();
    open(res.info.home_page);
  } catch (error) {
    open(`https://pypi.org/project/${pkg}`);
  }
}
export async function openPub(pkg: string) {
  let res: PubRes = await got(`https://pub.flutter-io.cn/api/packages/${pkg}`).json();
  open(res.latest.pubspec.homepage);
}
export function openGit() {
  if (!shell.which("git")) {
    //在控制台输出内容
    shell.echo("Sorry, this script requires git");
    shell.exit(1);
  }
  let res = shell.exec("git remote  get-url --push origin").stdout;
  open(res);
}
