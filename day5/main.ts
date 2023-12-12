import * as fs from "fs";
import {
  parseStringToMapper,
  type ElfMap,
  findLocation,
  mergeRanges,
} from "./logic";

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

        const seedsPair = generateSeedsRangeMap(seeds);

        console.log(seedsPair);

        const x = mergeRanges(seedsPair);
        console.log(x);

        // let absolute_min = calculateMin(seedsPair, maps);

        // console.log("min", absolute_min);

        // Create an array of promises for parallel execution
        const calculateMinPromises = x.map((pair) =>
          calculateMin([pair], maps),
        );

        // Run all promises in parallel
        Promise.all(calculateMinPromises)
          .then((results) => {
            // Process the results
            console.log("Results:", Math.min(...results));
          })
          .catch((error) => {
            console.error("Error:", error);
          });

        // this needs to be a range instead
        // we again cannot create the actual seeds array manually
        // as the first element would create create an array of 20 million elements alone.
        // we have to be somewhat smart about it
        //
        // this is for solution 1
        // const results = seeds.flatMap((s) => findLocation(maps, s));
        // console.log(Math.min(...results));

        resolve(1);
      }
    });
  });
  return x;
}

const args: string[] = process.argv;
const filepath: string = args[2];

solvePuzzleFor(filepath);

// see if you can parallelize this
async function calculateMin(
  seedsPair: { start: number; range: number }[],
  maps: ElfMap[],
) {
  let absolute_min = 1;
  // for each pair, figure out the location
  seedsPair.forEach((pair, i) => {
    console.log(`starting calculation for seed ${i} ---- `);
    let local_min = 1;
    for (let index = 0; index < pair.range; index++) {
      const seed = pair.start + index;
      const location = findLocation(maps, seed);

      // Calculate the percentage completed
      const percentage = (index / (pair.start + pair.range)) * 100;

      if (seed % 10000000 === 0) {
        console.log(percentage);
        console.log(seed);
      }

      // set the minimum on the first iteration
      if (index === 0) {
        local_min = location;
      }

      if (location < local_min) {
        local_min = location;
      }
    }

    // set it for the first initialization
    if (i === 0) {
      absolute_min = local_min;
    }
    // if the local min of this pair is lower than whatever was there, set it
    if (local_min < absolute_min) {
      absolute_min = local_min;
    }
  });
  return absolute_min;
}

function generateSeedsRangeMap(seeds: number[]) {
  const seedsPair = [];
  for (let index = 0; index < seeds.length; index++) {
    if (index % 2 !== 0) {
      continue;
    }

    if (seeds[index + 1] !== undefined) {
      seedsPair.push({ start: seeds[index], range: seeds[index + 1] });
    }
  }
  return seedsPair;
}
