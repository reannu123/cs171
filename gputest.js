// const { GPU } = require("gpu.js");
import { GPU } from "gpu.js";

const gpu = new GPU();

// GPU implementation
export function GPUMatrixMul(a, b) {
  // Create the GPU accelerated function from a kernel
  let matSizeI = a.length;
  let matSizeJ = a[0].length;
  let matSizeK = b[0].length;
  if (matSizeJ != b.length) {
    throw new Error("Matrix multiplication error: matrix size mismatch");
  }

  const multiplyMatrixGPU = gpu
    .createKernel(function (a, b) {
      let sum = 0;
      for (let i = 0; i < this.constants.matSizeJ; i++) {
        sum += a[this.thread.y][i] * b[i][this.thread.x];
      }
      return sum;
    })
    .setConstants({ matSizeI, matSizeJ, matSizeK })
    .setOutput([matSizeK, matSizeI]);

  let out = multiplyMatrixGPU(a, b);
  // convert to a 2D array
  out = out.map((row) => Array.from(row));

  // console.log(out);
  return out;
}
