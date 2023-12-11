import * as fs from "fs";
import { arrayRange, isNumber, isSymbol } from "./util";

const FILE_PATH = "./input3.txt";

const DIGIT_REGEX = /\d+/g;

type MatchType = {
  start: number;
  end: number;
  indices: number[];
  value: string;
};

function getIndices(inputString: string, regex = DIGIT_REGEX): MatchType[] {
  let match;
  const indices = [];

  while ((match = regex.exec(inputString)) !== null) {
    indices.push({
      start: match.index,
      end: regex.lastIndex - 1,
      indices: arrayRange(match.index, regex.lastIndex - 1, 1),
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

function solvePartTwo(s: string[]): number {
  const all: Array<Set<string>> = [];

  const cat = [];

  for (let i = 0; i < s.length; i++) {
    // look for the *
    // check for right
    // check for left
    const allYouNeed = getIndices(s[i], /\*/g);

    const perStar = allYouNeed.map((star) => {
      const adjacents = new Set<string>();
      // look to the left
      if (isNumber(s[i][star.start - 1])) {
        const indices = getIndices(s[i]);
        // find the entire digit that coincides with the star.start - 1 index
        const filteredIndices = indices.filter((found) =>
          found.indices.includes(star.start - 1),
        );
        console.log(`found number on left ${filteredIndices[0].value} ⬅️`);
        adjacents.add(filteredIndices[0].value);
      }

      // look to the right
      if (isNumber(s[i][star.start + 1])) {
        // if you find a number, get the entire digit
        const indices = getIndices(s[i]);
        // find the entire digit that coincides with the star.start - 1 index
        const filteredIndices = indices.filter((found) =>
          found.indices.includes(star.start + 1),
        );
        console.log(`found number on left ${filteredIndices[0].value} ➡️`);
        adjacents.add(filteredIndices[0].value);
      }

      // look straight above
      if (i >= 1 && isNumber(s[i - 1][star.start])) {
        // if you find a number above get it
        const indices = getIndices(s[i - 1]);
        const filteredIndices = indices.filter((found) =>
          found.indices.includes(star.start),
        );
        console.log(
          `found number straight above ${filteredIndices[0].value} ⬆️`,
        );
        adjacents.add(filteredIndices[0].value);
      }

      // look straight below
      console.log(i);
      if (i < s.length - 1 && isNumber(s[i + 1][star.start])) {
        // if you find a number above get it
        const indices = getIndices(s[i + 1]);
        const filteredIndices = indices.filter((found) =>
          found.indices.includes(star.start),
        );
        console.log(
          `found number straight below ${filteredIndices[0].value} ⬇️`,
        );
        adjacents.add(filteredIndices[0].value);
      }

      // look above and left
      if (i >= 1 && isNumber(s[i - 1][star.start - 1])) {
        const indices = getIndices(s[i - 1]);
        const filteredIndices = indices.filter((found) =>
          found.indices.includes(star.start - 1),
        );
        console.log(
          `found number straight above and to the left ${filteredIndices[0].value} ⬅️: ⬆️`,
        );
        adjacents.add(filteredIndices[0].value);
      }

      // look above and right
      if (i >= 1 && isNumber(s[i - 1][star.start + 1])) {
        const indices = getIndices(s[i - 1]);
        const filteredIndices = indices.filter((found) =>
          found.indices.includes(star.start + 1),
        );
        console.log(
          `found number straight above and to the left ${filteredIndices[0].value} ➡️  ⬆️`,
        );
        adjacents.add(filteredIndices[0].value);
      }

      // look below and left
      if (i < s.length - 1 && isNumber(s[i + 1][star.start - 1])) {
        const indices = getIndices(s[i + 1]);
        const filteredIndices = indices.filter((found) =>
          found.indices.includes(star.start - 1),
        );
        console.log(
          `found number straight below and to the left ${filteredIndices[0].value} ⬅️  ⬇️`,
        );
        adjacents.add(filteredIndices[0].value);
      }

      // look below and right
      if (i < s.length - 1 && isNumber(s[i + 1][star.start + 1])) {
        const indices = getIndices(s[i + 1]);
        const filteredIndices = indices.filter((found) =>
          found.indices.includes(star.start + 1),
        );
        console.log(
          `found number straight above and to the left ${filteredIndices[0].value} ➡️  ⬇️`,
        );
        adjacents.add(filteredIndices[0].value);
      }
      return adjacents;
    });
    console.log(perStar);
    cat.push(perStar);
  }

  const filtered = cat.filter((x) => x.length > 0);
  console.log(filtered);

  // const sumReduce = filtered.map((x) => [...x.values()].map((y) => Number(y)));
  const sumReduce = filtered.flatMap((x) =>
    x
      .filter((stuff) => stuff.size === 2)
      .map((y) => [...y.values()].map((z) => Number(z))),
  );
  console.log(sumReduce);

  const stuff = sumReduce.reduce((acc, currentValue) => {
    // example [[32, 16], [1, 2]]
    // should be (32 * 16) + 1 * 2
    // first run the * and then run the +
    const x =
      acc +
      currentValue.reduce((acc2, curr) => {
        const y = acc2 * curr;
        return y;
        // start with 1, otherwise you end up multiplying by 0
      }, 1);
    return x;
  }, 0);

  console.log(stuff);

  // check for bottom
  //
  // check for top
  return 0;
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
        // const res = solvePartOne(splitString);
        const res = solvePartTwo(splitString);
        // console.log(res);
        resolve(res);
      }
    });
  });
  return x;
}

solvePuzzleFor(FILE_PATH);
