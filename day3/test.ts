import { strict as assert } from "node:assert";
import { solvePuzzleFor } from "./main";

solvePuzzleFor("./input2.txt").then((result) =>
  assert.deepStrictEqual(result, 467),
);

solvePuzzleFor("./input3.txt").then((result) =>
  assert.deepStrictEqual(result, 549908),
);
