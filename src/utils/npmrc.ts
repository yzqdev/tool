import { Apts, Env, Npmrc, Opts } from "../interfaces/npmInterface";

export const isWin = process.platform === "win32";
export const npmrc: Npmrc = {
  registry: "{bin-mirrors}",
  disturl: "{bin-mirrors}/node",
  "chromedriver-cdnurl": "{bin-mirrors}/chromedriver",
  "couchbase-binary-host-mirror": "{bin-mirrors}/couchbase/v{version}",
  "debug-binary-host-mirror": "{bin-mirrors}/node-inspector",
  "electron-mirror": "{bin-mirrors}/electron/",
  "flow-bin-binary-host-mirror": "{bin-mirrors}/flow/v",
  "fse-binary-host-mirror": "{bin-mirrors}/fsevents",
  "fuse-bindings-binary-host-mirror": "{bin-mirrors}/fuse-bindings/v{version}",
  "git4win-mirror": "{bin-mirrors}/git-for-windows",
  "gl-binary-host-mirror": "{bin-mirrors}/gl/v{version}",
  "grpc-node-binary-host-mirror": "{bin-mirrors}",
  "hackrf-binary-host-mirror": "{bin-mirrors}/hackrf/v{version}",
  "leveldown-binary-host-mirror": "{bin-mirrors}/leveldown/v{version}",
  "leveldown-hyper-binary-host-mirror": "{bin-mirrors}/leveldown-hyper/v{version}",
  "mknod-binary-host-mirror": "{bin-mirrors}/mknod/v{version}",
  "node-sqlite3-binary-host-mirror": "{bin-mirrors}",
  "node-tk5-binary-host-mirror": "{bin-mirrors}/node-tk5/v{version}",
  "nodegit-binary-host-mirror": "{bin-mirrors}/nodegit/v{version}/",
  "operadriver-cdnurl": "{bin-mirrors}/operadriver",
  "phantomjs-cdnurl": "{bin-mirrors}/phantomjs",
  "profiler-binary-host-mirror": "{bin-mirrors}/node-inspector/",
  "puppeteer-download-host": "{bin-mirrors}",
  "rabin-binary-host-mirror": "{bin-mirrors}/rabin/v{version}",
  "sodium-prebuilt-binary-host-mirror": "{bin-mirrors}/sodium-prebuilt/v{version}",
  "sqlite3-binary-site": "{bin-mirrors}/sqlite3",
  "utp-native-binary-host-mirror": "{bin-mirrors}/utp-native/v{version}",
  "zmq-prebuilt-binary-host-mirror": "{bin-mirrors}/zmq-prebuilt/v{version}",
};

export const env: Env = {
  

  // https://github.com/nodejs/node-gyp/
  NODEJS_ORG_MIRROR: npmrc.disturl,
  IOJS_ORG_MIRROR: "{bin-mirrors}/iojs",
};

if (isWin) {
  // https://github.com/hakobera/nvmw/
  env.NVMW_NPM_MIRROR = "{bin-mirrors}/npm";
  env.Path = "node_modules\\.bin;%Path%";
} else {
  env.PATH = "node_modules/.bin:$PATH";
  if (process.platform === "darwin") {
    // https://brew.sh/index_zh-cn
    env.HOMEBREW_BOTTLE_DOMAIN = "{ali-mirrors}/homebrew/homebrew-bottles";
  }
}

export const apt: Apts = {
  "gitlab-runner": "{apt-mirrors}/gitlab-runner/{release-id}",
  "docker-ce": "{ali-mirrors}/docker-ce/linux/{release-id}",
  "gitlab-ce": "{apt-mirrors}/gitlab-ce/{release-id}",
  virtualbox: "{apt-mirrors}/virtualbox/apt",
  // mongodb: '{ali-mirrors}/mongodb/apt/{release-id}',
  nodesource: "{apt-mirrors}/nodesource/deb",
  // grafana: '{apt-mirrors}/grafana/apt',
  main: "{ali-mirrors}",
};

export const opts: Opts = {
  aptMirrorsPrefix: "https://mirrors.tuna.tsinghua.edu.cn",
  binMirrorsPrefix: "https://npmmirror.com/mirrors",
  aliMirrorsPrefix: "https://mirrors.aliyun.com",
  npmrc: npmrc,
  apt: apt,
  env: env,
};
type UrlParam=Opts|Apts|Npmrc |Env
export function fixUrl(obj:any) {
  Object.keys(obj).forEach((key) => {
    if (obj[key]) {
      if (typeof obj[key]==='string') {
         obj[key] = obj[key].replace(/\{(\w+)-mirrors}/g, (s: string, prefix: string) => opts[prefix + "MirrorsPrefix"] || s);
      }
     
    }
  });
  return obj;
}

fixUrl(apt);
fixUrl(env);
