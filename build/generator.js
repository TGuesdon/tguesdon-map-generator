"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWCFIsland = exports.generate = exports.Island = void 0;
const simplex_noise_1 = require("simplex-noise");
class Island {
    constructor(cellWidth, cellHeight, width, height) {
        this.points = [];
        for (let y = 0; y < height; y++) {
            this.points[y] = [];
            for (let x = 0; x < width; x++) {
                this.points[y][x] = { x: x * cellWidth, y: y * cellHeight, elevation: -1 };
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
            island.points[y][x].elevation = ((1 + noise2D(y, x)) / 2) * intensity;
        }
    }
}
function applyAttenuation(island) {
    for (let x = 0; x < island.points.length; x++) {
        for (let y = 0; y < island.points[x].length; y++) {
            const xNorm = x / island.points.length * Math.PI;
            const yNorm = y / island.points[x].length * Math.PI;
            island.points[y][x].elevation *= (Math.sin(xNorm) * Math.sin(yNorm));
        }
    }
}
function applyGate(island) {
    for (let x = 0; x < island.points.length; x++) {
        for (let y = 0; y < island.points[x].length; y++) {
            const water = x < 2 || y < 2 || x > island.points.length - 3 || y > island.points[y].length - 3;
            island.points[y][x].elevation = water ? 0 : island.points[y][x].elevation;
        }
    }
}
class WCFIsland {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.points = [];
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // Change array to alter probability
                this.points.push({ elevation: -1, possibleElevation: [0, 0.2, 0.2, 0.4, 0.4, 0.4, 0.6, 0.6, 0.6, 0.8, 0.8, 1.0], index: y * width + x });
            }
        }
    }
}
function observe(island, index, width, elevation) {
    island.points[index].elevation = elevation;
    island.points[index].possibleElevation = [];
    const top = island.points[index - width];
    const bottom = island.points[index + width];
    const right = island.points[index - 1];
    const left = island.points[index + 1];
    if (top)
        top.possibleElevation = top.possibleElevation.filter((value) => !(Math.abs(elevation - value) > 0.4));
    if (bottom)
        bottom.possibleElevation = bottom.possibleElevation.filter((value) => !(Math.abs(elevation - value) > 0.4));
    if (right)
        right.possibleElevation = right.possibleElevation.filter((value) => !(Math.abs(elevation - value) > 0.4));
    if (left)
        left.possibleElevation = left.possibleElevation.filter((value) => !(Math.abs(elevation - value) > 0.4));
}
function initEdge(island, width, height) {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
                observe(island, y * width + x, width, 0);
            }
        }
    }
}
function waveCollapseIsland(width, height) {
    const island = new WCFIsland(width, height);
    initEdge(island, width, height);
    let count = 0;
    const max = (width - 2) * (height - 2);
    while (count < max) {
        const min = island.points.filter((p) => p.elevation === -1).reduce((a, b) => a.possibleElevation.length < b.possibleElevation.length ? a : b);
        observe(island, min.index, width, min.possibleElevation[Math.floor(Math.random() * min.possibleElevation.length)]);
        console.log(min.index);
        count++;
    }
    return island;
}
function toIsland(island) {
    const cellWidth = 1 / island.width;
    const cellHeight = 1 / island.height;
    const res = new Island(cellWidth, cellHeight, island.width, island.height);
    for (let y = 0; y < island.height; y++) {
        for (let x = 0; x < island.width; x++) {
            res.points[y][x].elevation = island.points[y * island.width + x].elevation;
        }
    }
    return res;
}
function generateWCFIsland(width, height) {
    const island = waveCollapseIsland(width, height);
    return toIsland(island);
}
exports.generateWCFIsland = generateWCFIsland;
