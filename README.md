# How to use

```import { generate } from "tguesdon-island-generator"```

Generate returns an 2 dimensionnal array of points with x and y position normalized in [0, 1], and elevation normalized in [0, 1].

```const island = generate(width, height, ?intensity, ?attenuation_type);```

 - width, height: number of points that must be generated.
 - itensity: (optional) number which multiply noise ( default to 1 ). Should be between 0 and 1.
 - attenuation_type: (optional) Function used to transform noise into an island. Must be "gate" or "sin" ( default to "sin" ).


Points in the center will have higher elevation than points on the outside.

This package does NOT furnish any way of rendering the island.

Here is an example of render with React Three Fiber :

![island render with react three fiber](render.PNG)