// const { GPU } = require("gpu.js");
import { GPU } from "gpu.js";
import generateConfigurations from "./nsnp-gpu/src/SimAlgs/generateConfigurations.js";

let SIZE = 2048;

// Generate two random matrices of size 1024x1024
export const generateMatrices = () => {
  const matrices = [[], []];
  for (let y = 0; y < SIZE; y++) {
    matrices[0].push([]);
    matrices[1].push([]);
    for (let x = 0; x < SIZE; x++) {
      matrices[0][y].push(Math.floor(Math.random() * 10));
      matrices[1][y].push(Math.floor(Math.random() * 10));
    }
  }
  return matrices;
};

const gpu = new GPU();

// GPU implementation
export function GPUMatrixMul(a, b) {
  // Create the GPU accelerated function from a kernel
  let aLength = a.length;
  let bLength = b[0].length;

  const multiplyMatrixGPU = gpu
    .createKernel(function (a, b) {
      let sum = 0;
      for (let i = 0; i < this.constants.bLength; i++) {
        sum += a[this.thread.y][i] * b[i][this.thread.x];
      }
      return sum;
    })
    .setConstants({ aLength, bLength })
    .setOutput([bLength, aLength]);

  let out = multiplyMatrixGPU(a, b);
  // convert to a 2D array
  out = out.map((row) => Array.from(row));

  // console.log(out);
  return out;
}

// CPU implementation
export const multiplyMatrixCPU = (a, b) => {
  const out = [];
  for (let y = 0; y < a.length; y++) {
    out.push([]);
    for (let x = 0; x < b[0].length; x++) {
      let sum = 0;
      for (let i = 0; i < b.length; i++) {
        sum += a[y][i] * b[i][x];
      }
      out[y].push(sum);
    }
  }
  return out;
};

// const matrices = generateMatrices();

// console.time("GPU");
// const out = multiplyMatrixGPU(matrices[0], matrices[1]);
// console.timeEnd("GPU");
// console.log(out[10][12]);

// console.time("CPU");
// const out2 = multiplyMatrixCPU(matrices[0], matrices[1]);
// console.timeEnd("CPU");
// console.log(out2[10][12]);
