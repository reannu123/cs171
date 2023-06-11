// Checks for configuration C if function i from F has a threshold T that is met
export function checkThreshold(C, i, T, F) {
  // Check if i is in Threshold functions
  for (let j = 0; j < T.length; j++) {
    if (T[j][0] == i + 1) {
      // Check if the threshold is met
      // To check threshold, we need to check the value of T[j][1]. This is the value of the threshold. The function matrix row to be checked is T[j][0].
      // Then, we check for any non-zero values in the function matrix row. and store it in a list.
      // Then the list is checked against the configuration matrix. The value of the configuration matrix element should be higher than T[j][0].
      let nonZero = [];
      for (let k = 0; k < F[i].length; k++) {
        if (F[i][k] != 0) {
          nonZero.push(k);
        }
      }

      for (let k = 0; k < nonZero.length; k++) {
        if (C[nonZero[k]] < T[j][1]) {
          return false;
        }
      }
      return true;
    }
  }
  return true;
}

export function arrayEquals(a, b) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}
