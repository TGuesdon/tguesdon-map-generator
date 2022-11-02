"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generator_1 = require("./generator");
const island = (0, generator_1.generate)(10, 10);
island.points.forEach(points => {
    let row = "";
    points.forEach(point => {
        row += Math.floor(point.elevation * 100.0) < 50 ? " x " : " o ";
    });
    console.log(row);
});
