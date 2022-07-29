import { ServeOption } from "../interfaces/Ioption";

import http from "http";
import boxen from "boxen";
import pc from "picocolors";
import { AddressInfo } from "net";
import * as os from "os";
import express from "express";
import serveIndex from "serve-index";
import * as path from "path";
export async function expServer(option: ServeOption) {
  let port = option.port ?? 3000;
  const app = express();
  console.log(path.resolve());
  console.log(option.dir);
  let dir = option.dir ?? "/";
  app.use(
    dir,
    express.static(path.resolve()),
    serveIndex(path.resolve(), { icons: true })
  );

  app.listen(port, () => {
    let message = pc.green("Serving!");
    const ip = getNetworkAddress();
    let httpMode = "http";
    let localAddress = `${httpMode}://localhost:${port}${option.dir ?? ""}`;
    let networkAddress = ip
      ? `${httpMode}://${ip}:${port}${option.dir ?? ""}`
      : null;
    if (localAddress) {
      const prefix = networkAddress ? "- " : "";
      const space = networkAddress ? "            " : "  ";

      message += `\n\n${pc.bold(`${prefix}Local:`)}${space}${localAddress}`;
    }

    if (networkAddress) {
      message += `\n${pc.bold("- On Your Network:")}  ${networkAddress}`;
    }
    console.log(
      boxen(message, {
        padding: 1,
        borderColor: "green",
        margin: 1,
      })
    );
  });
}

const registerShutdown = (fn: Function) => {
  let run = false;

  const wrapper = () => {
    if (!run) {
      run = true;
      fn();
    }
  };

  process.on("SIGINT", wrapper);
  process.on("SIGTERM", wrapper);
  process.on("exit", wrapper);
};
export const getNetworkAddress = () => {
  const interfaces: any = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const osinterface of interfaces[name]) {
      const { address, family, internal } = osinterface;
      if (family === "IPv4" && !internal) {
        return address;
      }
    }
  }
};
