import shell from "shelljs";
import open from "open";
import axios from 'axios'
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
    res = (await axios.get(`https://pypi.python.org/pypi/${pkg}/json`, {
      
    })).data;
    open(res.info.home_page);
  } catch (error) {
    open(`https://pypi.org/project/${pkg}`);
  }
}
export async function openPub(pkg: string) {
  let res: PubRes =( await axios.get(
    `https://pub.flutter-io.cn/api/packages/${pkg}`,
  )).data ;
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
