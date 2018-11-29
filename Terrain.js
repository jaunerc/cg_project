//
// Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
    shaderProgram: -1,
    aVertexPosition: -1,
    uColorId: -1
};

var terrain = {
    mesh: null
};

/**
 * Basic vectors for the scene (camera settings and light)
 */
var scene = {
    eyePosition: [0, 9, 0],
    lookAtCenter: [6, 0, -1],
    lookAtUp: [0, 0, 5],
    lightPosition: [1, 1, 1],
    lightColor: [1, 1, 1]
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    draw();
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributesAndUniforms();
    prepareTerrain();
    gl.clearColor(0, 0, 0, 1);
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms() {
    // finds the index of the variables in the program
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.uColorId = gl.getUniformLocation(ctx.shaderProgram, "uColor");
    ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMat");
    ctx.aVertexTextureCoordId = gl.getAttribLocation(ctx.shaderProgram, "aVertexTextureCoord");
    ctx.uModelMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelMat");
}

/**
 * Prepares the terrain. Initializes a noise calculator and the mesh.
 */
function prepareTerrain() {
    var simplex = new NoiseCalculator();
    var size = 50;
    terrain.mesh = new Mesh(gl, simplex, size);
}

/**
 * Configures the projective matrix.
 */
function configureProjectiveMat() {
    var projectionMat = mat4.create();
    var screenRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
    mat4.perspective(projectionMat, glMatrix.toRadian(45), screenRatio, 1, 100);
    gl.uniformMatrix4fv(ctx.uProjectionMatId , false , projectionMat);
}

/**
 * Configures the view matrix -> camera.
 * @returns {mat4}
 */
function configureViewMatrix() {
    var viewMat = mat4.create();
    mat4.lookAt(viewMat, scene.eyePosition, scene.lookAtCenter, scene.lookAtUp);
    return viewMat;
}

/**
 * Configures the model view matrix of the terrain.
 * @param viewMat camera-view
 */
function configureModelMat(viewMat) {
    var modelMat = mat4.create();
    mat4.mul(modelMat, modelMat, viewMat);
    gl.uniformMatrix4fv(ctx.uModelMatId , false , modelMat);
}

/**
 * Draw the scene.
 */
function draw() {
    console.log("Drawing");

    // Clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0,0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    // Do the matrix operations
    configureProjectiveMat();
    var viewMat = configureViewMatrix();
    configureModelMat(viewMat);

    // Set the color
    gl.uniform4f(ctx.uColorId, 1,1,1,1);

    // drawMesh the mesh
    terrain.mesh.drawMesh(gl, ctx.aVertexPositionId);
}
