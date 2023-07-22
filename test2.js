// Configuration Matrix
export let C = [[1, 1, 1, 0, 0, 2]];

// Variable Location
export let VL = [1, 1, 2, 3, 4, 5];

// Function Matrix
export let F = [
  [0.5, 0.5, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0],
  [0, 0, -1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, -1, 0],
  [0, 0, 0, 0, 0, 0.5],
];

// Function Location Matrix
export let L = [
  [1, 0, 0, 0, 0],
  [0, 1, 0, 0, 0],
  [0, 1, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 1, 0],
  [0, 0, 0, 0, 1],
];

// Threshold list
export let T = [[1, 1]];

// Synapse list
export let syn = [
  [1, 2],
  [2, 1],
  [1, 3],
  [2, 4],
  [3, 5],
  [4, 5],
];
