import { readFromFile } from "../util/readFromFile";

function countOccurrences(str: string, char: string) {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === char) {
      count++;
    }
  }
  return count;
}

const powerMap = new Map([
  ["A", 14],
  ["K", 13],
  ["Q", 12],
  // for part 1
  // ["J", 11],
  ["T", 10],
  ["9", 9],
  ["8", 8],
  ["7", 7],
  ["6", 6],
  ["5", 5],
  ["4", 4],
  ["3", 3],
  ["2", 2],
  // for part 2
  ["J", 1],
]);

type Hand = {
  letter: string;
  count: number;
  bid: number;
  card: string;
};

function calculateRank(s: string): Hand[] {
  // A, K, Q, J, T, 9, 8, 7, 6, 5, 4, 3, or 2
  // find if there are some things that are repeated
  const card_bid = s.split(" ");
  const card = card_bid[0];
  const bid = card_bid[1];
  const x = card.split("");

  // for each char, see if there's more of it
  // console.log(card);

  const uniq = [...new Set(x)];
  const str: Hand[] = uniq.map((letter) => {
    return {
      letter: letter,
      count: countOccurrences(card, letter),
      bid: Number(bid),
      card: card,
    };
  });

  return str;
}

const args: string[] = process.argv;
const filePath: string = args[2];

// solve for 1 star
readFromFile(filePath).then((x) => {
  const cards = x.map((card) => {
    return calculateRank(card);
  });

  cards.sort((originalA: Hand[], originalb: Hand[]) => {
    const tempMaxA = Math.max(
      ...originalA.filter((_) => _.letter !== "J").map((x) => x.count),
    );
    const tempMaxB = Math.max(
      ...originalb.filter((_) => _.letter !== "J").map((x) => x.count),
    );

    // find the card that has the maxA
    const bestCardALetter = findBestCard(originalA, tempMaxA);

    const bestCardBLetter = findBestCard(originalb, tempMaxB);

    // if there are J's, replace them with
    // this is insane
    const withoutJA = calculateRank(
      `${originalA[0].card.replaceAll("J", bestCardALetter)} ${
        originalA[0].bid
      }`,
    );
    const withoutJB = calculateRank(
      `${originalb[0].card.replaceAll("J", bestCardBLetter)} ${
        originalb[0].bid
      }`,
    );

    const maxA = Math.max(
      ...withoutJA.filter((_) => _.letter !== "J").map((x) => x.count),
    );
    const maxB = Math.max(
      ...withoutJB.filter((_) => _.letter !== "J").map((x) => x.count),
    );

    // if the rank is off, sort
    if (maxA < maxB) {
      return -1;
    } else if (maxA > maxB) {
      return 1;
    }

    // if they have the same max rank
    // check if you have one pair, or two pair for example
    const pairsForA = findPairs(withoutJA);
    const pairsForB = findPairs(withoutJB);
    if (pairsForA > pairsForB) {
      return 1;
    } else if (pairsForB > pairsForA) {
      return -1;
    }

    // check if full house or three
    if (maxA && maxB === 3) {
      // 23332
      // check if there might be a pair too
      if (pairsForA > pairsForB) {
        return 1;
      } else if (pairsForB > pairsForA) {
        // TTT98
        return -1;
      }
    }

    function checkNextCard(i: number): number {
      if (i < 5) {
        if (
          (powerMap.get?.(originalA[0].card[i]) ?? 0) >
          (powerMap.get?.(originalb[0].card[i]) ?? 0)
        ) {
          return 1;
        } else if (
          (powerMap.get?.(originalA[0].card[i]) ?? 0) <
          (powerMap.get?.(originalb[0].card[i]) ?? 0)
        ) {
          return -1;
        } else {
          // they are the same, call the function again on the [1] instead of [0]
          return checkNextCard(i + 1);
        }
      } else {
        return 0;
      }
    }
    // return the highest first card
    return checkNextCard(0);
  });

  const result = cards.reduce((acc, curr, i) => {
    console.log(`rank: ${i + 1}: ${curr[0].bid * (i + 1)}`);
    console.log(curr);
    acc = acc + curr[0].bid * (i + 1);
    return acc;
  }, 0);
  console.log(result);
});

function findPairs(withoutJA: Hand[]) {
  return withoutJA.reduce((acc, curr) => {
    if (curr.count === 2) {
      acc = acc + 1;
    }
    return acc;
  }, 0);
}

function findBestCard(originalA: Hand[], tempMaxA: number) {
  return (
    originalA
      .filter((_) => _.letter !== "J")
      .filter((x) => x.count === tempMaxA)
      .sort((a, b) =>
        (powerMap.get?.(a.letter) ?? 0) > (powerMap.get?.(b.letter) ?? 0)
          ? -1
          : 1,
      )[0]?.letter ?? "1"
  );
}
