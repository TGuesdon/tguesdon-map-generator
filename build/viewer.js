"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generator_1 = require("./generator");
// const island: Island = generate(10,10);
const island = (0, generator_1.generateWCFIsland)(10, 10, 0.2, [0, 1]);
island.points.forEach(points => {
    let row = "";
    points.forEach(point => {
        row += " | " + point.elevation + " | ";
    });
    console.log(row);
});
