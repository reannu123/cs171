import generateConfigurations from "./generateConfigurations.js";
// import { C, L, F, T, VL, syn } from "./test1.js";

import { C, L, F, T, VL, syn } from "./test2.js";
// import { C, L, F, T, VL, syn } from "./test3.js";

console.log("C: ", C[0].length);

// Controls
let depth = 1;
for (let i = 0; i < process.argv.length; i++) {
  if (process.argv[i] == "-d") {
    depth = parseInt(process.argv[i + 1]);
  }
}
let neuronNums = Math.max(...VL);
console.log("Num of Neurons: ", neuronNums);
console.log("Depth: ", depth);

console.time("CPU");
generateConfigurations(C, depth, L, F, T, VL, syn, 0);
console.timeEnd("CPU");

console.log("");

console.time("GPU");
generateConfigurations(C, depth, L, F, T, VL, syn, 1);
console.timeEnd("GPU");
