import * as fs from "fs";
import { mapNumberTextToNumber } from "./map-number-text-to-actual-number";

/**
 *
 * This is the first puzzle in AOC 2023
 *
 * link here: https://adventofcode.com/2023/day/1
 *
 *
 */
const FILE_PATH = "./input1.txt";

// const testInput = ["1abc2", "pqr3stu8vwx", "a1b2c3d4e5f", "treb7uchet"];

// read this https://mtsknn.fi/blog/how-to-do-overlapping-matches-with-regular-expressions/
// to understand how lookahead and lookbehind in regexes work
// Hard case to handle here is:
// 'sevenine' => 79
// 'eighthree' => 83
const DIGIT_REGEX =
  /(?=(1|2|3|4|5|6|7|8|9|one|two|three|four|five|six|seven|eight|nine))/g;

function solve(s: string): number {
  if (s.length === 0) {
    return 0;
  }

  let matches = [];
  let m;
  while ((m = DIGIT_REGEX.exec(s)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === DIGIT_REGEX.lastIndex) {
      DIGIT_REGEX.lastIndex++;
    }

    matches.push(m[1]);
  }

  // get the first match
  const firstDigit = mapNumberTextToNumber(matches[0] ?? "");

  // get the last element
  const lastDigit = mapNumberTextToNumber(matches[matches.length - 1] ?? "");

  const concatenatedNumber = Number(firstDigit.concat(lastDigit));
  return concatenatedNumber;
}

export function solvePuzzleFor(filePath: string = FILE_PATH): Promise<number> {
  const x = new Promise<number>((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("cannot read");
        reject(0);
      } else {
        const splitString = data.split("\n");
        // sum everything
        const result = splitString.reduce(
          (acc, currentValue) => acc + solve(currentValue),
          0,
        );
        resolve(result);
      }
    });
  });
  return x;
}
solvePuzzleFor(FILE_PATH).then(console.log);
