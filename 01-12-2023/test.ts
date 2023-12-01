import { strict as assert } from "node:assert";
import { solvePuzzleFor } from "./main";

solvePuzzleFor().then((result) => assert.equal(result, 56324));
