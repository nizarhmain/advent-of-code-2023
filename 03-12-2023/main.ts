import * as fs from "fs";
import { arrayRange, isSymbol } from "./util";

const FILE_PATH = "./input3.txt";

const DIGIT_REGEX = /\d+/g;

type MatchType = {
  start: number;
  end: number;
  indices: number[];
  value: string;
};

function getIndices(inputString: string): MatchType[] {
  let match;
  const indices = [];

  while ((match = DIGIT_REGEX.exec(inputString)) !== null) {
    indices.push({
      start: match.index,
      end: DIGIT_REGEX.lastIndex - 1,
      indices: arrayRange(match.index, DIGIT_REGEX.lastIndex - 1, 1),
      value: match[0],
    });
  }

  return indices;
}

function checkFor(
  sus: MatchType[],
  target: string,
  index: number,
  interestingIndex: number,
  indicesToCheck: MatchType,
) {
  if (isSymbol(target)) {
    console.warn(
      `⚠️  symbol detected at: [${index}] [${interestingIndex} for [${index}] [${interestingIndex}]`,
    );
    sus.push(indicesToCheck);
  }
}

// takes the string above
// takes the string below
// takes the string to analyze
// all of them can be undefined
function solvePartOne(s: string[]): number {
  const sus: MatchType[] = [];

  // for every row
  for (let i = 0; i < s.length; i++) {
    // get digit about row that we're looking at
    const allYouNeed = getIndices(s[i]);

    allYouNeed.forEach((indicesToCheck) => {
      for (const interestingIndex of indicesToCheck.indices) {
        // check on the right for the first
        if (s[i] !== undefined) {
          // check on the left of the first digit
          const onLeft = s[i][indicesToCheck.indices[0] - 1];

          // check on the right of the first digit
          const onRight =
            s[i][indicesToCheck.indices[indicesToCheck.indices.length - 1] + 1];

          if (isSymbol(onLeft)) {
            sus.push(indicesToCheck);
            console.log("on left", onLeft);
            break;
          }

          if (isSymbol(onRight)) {
            console.log("on right", onRight);
            sus.push(indicesToCheck);
            break;
          }
        }

        // check below
        if (s[i + 1] !== undefined) {
          // check below
          const below: string | undefined = s[i + 1][interestingIndex];
          if (isSymbol(below)) {
            sus.push(indicesToCheck);
            break;
          }
          // check diagonal left
          const diagoLeft: string | undefined = s[i + 1][interestingIndex - 1];
          if (isSymbol(diagoLeft)) {
            sus.push(indicesToCheck);
            break;
          }
          // check diagonal right
          const diagoRight: string | undefined = s[i + 1][interestingIndex + 1];
          if (isSymbol(diagoRight)) {
            sus.push(indicesToCheck);
            break;
          }
        }

        // check above
        if (s[i - 1] !== undefined) {
          // check below
          const below = s[i - 1][interestingIndex];
          if (isSymbol(below)) {
            sus.push(indicesToCheck);
            break;
          }
          // check diagonal left
          const diagoLeft = s[i - 1][interestingIndex - 1];
          if (isSymbol(diagoLeft)) {
            sus.push(indicesToCheck);
            break;
          }
          checkFor(sus, diagoLeft, i - 1, interestingIndex - 1, indicesToCheck);
          // check diagonal right
          const diagoRight: string | undefined = s[i - 1][interestingIndex + 1];
          if (isSymbol(diagoRight)) {
            sus.push(indicesToCheck);
            break;
          }
        }
      }
    });
  }
  const sum = sus.reduce(
    (acc, currentValue) => (acc += Number(currentValue.value)),
    0,
  );
  return sum;
}

export function solvePuzzleFor(filePath: string = FILE_PATH): Promise<number> {
  const x = new Promise<number>((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data: string) => {
      if (err) {
        console.error("cannot read");
        reject(0);
      } else {
        const splitString = data.split("\n").filter((x) => x.length > 0);
        const res = solvePartOne(splitString);
        resolve(res);
      }
    });
  });
  return x;
}

solvePuzzleFor(FILE_PATH);
