import { createNoise2D } from 'simplex-noise';

export class Island {
    public points: Point[][];

    constructor(cellWidth: number, cellHeight: number, width: number, height: number){
        this.points = [];
            for(let y = 0; y < height; y++){

            this.points[y] = [];
                    for(let x = 0; x < width; x++){

                this.points[y][x] = {x: x * cellWidth, y: y * cellHeight, elevation: -1};
            }
        }
    }
}

export type Point = {
    x: number;
    y: number;
    elevation: number;
}

/**
 * 
 * @param width 
 * @param height
 * @param intensity ratio which multiply noise
 * @param attenuation_type {"gate" | "sin"} function used to transform noise into an island. sin will make smoother island but they will all look circle. gate do a better job at keeping the randomness of the noise, but it can create some weird coast.
 * @returns a {width} * {height} matrices with island elevation. x, y & elevation in [0,1] * intensity
 */
export function generate(width: number, height: number, intensity: number = 1, attenuation_type: "gate" | "sin" = "sin"): Island {
    const cellWidth = 1 / width;
    const cellHeight = 1 / height;

    const island = new Island(cellWidth, cellHeight, width, height);
    
    applyNoise(island, intensity);

    attenuation_type === "sin" ? applyAttenuation(island) : applyGate(island);

    return island;
}

function applyNoise(island: Island, intensity: number = 1) {
    const noise2D = createNoise2D();
    for(let x = 0; x < island.points.length; x++){
        for(let y = 0; y < island.points[x].length; y++){
            island.points[y][x].elevation = ((1 + noise2D(y,x)) / 2) * intensity;
        }
    }
}

export function applyAttenuation(island: Island){
    for(let x = 0; x < island.points.length; x++){
        for(let y = 0; y < island.points[x].length; y++){
            const xNorm = x / island.points.length * Math.PI;
            const yNorm = y / island.points[x].length * Math.PI;

            island.points[y][x].elevation *= (Math.sin(xNorm) * Math.sin(yNorm));
        }
    }
}

function applyGate(island: Island){
    for(let x = 0; x < island.points.length; x++){
        for(let y = 0; y < island.points[x].length; y++){
            
            const water = x < 2 || y < 2 || x > island.points.length - 3 || y > island.points[y].length - 3;

            island.points[y][x].elevation = water ? 0 : island.points[y][x].elevation;
        }
    }
}

type WCFPoint = {
    elevation: number;
    possibleElevation: number[];
    index: number;
}

class WCFIsland{

    points: WCFPoint[];

    constructor(public width: number, public height: number, possibleElevation: number[]){
        this.points = [];
        for(let y = 0; y < height; y++){
            for(let x = 0; x < width; x++){
                // Change array to alter probability
                this.points.push({elevation:-1, possibleElevation: possibleElevation, index: y * width + x});
            }
        }
    }

}

function observe(island: WCFIsland, index: number, width: number, elevation: number, allowedStep: number){
    island.points[index].elevation = elevation;
    island.points[index].possibleElevation = [];

    const top = island.points[index - width];
    const bottom = island.points[index + width];
    const right = island.points[index - 1];
    const left = island.points[index + 1];

    if( top ) top.possibleElevation = top.possibleElevation.filter((value) => !(Math.abs(elevation - value) > allowedStep));
    if( bottom ) bottom.possibleElevation = bottom.possibleElevation.filter((value) => !(Math.abs(elevation - value) > allowedStep));
    if( right ) right.possibleElevation = right.possibleElevation.filter((value) => !(Math.abs(elevation - value) > allowedStep));
    if( left ) left.possibleElevation = left.possibleElevation.filter((value) => !(Math.abs(elevation - value) > allowedStep));

}

function initEdge(island: WCFIsland, width: number, height: number, allowedStep: number){
    for(let y = 0; y < height; y++){
        for(let x = 0; x < width; x++){
            if(x === 0 || x === width - 1 || y === 0 || y === height - 1){
                observe(island, y * width + x, width, 0, allowedStep);
            }
        }
    }
}

function waveCollapseIsland(width: number, height: number, allowedStep: number, possibleElevation: number[]): WCFIsland{

    const island = new WCFIsland(width, height, possibleElevation);

    initEdge(island, width, height, allowedStep);

    let count = 0;
    const max = (width - 2) * (height - 2);

    while(count < max){

        const min: WCFPoint = island.points.filter((p) => p.elevation === -1).reduce((a, b) => a.possibleElevation.length < b.possibleElevation.length ? a : b);
        observe(island, min.index, width, min.possibleElevation[Math.floor(Math.random() * min.possibleElevation.length)], allowedStep);
        count ++;
    }

    return island;
}

function toIsland(island: WCFIsland): Island{
    const cellWidth = 1 / island.width;
    const cellHeight = 1 / island.height;

    const res = new Island(cellWidth, cellHeight, island.width, island.height);

    for(let y = 0; y < island.height; y++){
        for(let x = 0; x < island.width; x++){
            res.points[y][x].elevation = island.points[y * island.width + x].elevation;
        }
    }

    return res;
}

/**
 * 
 * @param width 
 * @param height
 * @param allowedStep step allowed between two tiles, must be in [0, 1]. 
 * @param possibleElevation list of possible elevation for points. Default to [0, 0.2, 0.4, 0.6, 0.8, 1.0]. You can put multiple times one elevation to make it happens more. I would advice to stay in [0, 1].
 * @returns a {width} * {height} matrices with island elevation. x, y & elevation in [0,1]
 */
export function generateWCFIsland(width: number, height: number, allowedStep: number, possibleElevation = [0, 0.2, 0.4, 0.6, 0.8, 1.0]): Island{
    const island = waveCollapseIsland(width, height, allowedStep, possibleElevation);
    return toIsland(island);
}