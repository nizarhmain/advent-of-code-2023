import * as fs from "fs";

const FILE_PATH = "./input.txt";

const DIGIT_REGEX = /\d+/g;

// Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
// return the index if it's possible, otherwise, return 0
function solve(s: string): number {
  if (s.length === 0) {
    return 0;
  }

  const separateIdAndBalls = s.split(":");
  const gameId = Number(separateIdAndBalls[0].match(DIGIT_REGEX)) ?? 0;

  // ['1 blue, 2 green', '3 green, 4 blue, 1 red', '1 green, 1 blue']
  const x = isGamePossible(separateIdAndBalls[1]);
  console.log(`${gameId} - ${x}`);

  if (x === true) {
    return gameId;
  } else {
    return 0;
  }
}

function isGamePossible(s: string): boolean {
  const regex = /(\d+)\s*(green|red|blue)/g;

  const matches = [...s.matchAll(regex)];

  // Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
  // condition 12 red cubes, 13 green cubes, and 14 blue cubes

  // console.log(matches.length);

  // check that the cubes are less than 12r, 13g and 14b

  // run through each and check if possible or not
  const conditions = matches.map((match) => {
    const colorName = match[2];
    const colorValue = Number(match[1]);

    if (colorName === "red" && colorValue > 12) {
      return false;
    }

    if (colorName === "green" && colorValue > 13) {
      return false;
    }

    if (colorName === "blue" && colorValue > 14) {
      return false;
    }

    return true;
  });

  return conditions.every((value) => value === true);
}

export function solvePuzzleFor(filePath: string = FILE_PATH): Promise<number> {
  const x = new Promise<number>((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("cannot read");
        reject(0);
      } else {
        const splitString = data.split("\n");

        const x = splitString.reduce(
          (acc, currentValue) => acc + solve(currentValue),
          0,
        );
        resolve(x);
      }
    });
  });
  return x;
}

solvePuzzleFor(FILE_PATH).then(console.log);
