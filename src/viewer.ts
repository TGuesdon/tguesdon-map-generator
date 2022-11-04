import { generate, generateWCFIsland, Island, Point } from "./generator";

// const island: Island = generate(10,10);
const island: Island = generateWCFIsland(10,10, 0.2, [0,1]);

island.points.forEach(points => {
    let row = "";
    points.forEach(point => {
        row += " | " + point.elevation + " | ";
    })
    console.log(row);
})