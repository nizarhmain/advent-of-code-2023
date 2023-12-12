console.log("DAY ----- 5 ⭐");

export type ElfMap = {
  name: string;
  mappings: MappingParams[];
};

function isNumberInRange(input: number, min: number, max: number) {
  return input >= min && input <= max;
}

// seed-to-soil map:
// 50 98 2
// 52 50 48
export type MappingParams = {
  // this is the soil
  // 50 98 2
  dest: number;
  // this is the seed
  // 52 50 48
  source: number;
  range: number;
};

function findDifferentiator(source_tuple: number[], dest_tuple: number[]) {
  // console.log(dest_tuple[0] - source_tuple[0]);
  return dest_tuple[0] - source_tuple[0];
}

export function findLocation(e: ElfMap[], root: number): number {
  // take the first map
  // this can be done with recursion too, but we're using a mutex flag here
  let newNumber: number = root;
  const x = e.map((elf) => {
    let foundMapping = false;
    elf.mappings.forEach((mapping) => {
      if (foundMapping === true) {
        return;
      }

      // find the interval in where 79 is in here
      const isInRange = isNumberInRange(
        newNumber,
        mapping.source,
        mapping.source + mapping.range - 1,
      );

      if (isInRange) {
        // console.log(mapping);
        // use differentiator for this mapping
        const differentiator = mapper(mapping);

        // console.log(`${elf.name}`);
        // console.log(mapping);
        newNumber += differentiator;
        foundMapping = true;
      }
    });

    // if no mapping was found, return the number
    return newNumber;
  });

  // console.log(x);
  return x[x.length - 1];
}

// we cannot create the actual maps, because they would be way too big
// we instead need to compute them
function mapper(params: MappingParams): number {
  const { source, dest, range } = params;
  /* we need to deduce a differentiator value for each range
   * 50 98 2
   * means that [50, 51] <- [98, 99]
   * seed 99 maps to soil 51
   * their differentiator is: 51 - 99 = -48
   * given a source x in this range, the dest will be x-48
   *
   *
   * example 2
   * 52 50 48
   * means that [52, 99] <- [50, 97]
   * seed 50 maps to soil 52
   * their differentiator is 52 - 50 = 2
   * given a source x in this range, the dest will be x+2
   */
  const source_tuple = [source, source - 1 + range];
  const dest_tuple = [dest, dest - 1 + range];

  // extract differentiator, given the source and dest tuple
  return findDifferentiator(source_tuple, dest_tuple);
}

export function parseStringToMapper(s: string): MappingParams {
  const values = s.split(" ").map((x) => Number(x));
  return {
    dest: values[0],
    source: values[1],
    range: values[2],
  };
}

// const params = parseStringToMapper("50 98 2");
// const deduced_map = mapper(params);
