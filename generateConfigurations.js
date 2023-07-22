import { arrayEquals } from "./universal.js";
import { generateSM } from "./generateSV.js";
import { generatePM } from "./generatePM.js";
import { GPUMatrixMul } from "./gputest.js";

// Hard-coded Spiking Matrix
let S_debug = [
  [1, 0, 1, 0],
  [0, 1, 1, 0],
];

function addMatrix(A, B) {
  let C = [];
  for (let i = 0; i < A.length; i++) {
    C.push([]);
    for (let j = 0; j < A[i].length; j++) {
      C[i].push(A[i][j] + B[i][j]);
    }
  }
  return C;
}

function multiplyMatrix(A, B) {
  let C = [];
  for (let i = 0; i < A.length; i++) {
    C.push([]);
    for (let j = 0; j < B[0].length; j++) {
      C[i].push(0);
      for (let k = 0; k < B.length; k++) {
        C[i][j] = C[i][j] + A[i][k] * B[k][j];
      }
    }
  }
  return C;
}

function checkActiveVars(S, F) {
  // console.log("CHECK ACTIVE VARS: \nS: ", S, "\nF: ", F, "\n");
  let V = [];
  for (let i = 0; i < S.length; i++) {
    V.push([]);
    for (let j = 0; j < S[i].length; j++) {
      if (S[i][j] == 1) {
        // It means function j is active
        // Check for every active function which variable is active
        for (let k = 0; k < F[j].length; k++) {
          if (F[j][k] != 0) {
            if (V[i].length < k + 1) {
              V[i].push(0);
            } else {
              V[i][k] = 0;
            }
          } else {
            if (V[i].length < k + 1) {
              V[i].push(1);
            } else {
              if (V[i][k] != 0) {
                V[i][k] = 1;
              }
            }
          }
        }
      }
    }
  }

  return V;
}

// Algorithm 3: Computation Graph
// Generates configuration graph from a given initial configuration
export default function generateConfigurations(
  C,
  maxDepth,
  L,
  F,
  T,
  VL,
  syn,
  isGPU = 0
) {
  let unexploredStates = C;
  let exploredStates = [];

  let depth = 0;
  let S = [];
  let P = [];
  let finalEnvValue = 0;
  while (depth < maxDepth) {
    console.log("Current Depth: ", depth);
    console.time("Depth Time");

    let nextstates = [];
    for (let i = 0; i < unexploredStates.length; i++) {
      S = generateSM(unexploredStates[i], L, F, T);
      let PM = generatePM(unexploredStates[i], F, L, VL, syn, T);
      P = PM;

      let V = checkActiveVars(S, F, C);
      let NG = [];
      let C_next = [];
      if (isGPU == 0) {
        NG = multiplyMatrix(S, P);
        C_next = addMatrix(V, NG);
      } else {
        C_next = GPUMatrixMul(S, P, V);
      }

      for (let j = 0; j < C_next.length; j++) {
        if (!exploredStates.find((x) => arrayEquals(x, C_next[j]))) {
          nextstates.push(C_next[j]);
        }
      }
      // if unexploredStates[i] is not in exploredStates, push it to exploredStates
      let isExplored = false;
      for (let k = 0; k < exploredStates.length; k++) {
        if (arrayEquals(unexploredStates[i], exploredStates[k])) {
          isExplored = true;
          break;
        }
      }
      if (!isExplored) exploredStates.push(unexploredStates[i]);
    }
    unexploredStates = [];

    unexploredStates.push(...nextstates);
    depth++;
    console.timeEnd("Depth Time");
  }

  return { unexploredStates, S, P, finalEnvValue, exploredStates };
}
