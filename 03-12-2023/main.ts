import * as fs from "fs";
import { arrayRange, isSymbol } from "./util";

const FILE_PATH = "./input2.txt";

const DIGIT_REGEX = /\d+/g;

type MatchType = {
  start: number;
  end: number;
  indices: number[];
  value: string;
};

function getIndices(inputString: string): MatchType[] {
  console.log(inputString);
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
function solvePartOne(s: string[]) {
  const sus: MatchType[] = [];

  // for every row
  for (let i = 0; i < s.length; i++) {
    // get digit about row that we're looking at
    const allYouNeed = getIndices(s[i]);

    allYouNeed.forEach((indicesToCheck) => {
      indicesToCheck.indices.forEach((interestingIndex) => {
        // check below
        if (s[i + 1] !== undefined) {
          // check below
          const below = s[i + 1][interestingIndex];
          checkFor(sus, below, i + 1, interestingIndex, indicesToCheck);
          // check diagonal left
          const diagoLeft = s[i + 1][interestingIndex - 1];
          checkFor(sus, diagoLeft, i + 1, interestingIndex - 1, indicesToCheck);
          // check diagonal right
          const diagoRight: string | undefined = s[i + 1][interestingIndex + 1];
          checkFor(
            sus,
            diagoRight,
            i + 1,
            interestingIndex + 1,
            indicesToCheck,
          );
        }

        // check above
        if (s[i - 1] !== undefined) {
          // check below
          const below = s[i - 1][interestingIndex];
          checkFor(sus, below, i - 1, interestingIndex, indicesToCheck);
          // check diagonal left
          const diagoLeft = s[i - 1][interestingIndex - 1];
          checkFor(sus, diagoLeft, i - 1, interestingIndex - 1, indicesToCheck);
          // check diagonal right
          const diagoRight: string | undefined = s[i - 1][interestingIndex + 1];
          checkFor(
            sus,
            diagoRight,
            i - 1,
            interestingIndex + 1,
            indicesToCheck,
          );
        }
      });
    });
  }
  sus.forEach((x) => console.log(`suuuus is ${x.value} 🧾`));
}

export function solvePuzzleFor(filePath: string = FILE_PATH): Promise<number> {
  const x = new Promise<number>((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data: string) => {
      if (err) {
        console.error("cannot read");
        reject(0);
      } else {
        const splitString = data.split("\n").filter((x) => x.length > 0);
        solvePartOne(splitString);
        resolve(0);
      }
    });
  });
  return x;
}

solvePuzzleFor(FILE_PATH);
