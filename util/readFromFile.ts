import * as fs from "fs";
import { convert, findRaces, findWays } from "./main";

export function readFromFile(filePath: string): Promise<number> {
  const x = new Promise<number>((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data: string) => {
      if (err) {
        console.error("cannot read");
        reject(0);
      } else {
        const splitString = data.split("\n").filter((x) => x.length > 0);

        // solving for part two
        // 7 15 30 means one race with 71530 instead, combine all the numbers
        const vert_l = convert(splitString[0]).length;
        const races = findRaces(vert_l, splitString);

        const result = findWays(races);

        console.log(result);

        // for each race, figure out how many ways there are to solve them
        resolve(1);
      }
    });
  });
  return x;
}
