
function NoiseCalculator(seed, octaves, scale) {
    
    function prepareSimplex(seed) {
        return new SimplexNoise(seed);
    }
    
    return {
        simplex: prepareSimplex(seed),
        octaves: octaves,
        scale: scale,
        noise: function (x, y) {
            var noise = 0.0;
            var layerFrequency = this.scale;

            for (var i = 0; i < this.octaves; i++) {
                noise += this.simplex.noise2D(x * layerFrequency, y * layerFrequency);
                layerFrequency *= 2;
            }

            return noise;
        }
    }
}