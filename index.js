const { GPU } = require("gpu.js");
let SIZE = 1024;

// Generate two random matrices of size 1024x1024
const generateMatrices = () => {
  const matrices = [[], []];
  for (let y = 0; y < SIZE; y++) {
    matrices[0].push([]);
    matrices[1].push([]);
    for (let x = 0; x < SIZE; x++) {
      matrices[0][y].push(Math.random());
      matrices[1][y].push(Math.random());
    }
  }
  return matrices;
};

const gpu = new GPU();

// GPU implementation
const multiplyMatrixGPU = gpu
  .createKernel(function (a, b) {
    let sum = 0;
    for (let i = 0; i < 1024; i++) {
      sum += b[i][this.thread.x] * a[this.thread.y][i];
    }
    return sum;
  })
  .setOutput([1024, 1024]);

// CPU implementation
const multiplyMatrixCPU = (a, b) => {
  const out = [];
  for (let y = 0; y < SIZE; y++) {
    out.push([]);
    for (let x = 0; x < SIZE; x++) {
      let sum = 0;
      for (let i = 0; i < SIZE; i++) {
        sum += a[y][i] * b[i][x];
      }
      out[y].push(sum);
    }
  }
  return out;
};

const matrices = generateMatrices();

console.time("GPU");
const out = multiplyMatrixGPU(matrices[0], matrices[1]);
console.timeEnd("GPU");
console.log(out[10][12]); // Logs the element at the 10th row and the 12th column of the output matrix

console.time("CPU");
const out2 = multiplyMatrixCPU(matrices[0], matrices[1]);
console.timeEnd("CPU");
console.log(out2[10][12]);

// console.log(out[y][x]); // Logs the element at the xth row and the yth column of the matrix
