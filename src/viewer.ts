import { generate, Island, Point } from "./generator";

const island: Island = generate(10,10);

island.points.forEach(points => {
    let row = "";
    points.forEach(point => {
        row += (" | " + point.elevation);
    })
    console.log(row);
})