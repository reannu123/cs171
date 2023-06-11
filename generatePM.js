import { checkThreshold } from "./universal.js";
// Using the Function location L, get the location of function i
function getNeuronFromFunction(i, L) {
  for (let j = 0; j < L[i].length; j++) {
    if (L[i][j] == 1) {
      return j;
    }
  }
}

function arrayEquals(a, b) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

// Algorithm 2: Production Matrix
// consists of the effects of each function in changing of variable values
export function generatePM(C, F, L, VL, syn, T) {
  let P = [];
  for (let i = 0; i < F.length; i++) {
    P.push([]);
    for (let j = 0; j < F[i].length; j++) {
      P[i].push(0);
    }
  }

  for (let i = 0; i < F.length; i++) {
    let sum = 0;
    for (let j = 0; j < F[0].length; j++) {
      sum = sum + F[i][j] * C[j];
    }

    let m = getNeuronFromFunction(i, L) + 1;

    for (let j = 0; j < F[0].length; j++) {
      let target = [m, VL[j]];
      if (syn.find((x) => arrayEquals(x, target))) {
        if (checkThreshold(C, i, T, F)) {
          P[i][j] = sum;
        }
      }
    }
  }
  return P;
}
