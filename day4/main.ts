import * as fs from "fs";

function checkWinningNumbers(s: string): number {
  const splitString = s.split(" | ");
  const winning_ticket = splitString[0]
    .split(":")[1]
    .trim()
    .split(" ")
    .filter((x) => x.length > 0)
    .map((x) => Number(x));
  const your_ticket = splitString[1]
    .trim()
    .split(" ")
    .filter((x) => x.length > 0)
    .map((x) => Number(x));

  return your_ticket.filter((x) => winning_ticket.includes(x)).length;
}

// tried to write this in Ruby, but failed miserably
function solvePartTwo(s: string[]): number {
  const countMap = new Map<string, number>();
  // for each line
  s.forEach((line, i) => {
    // add 1 to it's count map
    const count = countMap.get(line) ?? 0;
    // increment if it exists, set it to 1 if the record in the hash map did not exist
    countMap.set(line, count + 1);
    // check if there are matching numbers
    const matches = checkWinningNumbers(line);
    // do this for copies as well
    for (let j = 0; j < (countMap?.get(line) ?? 1); j++) {
      // if there are 2 matching numbers for this line
      for (let h = 1; h <= matches; h++) {
        // take a peek at the next two lines, and bump the counters in the countMap for each of their elements by one
        const peekedLine = s[i + h];
        const maybeCount = countMap.get(peekedLine);
        countMap.set(peekedLine, maybeCount ? maybeCount + 1 : 1);
      }
    }
  });

  const result = [...countMap.values()].reduce(
    (acc, currentValue) => acc + currentValue,
    0,
  );

  return result;
}

export function solvePuzzleFor(filePath: string): Promise<number> {
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

const args: string[] = process.argv;
const filepath: string = args[2];

solvePuzzleFor(filepath).then((res) => console.log(res));
