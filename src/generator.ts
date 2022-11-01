import { createNoise2D } from 'simplex-noise';

export class Island {
    public points: Point[][];

    constructor(cellWidth: number, cellHeight: number, width: number, height: number){
        this.points = [];

        for(let x = 0; x < width; x++){
            this.points[x] = [];
            for(let y = 0; y < height; y++){
                this.points[x][y] = {x: x * cellWidth, y: y * cellHeight, elevation: 0.5};
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
 * @returns a {width} * {height} matrices with island elevation. x, y & elevation in [0,1]
 */
export function generate(width: number, height: number): Island {

    // Add two to let space at start and end
    const cellWidth = 1 / (width + 2);
    const cellHeight = 1 / (height + 2);

    const island = new Island(cellWidth, cellHeight, width, height);
    
    applyNoise(island, 0.5);
    applyAttenuation(island);

    return island;
}

function applyNoise(island: Island, intensity: number = 1) {
    const noise2D = createNoise2D();
    for(let x = 0; x < island.points.length; x++){
        for(let y = 0; y < island.points[x].length; y++){
            island.points[x][y].elevation += noise2D(x,y) * intensity;
        }
    }
}

function applyAttenuation(island: Island){
    for(let x = 0; x < island.points.length; x++){
        for(let y = 0; y < island.points[x].length; y++){
            const xNorm = x / island.points.length * Math.PI;
            const yNorm = y / island.points[x].length * Math.PI;

            island.points[x][y].elevation *= (Math.sin(xNorm) * Math.sin(yNorm));
        }
    }
}
