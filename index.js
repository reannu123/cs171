import generateConfigurations from "./generateConfigurations.js";

// n = number of functions
// m = number of variables
// g = number of neurons
// q = number of spiking vectors

// Configuration Matrix
let C = [[1, 1, 2]];

// Variable Location
let VL = [1, 1, 2];

// Function Matrix
let F = [
  [1, 1, 0],
  [0.5, 0.5, 0],
  [0, 0, 1],
  [0, 0, 0.5],
];

// Function Location Matrix
let L = [
  [1, 0],
  [1, 0],
  [0, 1],
  [0, 1],
];

// Threshold list
let T = [[4, 4]];

// Synapse list
let syn = [
  [1, 2],
  [2, 1],
];

// Controls
let depth = 10;

console.time("CPU");
generateConfigurations(C, depth, L, F, T, VL, syn, 0);
console.timeEnd("CPU");

console.log("");

console.time("GPU");
generateConfigurations(C, depth, L, F, T, VL, syn, 1);
console.timeEnd("GPU");
