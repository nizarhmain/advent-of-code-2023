import * as fs from "fs";

function convert(s: string) {
  const y = s.split(":")[1];
  return y
    .trim()
    .split("  ")
    .filter((_) => _)
    .map((x) => Number(x));
}

/**
 *
 * The trick in this puzzle, is to find the min and the max of this function
 * This means that we run calculations until we hit both the min and the max.
 *
 *
 * All values between the min and the max, are winning values in this function
 *
 * This is how integration works in maths
 *
 */

// go forward
function findMin(t: number, record_to_beat: number) {
  for (let h = 1; h < t; h++) {
    // (t - h) => race_time - holding_time: remaining time
    const rt = t - h;

    // speed * remaining_time is distance
    const distance = rt * h;

    if (distance > record_to_beat) {
      // if it's a win
      // return the holding time
      return h;
    }
  }

  return 0;
}

// loop backwards to find max
function findMax(t: number, record_to_beat: number) {
  for (let h = t - 1; h > 1; h--) {
    // (t - h) => race_time - holding_time: remaining time
    const rt = t - h;

    // speed * remaining_time is distance
    const distance = rt * h;

    if (distance > record_to_beat) {
      // if it's a win
      // return the holding time
      return h;
    }
  }

  return 0;
}

export function solvePuzzleFor(filePath: string): Promise<number> {
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

function findRaces(vert_l: number, splitString: string[]) {
  const races = [];

  // map the races correctly
  for (let index = 0; index < vert_l; index++) {
    const time = convert(splitString[0])[index];
    const record_to_beat = convert(splitString[1])[index];
    races.push({ time, record_to_beat });
  }
  return races;
}

function solvePartTwo(filePath: string): Promise<number> {
  const x = new Promise<number>((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data: string) => {
      if (err) {
        console.error("cannot read");
        reject(0);
      } else {
        const splitString = data.split("\n").filter((x) => x.length > 0);

        // solving for part two
        // 7 15 30 means one race with 71530 instead, combine all the numbers
        const big_time = concatAndSpit(splitString[0]);
        const big_distance = concatAndSpit(splitString[1]);

        const races = [{ time: big_time, record_to_beat: big_distance }];

        // this will be 1
        const result = findWays(races);

        console.log(result);

        // for each race, figure out how many ways there are to solve them

        resolve(1);
      }
    });
  });
  return x;
}

const args: string[] = process.argv;
const filePath: string = args[2];

// solve for 1 star
solvePuzzleFor(filePath);
//
// solve for 2 star
solvePartTwo(filePath);

function findWays(races: { time: number; record_to_beat: number }[]): number {
  const ways = races.map((race) => {
    const min = findMin(race.time, race.record_to_beat);
    const max = findMax(race.time, race.record_to_beat);

    const ways_to_win = max - min + 1;
    return ways_to_win;
  });

  const result = ways.reduce((acc, curr) => acc * curr, 1);
  return result;
}

function concatAndSpit(splitString: string): number {
  return Number(
    convert(splitString)
      .map((x: number) => x.toString())
      .join(""),
  );
}
