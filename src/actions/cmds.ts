import Table from "cli-table3";
import { flutterCmd, pnpmCmd, yarnCmd } from "@/constants/strs";
export function yarnActions() {
  let table = new Table({ head: ["命令", "说明"] });
  table.push(...yarnCmd);
  console.log(table.toString());
}
export function npmActions() {
  let table = new Table({ head: ["命令", "说明"] });
  table.push(...yarnCmd);

  console.log(table.toString());
}
export function pnpmCommands() {
  let table = new Table({ head: ["命令", "说明"] });
  table.push(...pnpmCmd);
  console.log(table.toString());
}
export function flutterCommands() {
  let table = new Table({ head: ["命令", "说明"] });
  table.push(...flutterCmd);

  console.log(table.toString());
}
export function nameCommands(){
  const genshinNames:string[]=['jean','amber','lisa','kaeya','barbara','diluc','razor','venti','klee','noelle','mona','diona','eula','aloy','mika']
  const starrailNames: string[] = [];
  const waveNames: string[] = [];
  const otherNames: string[] = [];
  const all=[...genshinNames,...starrailNames,...waveNames,...otherNames]
  const len=all.length
  const rand = Math.floor(Math.random() * len) + 1;
  console.log(all[rand])
}
