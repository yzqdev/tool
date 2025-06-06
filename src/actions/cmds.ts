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
  const genshinNames:string[]=['jean','amber','lisa','kaeya','barbara','diluc','razor','venti','klee','noelle','mona','diona','eula','aloy','mika','ayaka','kokomi','sayu','thoma','gorou','kirara','mizuki','collei','dori','nilou','nahida','layla','lyney','lynette','furina','navia']
  const starrailNames: string[] = ['himko','welt','blade','firefly','topaz','jade','misha','robin','ratio','swan','sparkle','arlan','asta','herta','ruanmei','gepard','bronya','seele','clara','sampo','pela','natasha'];
  const waveNames: string[] = ['phoebe','brant','changli','lumi','carlotta','roccia','camellya','shorekeeper','encore','verina'];
  const otherNames: string[] = ['ironman','strange','captain','nick','stark','tony','hulk','bruce','thor','marvel','peter','parker','anna','elsa','sven','olaf','kristen'];
  const all=[...genshinNames,...starrailNames,...waveNames,...otherNames]
  const len=all.length
  const rand = Math.floor(Math.random() * len) + 1;
  
  console.log(all[rand])
}
