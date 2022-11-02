"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = exports.Island = void 0;
const simplex_noise_1 = require("simplex-noise");
class Island {
    constructor(cellWidth, cellHeight, width, height) {
        this.points = [];
        for (let x = 0; x < width; x++) {
            this.points[x] = [];
            for (let y = 0; y < height; y++) {
                this.points[x][y] = { x: x * cellWidth, y: y * cellHeight, elevation: 0 };
            }
        }
    }
}
exports.Island = Island;
/**
 *
 * @param width
 * @param height
 * @param intensity ratio which multiply noise
 * @param attenuation_type {"gate" | "sin"} function used to transform noise into an island. sin will make smoother island but they will all look circle. gate do a better job at keeping the randomness of the noise, but it can create some weird coast.
 * @returns a {width} * {height} matrices with island elevation. x, y & elevation in [0,1] * intensity
 */
function generate(width, height, intensity = 1, attenuation_type = "sin") {
    // Add two to let space at start and end
    const cellWidth = 1 / width;
    const cellHeight = 1 / height;
    const island = new Island(cellWidth, cellHeight, width, height);
    applyNoise(island, intensity);
    attenuation_type === "sin" ? applyAttenuation(island) : applyGate(island);
    return island;
}
exports.generate = generate;
function applyNoise(island, intensity = 1) {
    const noise2D = (0, simplex_noise_1.createNoise2D)();
    for (let x = 0; x < island.points.length; x++) {
        for (let y = 0; y < island.points[x].length; y++) {
            island.points[x][y].elevation += ((1 + noise2D(x, y)) / 2) * intensity;
        }
    }
}
function applyAttenuation(island) {
    for (let x = 0; x < island.points.length; x++) {
        for (let y = 0; y < island.points[x].length; y++) {
            const xNorm = x / island.points.length * Math.PI;
            const yNorm = y / island.points[x].length * Math.PI;
            island.points[x][y].elevation *= (Math.sin(xNorm) * Math.sin(yNorm));
        }
    }
}
function applyGate(island) {
    for (let x = 0; x < island.points.length; x++) {
        for (let y = 0; y < island.points[x].length; y++) {
            const water = x < 2 || y < 2 || x > island.points.length - 3 || y > island.points[x].length - 3;
            island.points[x][y].elevation = water ? 0 : island.points[x][y].elevation;
        }
    }
}
