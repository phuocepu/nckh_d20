/**
 * SVD Web Worker - Runs computation in background thread
 * Prevents UI freezing
 */

// ===== SVD COMPUTATION =====
class SVDCompressor {
    constructor() {
        this.U = null;
        this.S = null;
        this.V = null;
        this.originalMatrix = null;
        this.rows = 0;
        this.cols = 0;
        this.computeTime = 0;
    }

    compute(matrix, onProgress) {
        const startTime = performance.now();

        this.originalMatrix = matrix;
        this.rows = matrix.length;
        this.cols = matrix[0].length;

        const m = this.rows;
        const n = this.cols;
        const k = Math.min(m, n);

        this.U = this.zeros(m, k);
        this.S = new Array(k).fill(0);
        this.V = this.zeros(n, k);

        let A = this.copyMatrix(matrix);

        for (let i = 0; i < k; i++) {
            // Report progress
            if (onProgress && i % 10 === 0) {
                onProgress(i / k * 100);
            }

            const result = this.powerIteration(A, 50); // Reduced iterations for speed

            this.S[i] = result.sigma;

            for (let j = 0; j < m; j++) {
                this.U[j][i] = result.u[j];
            }
            for (let j = 0; j < n; j++) {
                this.V[j][i] = result.v[j];
            }

            if (result.sigma > 1e-10) {
                for (let row = 0; row < m; row++) {
                    for (let col = 0; col < n; col++) {
                        A[row][col] -= result.sigma * result.u[row] * result.v[col];
                    }
                }
            } else {
                break;
            }
        }

        this.computeTime = (performance.now() - startTime) / 1000;

        return {
            U: this.U,
            S: this.S,
            V: this.V,
            rows: this.rows,
            cols: this.cols,
            time: this.computeTime
        };
    }

    powerIteration(A, maxIter) {
        const m = A.length;
        const n = A[0].length;

        let v = new Array(n);
        for (let i = 0; i < n; i++) {
            v[i] = Math.random() - 0.5;
        }
        v = this.normalize(v);

        let u = new Array(m).fill(0);
        let sigma = 0;

        for (let iter = 0; iter < maxIter; iter++) {
            u = this.matVecMult(A, v);
            sigma = this.norm(u);
            if (sigma < 1e-10) break;
            u = this.normalize(u);
            v = this.matTransposeVecMult(A, u);
            const vNorm = this.norm(v);
            if (vNorm < 1e-10) break;
            v = this.normalize(v);
        }

        return { u, v, sigma };
    }

    zeros(rows, cols) {
        return Array.from({ length: rows }, () => new Array(cols).fill(0));
    }

    copyMatrix(matrix) {
        return matrix.map(row => [...row]);
    }

    norm(vec) {
        let sum = 0;
        for (let i = 0; i < vec.length; i++) {
            sum += vec[i] * vec[i];
        }
        return Math.sqrt(sum);
    }

    normalize(vec) {
        const n = this.norm(vec);
        if (n < 1e-10) return vec;
        return vec.map(x => x / n);
    }

    matVecMult(A, v) {
        const m = A.length;
        const n = A[0].length;
        const result = new Array(m).fill(0);
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                result[i] += A[i][j] * v[j];
            }
        }
        return result;
    }

    matTransposeVecMult(A, u) {
        const m = A.length;
        const n = A[0].length;
        const result = new Array(n).fill(0);
        for (let j = 0; j < n; j++) {
            for (let i = 0; i < m; i++) {
                result[j] += A[i][j] * u[i];
            }
        }
        return result;
    }
}

// ===== RECONSTRUCTION (runs in worker too) =====
function reconstructMatrix(U, S, V, rows, cols, k) {
    k = Math.min(k, S.length);
    const result = [];

    for (let row = 0; row < rows; row++) {
        const resultRow = new Array(cols).fill(0);
        for (let i = 0; i < k; i++) {
            if (S[i] < 1e-10) break;
            for (let col = 0; col < cols; col++) {
                resultRow[col] += S[i] * U[row][i] * V[col][i];
            }
        }
        // Clip values
        for (let col = 0; col < cols; col++) {
            resultRow[col] = Math.max(0, Math.min(255, Math.round(resultRow[col])));
        }
        result.push(resultRow);
    }

    return result;
}

// ===== MESSAGE HANDLER =====
self.onmessage = function(e) {
    const { type, data } = e.data;

    if (type === 'compute') {
        const compressor = new SVDCompressor();
        const result = compressor.compute(data.matrix, (progress) => {
            self.postMessage({ type: 'progress', progress, channel: data.channel });
        });

        self.postMessage({
            type: 'computed',
            result,
            channel: data.channel
        });
    }

    if (type === 'reconstruct') {
        const { U, S, V, rows, cols, k, channel } = data;
        const result = reconstructMatrix(U, S, V, rows, cols, k);
        self.postMessage({
            type: 'reconstructed',
            result,
            channel
        });
    }
};
