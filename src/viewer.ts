import { generate, Island, Point } from "./generator";

const island: Island = generate(10,10);

island.points.forEach(points => {
    let row = "";
    points.forEach(point => {
        row += Math.floor(point.elevation * 100.0) < 50 ? " x " : " o ";
    })
    console.log(row);
})