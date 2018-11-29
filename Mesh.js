
function Mesh(gl, simplex, size) {

    function defineVertices(gl, simplex, size) {
        var vertices = [];
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                var v = simplex.noise(i, j, 3, 2.0, 0.02);
                console.log(v);
                vertices.push(i, j, v);
            }
        }

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return buffer;
    }

    function defineTriangles(gl, size) {
        var triangles = [];
        var a, b, c;

        var i = 0;
        var upperBound = size -1;
        for (var j = 0; j < (size -1); j++) {
            for (; i < upperBound; i++) {
                a = i;
                b = i + 1;
                c = b + size;
                triangles.push(a, b, c);
            }
            i += 1;
            upperBound += size;
        }

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangles), gl.STATIC_DRAW);
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
        bufferTriangles: defineTriangles(gl, size),
        bufferLines: defineLines(gl, size),
        size: size,
        draw: function (gl, aVertexPositionId) {
            gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexPositionId);
            //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferTriangles);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferLines);
            var numTriangles = (this.size-1) * (this.size-1) * 6;
            //gl.drawElements(gl.TRIANGLES, numTriangles, gl.UNSIGNED_SHORT, 0);
            gl.drawElements(gl.LINES, numTriangles, gl.UNSIGNED_SHORT, 0);
        }
    }
}