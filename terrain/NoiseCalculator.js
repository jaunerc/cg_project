
function NoiseCalculator() {
    
    function prepareSimplex() {
        return new SimplexNoise();
    }
    
    return {
        simplex: prepareSimplex(),
        noise: function (x, y, octaves, roughness, scale) {
            var noise = 0.0;
            var layerFrequency = scale;
            var layerWeight = 1.0;

            for (var i = 0; i < octaves; i++) {
                noise += this.simplex.noise2D(x * layerFrequency, y * layerFrequency);
                layerFrequency *= 2;
                layerWeight *= roughness;
            }

            return noise;
        }
    }
}