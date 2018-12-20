
function Mesh(gl, simplex, size) {

    function makeNoise(x, z) {
        return simplex.noise(x, z, 3, 2.0, 0.02);
    }

    function defineVertices(gl, simplex, size) {
        var vertices = [];
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                var v = makeNoise(j, i);
                vertices.push(i, v, j);
            }
        }

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return buffer;
    }

    function defineLines(gl, size) {
        var lines = [];
        var a, b;

        var j = 0;
        var upperBound = size -1;
        for (var i = 0; i < (size -1); i++) {
            for (; j < upperBound; j++) {
                a = j;
                b = j+1;
                lines.push(a, b);
                b = j + size;
                lines.push(a, b);
                a = j+1;
                lines.push(a, b);
            }
            j += 1;
            upperBound += size;
        }

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(lines), gl.STATIC_DRAW);
        return buffer;
    }

    return {
        bufferVertices: defineVertices(gl, simplex, size),
        bufferLines: defineLines(gl, size),
        size: size,
        drawMesh: function (gl, aVertexPositionId, aVertexColorId) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
            gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexPositionId);

            // sets just one color for all lines
            gl.disableVertexAttribArray(aVertexColorId);
            gl.vertexAttrib3f(aVertexColorId, 1,1, 1);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferLines);
            var numLines = (this.size-1) * (this.size-1) * 6;
            gl.drawElements(gl.LINES, numLines, gl.UNSIGNED_SHORT, 0);
        }
    }
}