import * as fs from "fs";

export function readFromFile(filePath: string): Promise<string[]> {
  const x = new Promise<string[]>((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data: string) => {
      if (err) {
        console.error("cannot read");
        reject(0);
      } else {
        const splitString = data.split("\n").filter((x) => x.length > 0);

        // solving for part two
        // 7 15 30 means one race with 71530 instead, combine all the numbers
        // for each race, figure out how many ways there are to solve them
        resolve(splitString);
      }
    });
  });
  return x;
}
