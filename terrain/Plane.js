
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

    function calcNormalPerTriangle(a, b, c) {
        var ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
        var bc = [c[0] - b[0], c[1] - b[1], c[2] - b[2]];

        /**var dot = ac[0]*bc[0] + ac[1]*bc[1] + ac[2]*bc[2];
        var acLen = Math.sqrt(Math.pow(ac[0], 2) + Math.pow(ac[1], 2) + Math.pow(ac[2], 2));
        var bcLen = Math.sqrt(Math.pow(bc[0], 2) + Math.pow(bc[1], 2) + Math.pow(bc[2], 2));
        var phi = Math.acos(dot / (acLen * bcLen));*/
        var cross = [
            ac[1]*bc[2] - bc[1]*ac[2],
            ac[2]*bc[0] - ac[0]*bc[2],
            ac[0]*bc[1] - ac[1]*bc[0]
        ];

        return cross;
    }

    function defineNormals(gl, size, simplex) {
        var normals = [];
        var noiseValues = createNoiseValues(size, simplex);

        for (var i  = 0; i < size-1; i++) {
            for (var j = 0; j < size - 1; j++) {
                var v1 = [j, i, noiseValues[j][i]];
                var v2 = [j+1, i, noiseValues[j+1][i]];
                var v3 = [j, i + 1, noiseValues[j][i+1]];
                var n = calcNormalPerTriangle(v1, v2, v3);
                normals.push(n[0], n[1], n[2]);
                normals.push(n[0], n[1], n[2]);
                normals.push(n[0], n[1], n[2]);
                normals.push(n[0], n[1], n[2]);
            }
        }

        console.log("num normals: " + normals.length);

        var normalsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        return normalsBuffer;
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
        bufferNormals: defineNormals(gl, size, simplex),
        bufferTriangles: defineTriangles(gl, size),
        bufferColors: defineColors(gl, size),
        vertexCount: (size) * (size) * 6,
        draw: function (gl, aVertexPositionId, aVertexNormalId, aVertexColorId) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
            gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexPositionId);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferColors);
            gl.vertexAttribPointer(aVertexColorId, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexColorId);
            //gl.disableVertexAttribArray(aVertexColorId);
            //gl.vertexAttrib3f(aVertexColorId, 1,1, 1);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferNormals);
            gl.vertexAttribPointer(aVertexNormalId, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexNormalId);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferTriangles);
            gl.drawElements(gl.TRIANGLES, this.vertexCount, gl.UNSIGNED_SHORT, 0);
        }
    }
}