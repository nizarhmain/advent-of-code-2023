import * as fs from "fs";
import { parseStringToMapper, type ElfMap, findLocation } from "./logic";

export function solvePuzzleFor(filePath: string): Promise<number> {
  const x = new Promise<number>((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data: string) => {
      if (err) {
        console.error("cannot read");
        reject(0);
      } else {
        const splitString = data.split("\n").filter((x) => x.length > 0);

        const maps = splitString
          .map((line, i) => {
            if (line.includes("map")) {
              const x = line.split(" ")[0];
              let index = i;

              const mappings = [];
              // Loop through the array until a condition is met
              while (
                index < splitString.length &&
                splitString[index + 1] !== undefined &&
                !splitString[index + 1].includes("map")
              ) {
                index++;
                // console.log(`map 🍁: ${splitString[index]}`);
                mappings.push(splitString[index]);
              }

              // select the values for this and create an ElfMap object
              const elfMap: ElfMap = {
                name: x,
                mappings: mappings.map((x) => parseStringToMapper(x)),
              };
              return elfMap;
            }
            return null;
          })
          .filter((_) => _) as ElfMap[];

        const seeds = splitString[0]
          .split(":")[1]
          .split(" ")
          .filter((_) => _)
          .map((x) => Number(x));

        const results = seeds.flatMap((s) => findLocation(maps, s));
        console.log(Math.min(...results));

        resolve(1);
      }
    });
  });
  return x;
}

const args: string[] = process.argv;
const filepath: string = args[2];

solvePuzzleFor(filepath);
