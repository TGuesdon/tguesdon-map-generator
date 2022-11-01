# How to use

```import { generate } from "tguesdon-island-generator"```

Generate returns an 2 dimensionnal array of points with x and y position normalized in [0, 1], and elevation normalized in [0, 1] * intensity.

```const island = generate(width, height, intensity);```

Points in the center will have higher elevation than points on the outside.

This package does NOT furnish any way of rendering the island.

Here is an example of render with React Three Fiber :

![island render with react three fiber](render.PNG)