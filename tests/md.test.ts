import { expect, test } from "vitest";
 import fs from 'node:fs'
test("test md lang reg ", () => {
  const content=fs.readFileSync('./tests/lang.md').toString()
  const regex = /^ {0,3}``` *(\S*)? *\r?\n([\s\S]*?)^ {0,3}```\s*$/gm;
  console.log(regex.exec(content));

});
