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
    mesh: null,
    plane: null
};

/**
 * Basic vectors for the scene (camera settings and light)
 */
var scene = {
    eyePosition: [25, 55, 4],
    lookAtCenter: [25, 40, 4],
    lookAtUp: [0, 0, 5],
    lightPosition: [-5, -5, 5],
    lightColor: [1, 1, 1],
    movementSpeed: 0.2,
    rotationSpeed: 0.05
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    window.addEventListener('keyup', onKeyup, false);
    window.addEventListener('keydown', onKeydown, false);
    window.requestAnimationFrame(drawAnimated);
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
    ctx.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");
    ctx.aVertexNormalId = gl.getAttribLocation(ctx.shaderProgram, "aVertexNormal");

    ctx.uModelMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelMat");
    ctx.uNormalMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uNormalMatrix");
    ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMat");

    ctx.uEnableLightingId = gl.getUniformLocation(ctx.shaderProgram, "uEnableLighting");
    ctx.uLightPositionId = gl.getUniformLocation(ctx.shaderProgram, "uLightPosition");
    ctx.uLightColorId = gl.getUniformLocation(ctx.shaderProgram, "uLightColor");
}

/**
 * Prepares the terrain. Initializes a noise calculator and the mesh.
 */
function prepareTerrain() {
    var simplex = new NoiseCalculator();
    var size = 50;
    terrain.mesh = new Mesh(gl, simplex, size);
    terrain.plane = new Plane(gl, simplex, size);
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
function configureModelNormalMat(viewMat) {
    var modelMat = mat4.create();
    mat4.mul(modelMat, modelMat, viewMat);
    gl.uniformMatrix4fv(ctx.uModelMatId , false , modelMat);

    var normalMat = mat3.create();
    mat3.normalFromMat4(normalMat, modelMat);
    gl.uniformMatrix3fv(ctx.uNormalMatrixId, false, normalMat);
}

/**
 * Draw the scene.
 */
function draw() {
    //console.log("Drawing");

    gl.enable(gl.DEPTH_TEST);

    // Clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0,0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    // lighting
    gl.uniform1i(ctx.uEnableLightingId, 1); // switch lighting
    gl.uniform3fv(ctx.uLightPositionId, scene.lightPosition); // light position
    gl.uniform3fv(ctx.uLightColorId, scene.lightColor); // light color

    // Do the matrix operations
    configureProjectiveMat();
    var viewMat = configureViewMatrix();
    configureModelNormalMat(viewMat);

    // drawMesh the mesh
    //terrain.mesh.drawMesh(gl, ctx.aVertexPositionId, ctx.aVertexColorId);
    terrain.plane.draw(gl, ctx.aVertexPositionId, ctx.aVertexNormalId, ctx.aVertexColorId);
}

var first = true;
var lastTimeStamp = 0;
function drawAnimated(timeStamp) {
    var timeElapsed = 0;
    if (first) {
        lastTimeStamp = timeStamp;
        first = false;
    } else {
        timeElapsed = timeStamp - lastTimeStamp;
        lastTimeStamp = timeStamp;
    }
    // use the time since the last call
    // move or change objects with it
    if(key._pressed["w"]){
        scene.eyePosition[1] = scene.eyePosition[1] - scene.movementSpeed;
        scene.lookAtCenter[1] = scene.lookAtCenter[1] - scene.movementSpeed;
    }
    if (key._pressed["a"]){
        scene.eyePosition[0] = scene.eyePosition[0] + scene.movementSpeed;
        scene.lookAtCenter[0] = scene.lookAtCenter[0] + scene.movementSpeed;
    }
    if (key._pressed["s"]){
        scene.eyePosition[1] = scene.eyePosition[1] + scene.movementSpeed;
        scene.lookAtCenter[1] = scene.lookAtCenter[1] + scene.movementSpeed;
    }
    if (key._pressed["d"]){
        scene.eyePosition[0] = scene.eyePosition[0] - scene.movementSpeed;
        scene.lookAtCenter[0] = scene.lookAtCenter[0] - scene.movementSpeed;
    }
    if (key._pressed["e"]){ //turn right
        scene.lookAtCenter[0] = scene.lookAtCenter[0] + scene.rotationSpeed;
        scene.lookAtCenter[1] = scene.lookAtCenter[1] + scene.rotationSpeed;
    }
    if (key._pressed["q"]){ //turn left
        scene.lookAtCenter[0] = scene.lookAtCenter[0] - scene.rotationSpeed;
        scene.lookAtCenter[1] = scene.lookAtCenter[1] - scene.rotationSpeed;
    }
    if (key._pressed[","]){ //up
        scene.eyePosition[2] = scene.eyePosition[2] + scene.movementSpeed;
        scene.lookAtCenter[2] = scene.lookAtCenter[2] + scene.movementSpeed;
    }
    if (key._pressed["."]){ //down
        scene.eyePosition[2] = scene.eyePosition[2] - scene.movementSpeed;
        scene.lookAtCenter[2] = scene.lookAtCenter[2] - scene.movementSpeed;
    }

    draw();
    // request the next frame
    window.requestAnimationFrame (drawAnimated);
}

var key = {
    _pressed: {}
};

function onKeydown(event) {
    key._pressed[event.key] = true;
    if (key._pressed["1"]){
        console.log("eyePosition: "+scene.eyePosition);
    } else if (key._pressed["2"]){
        console.log("lookAtCenter: "+scene.lookAtCenter);
    }
}

function onKeyup(event) {
    delete key._pressed[event.key];
}
