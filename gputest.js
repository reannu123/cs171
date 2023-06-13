// const { GPU } = require("gpu.js");
import { GPU } from "gpu.js";

const gpu = new GPU();

// GPU implementation
export function GPUMatrixMul(a, b, c) {
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

  let matSizeIAdd = c.length;
  let matSizeJAdd = c[0].length;
  const addMatrixGPU = gpu
    .createKernel(function (a, b) {
      return a[this.thread.y][this.thread.x] + b[this.thread.y][this.thread.x];
    })
    .setOutput([matSizeJAdd, matSizeIAdd]);

  const superKernel = gpu.combineKernels(
    addMatrixGPU,
    multiplyMatrixGPU,
    function (a, b, c) {
      return addMatrixGPU(multiplyMatrixGPU(a, b), c);
    }
  );

  let out = superKernel(a, b, c);
  out = out.map((row) => Array.from(row));
  return out;
}

export function GPUMatrixAdd(a, b) {
  let matSizeI = a.length;
  let matSizeJ = a[0].length;

  const addMatrixGPU = gpu
    .createKernel(function (a, b) {
      return a[this.thread.y][this.thread.x] + b[this.thread.y][this.thread.x];
    })
    .setOutput([matSizeJ, matSizeI]);

  let out = addMatrixGPU(a, b);
  out = out.map((row) => Array.from(row));
  return out;
}
