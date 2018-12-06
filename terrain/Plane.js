
function Plane(gl, simplex, size) {

    function makeNoise(x, z, simplex) {
        return simplex.noise(x, z, 3, 2.0, 0.02);
    }

    function createNoiseValues(size, simplex) {
        var noiseValues = [];
        for (var i  = 0; i < size; i++) {
            var line = [];
            for (var j = 0; j < size; j++) {
                line.push(makeNoise(j, i, simplex));
            }
            noiseValues.push(line);
        }
        return noiseValues;
    }
    
    function defineVertices(gl, size, simplex) {
        var vertices = [];
        var noiseValues = createNoiseValues(size, simplex);
        for (var i  = 0; i < size-1; i++) {
            for (var j = 0; j < size-1; j++) {
                vertices.push(j, i, noiseValues[j][i]);
                vertices.push(j + 1, i, noiseValues[j+1][i]);
                vertices.push(j, i + 1, noiseValues[j][i+1]);
                vertices.push(j + 1, i + 1, noiseValues[j+1][i+1]);
            }
        }
        console.log("num vertices: "+vertices.length);

        var verticesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return verticesBuffer;
    }
    
    function defineTriangles(gl, size) {
        var triangles = [];
        var numTriangles = (size) * (size) * 6;

        for (var i = 0; i < numTriangles; i+=4) {
            triangles.push(i, i + 1, i + 2);
            triangles.push(i + 1, i + 2, i + 3);
        }
        console.log("num triangles: "+triangles.length);

        var trianglesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, trianglesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangles), gl.STATIC_DRAW);
        return trianglesBuffer;
    }
    
    function defineColors(gl, size) {
        var colors = [];
        var numColors = (size - 1) * (size - 1) * 12;

        for (var i = 0; i < numColors; i+=12) {
            colors.push(1, 1, 0);
            colors.push(1, 1, 0);
            colors.push(1, 1, 0);
            colors.push(1, 1, 0);

            colors.push(0, 0, 1);
            colors.push(0, 0, 1);
            colors.push(0, 0, 1);
            colors.push(0, 0, 1);
        }

        var colorsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        return colorsBuffer;
    }

    return {
        bufferVertices: defineVertices(gl, size, simplex),
        bufferTriangles: defineTriangles(gl, size),
        bufferColors: defineColors(gl, size),
        vertexCount: (size) * (size) * 6,
        draw: function (gl, aVertexPositionId, aVertexColorId) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
            gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexPositionId);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferColors);
            gl.vertexAttribPointer(aVertexColorId, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexColorId);
            //gl.disableVertexAttribArray(aVertexColorId);
            //gl.vertexAttrib3f(aVertexColorId, 1,1, 1);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferTriangles);
            gl.drawElements(gl.TRIANGLES, this.vertexCount, gl.UNSIGNED_SHORT, 0);
        }
    }
}