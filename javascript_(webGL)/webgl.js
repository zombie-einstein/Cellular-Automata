'use strict';

// ******* Simple 2D WebGL wrapper and renderer *******

// Canvas and webGl variables
var canvas;
var gl;

// Program structure
function PROGRAM(){

    this.program;
    this.positionLocation;
    this.texCoordLocation;
}

// Object containing programs
var programs = { display: new PROGRAM, rules: new PROGRAM };

// Textures object
var textures = {};

// Start OpenGl and make programs
function startGL(){

  // Get canvas from HTML
  canvas = document.getElementById("canvas");

  // Initialize the GL context
  gl = initWebGL(canvas);

  // Only continue if WebGL is available and working
  if (gl) {

    // ======== GL settings ========
  	// Set clear background color
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT );

    // ======== Initialize the shaders ========
    programs.display.program = initProgram( "2d-vertex-shader", "2d-fragment-display" );
    programs.rules.program   = initProgram( "2d-vertex-shader", "2d-fragment-rules"   );


    // ======== Lookup attributes from shaders ========

    // vertex data
    programs.display.positionLocation   = gl.getAttribLocation( programs.display.program, "a_position" );
    programs.rules.positionLocation     = gl.getAttribLocation( programs.rules.program, "a_position" );

    // texture co-ords
    programs.display.texCoordLocation   = gl.getAttribLocation( programs.display.program, "a_texCoord" );
    programs.rules.texCoordLocation     = gl.getAttribLocation( programs.rules.program, "a_texCoord" );

    // Add color shift location to display (to get correct live cell color)
    programs.display.colorLocation      = gl.getUniformLocation( programs.display.program, "u_colorShift" );

    // Add texture size location to rule shader
    programs.rules.textureSizeLocation  = gl.getUniformLocation( programs.rules.program, "u_textureSize" );

    // Add ruleset texture location to rule shader
    programs.rules.ruleSizeLocation     = gl.getUniformLocation( programs.rules.program, "u_ruleSize" );

    // Get texture locations
    programs.rules.backText0Location    = gl.getUniformLocation( programs.rules.program, "u_backText;" );
    programs.rules.ruleText1Location    = gl.getUniformLocation( programs.rules.program, "u_rulesText" );

    // Add neighbour array location to rule program
    programs.rules.neighbours = [];

    for ( var i = 0; i < 8; i++ ){

      programs.rules.neighbours[i] = gl.getUniformLocation( programs.rules.program, "neighbours["+i.toString()+"]");

    }

    console.log("WebGL initialized and programs created");

  }

  else{ alert("WebGL failed to start!"); }
}

// Fill the texture with randomly assigned cells
function loadRandomTexture( rate ){

    // Create random initial data
    var initData = new Uint8Array( textures.width*textures.height*4 ); // 4 values RGBA for each pixel

    // Run through array and set red and alpha values randomly
    for ( var i = 0; i < initData.length; i+=4 ){
      // Set red channel randomly to either 0 (dead) or 255 (alive) (can use other channels)
      if ( Math.random() < rate ){

        initData[i] = 255;
        initData[i+3] = 255;

      }
    }

    textures.front = createTexture( textures.width, textures.height, initData );

    renderAllCells();

    console.log("Texture randomly filled @P(alive)=",rate);
}

// Create textures
function createTextures( width, height ){

  textures.front = createTexture( width, height );
  textures.back  = createTexture( width, height );
  textures.width = width;
  textures.height= height;

  textures.rules = createOddTexture( currentRuleSet.dimensions.x, currentRuleSet.dimensions.y, currentRuleSet.data );
  textures.ruleWidth   = currentRuleSet.dimensions.x;
  textures.rulesHeight = currentRuleSet.dimensions.y;

  // Confirmation message
  console.log("Textures created: ", textures.width, "x", textures.height);
}

function loadRuleSet(){

  textures.rules = createOddTexture( currentRuleSet.dimensions.x, currentRuleSet.dimensions.y, currentRuleSet.data );
  textures.ruleWidth   = currentRuleSet.dimensions.x;
  textures.rulesHeight = currentRuleSet.dimensions.y;

}

// Clear all the cells to (0,0,0,0)
function killAll(){

  textures.front = createTexture( textures.width, textures.height );
  textures.back  = createTexture( textures.width, textures.height );
  renderAllCells();

}

function loadNeighbours(){

  gl.useProgram( programs.rules.program );

  gl.uniform2i( programs.rules.neighbours[0], -1, -1 );
  gl.uniform2i( programs.rules.neighbours[1], -1,  0 );
  gl.uniform2i( programs.rules.neighbours[2], -1, +1 );
  gl.uniform2i( programs.rules.neighbours[3],  0, -1 );
  gl.uniform2i( programs.rules.neighbours[4],  0, +1 );
  gl.uniform2i( programs.rules.neighbours[5], +1, -1 );
  gl.uniform2i( programs.rules.neighbours[6], +1,  0 );
  gl.uniform2i( programs.rules.neighbours[7], +1, +1 );

}

function mainLoop(){

    gl.useProgram( programs.rules.program );

    loadNeighbours();

    // ======= Create framebuffer and attach back texture ======= //

    //Create framebuffer
    var framebuffer = gl.createFramebuffer();

    // Bind framebuffer
    gl.bindFramebuffer( gl.FRAMEBUFFER, framebuffer );

    // Attach the back texture
    gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textures.back, 0 );

    // Set texture units for current ruleset
    gl.uniform1i(programs.rules.backText0Location, 0);  // texture unit 0
    gl.uniform1i(programs.rules.ruleText1Location, 1);  // texture unit 1

    // Attach ruleset texture
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textures.rules);
    gl.uniform2f( programs.rules.ruleSizeLocation, textures.ruleWidth, textures.rulesHeight );

    // Start to draw with front texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures.front);

    // Set buffer viewport
    gl.viewport( 0, 0, textures.width, textures.height );

    // Send texture size (for pixel measure)
    gl.uniform2f( programs.rules.textureSizeLocation, textures.width, textures.height );

    // Render to texture "back"
    render( programs.rules );

    // Unbind framebuffer (hence render to canvas)
    gl.bindFramebuffer( gl.FRAMEBUFFER, null );

    // Swap textures
    var temp = textures.front;
    textures.front = textures.back;
    textures.back = temp;

    // Render cells to canvas
    renderAllCells();
}

// Render to full canvas/texture
function render( program ){

    // Clear framebuffer
    gl.clear( gl.COLOR_BUFFER_BIT );
    // provide texture coordinates for the rectangle.
    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray( program.texCoordLocation );
    gl.vertexAttribPointer( program.texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // Set a rectangle the same size as the image.
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0]),
    gl.STATIC_DRAW);
    gl.enableVertexAttribArray(program.positionLocation);
    gl.vertexAttribPointer(program.positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays( gl.TRIANGLES, 0, 6 );

}

// renderAllCells
function renderAllCells(){

  gl.useProgram( programs.display.program );
  // Set color shift to achieve live cell color
  gl.uniform4f( programs.display.colorLocation, aliveColor[0], aliveColor[1] ,aliveColor[2], 0 );
  // Bind texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture( gl.TEXTURE_2D, textures.front );
  gl.viewport( 0, 0, canvas.width, canvas.height );
  render( programs.display );

}

// Create a texture at set height and width
// Insert data if required, otherwise null
function createTexture( w, h, data ){
  // Create temporary texture
  var tempTexture = gl.createTexture();
  // Bind this current texture
  gl.bindTexture( gl.TEXTURE_2D, tempTexture );
  // If no input data specified set to null
  if ( !data ){ data = null; };
  // Set texture size as desired (i.e. No of cells)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
  // gl.NEAREST ensures no interpolation between pixels!
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  // Clear binding
  gl.bindTexture( gl.TEXTURE_2D, null );
  // return texture
  return tempTexture;
}

// Create a texture at set height and width ( non-power of 2! )
// Insert data if required, otherwise null
function createOddTexture( w, h, data ){
  // Create temporary texture
  var tempTexture = gl.createTexture();
  // Bind this current texture
  gl.bindTexture( gl.TEXTURE_2D, tempTexture );
  // If no input data specified set to null
  if ( !data ){ data = null; };
  // Set texture size as desired (i.e. No of cells)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
  // gl.NEAREST ensures no interpolation between pixels!
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  // Clear binding
  gl.bindTexture( gl.TEXTURE_2D, null );
  // return texture
  return tempTexture;
}


// Sets the RGB value of a single cell located at (x,y)
function changePixelState( x, y, value ){
  var v = value * 255;
  gl.bindTexture( gl.TEXTURE_2D, textures.front );
  gl.texSubImage2D( gl.TEXTURE_2D, 0, x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE,  new Uint8Array([v, 0, 0, v]) );
  gl.bindTexture( gl.TEXTURE_2D, null );
}

// Switch the R value of a single cell located at (x,y)
function switchPixelState( x, y ){

    // Get pixel value from texture
    var framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer( gl.FRAMEBUFFER, framebuffer );
    gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textures.front, 0);
    var pixelRGBA = new Uint8Array(4);
    gl.readPixels( x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelRGBA );
    gl.bindFramebuffer( gl.FRAMEBUFFER, null );
    pixelRGBA[0] > 0 ? changePixelState(x,y,0) : changePixelState(x,y,1);
    //Below outputs the texture pixel color
    //console.log(pixelRGBA[0],",",pixelRGBA[1],",",pixelRGBA[2],",",pixelRGBA[3]);

}

// Fills the buffer with the values that define a rectangle.
function setRectangle( x, y, w, h ) {
  var x1 = x;
  var x2 = x + w;
  var y1 = y;
  var y2 = y + h;
  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2 ]), gl.STATIC_DRAW);
}

// Initialize WebGL, return alert if initialization fails

function initWebGL( canvas ){


  gl = null;

  try {
    // Try to grab the standard context. If it fails, fallback to experimental.
    gl = canvas.getContext("webgl", { premultipliedAlpha: false }) || canvas.getContext("experimental-webgl");
  }
  catch(e) {}

  // If we don't have a GL context, give up now
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
    gl = null;
  }

  return gl;

}


// Initialize shaders & return program
function initProgram( vertex, fragment ) {


  var fragmentShader  = getShader( gl, fragment );
  var vertexShader    = getShader( gl, vertex   );

  // Create the shader program
  var program  = gl.createProgram();

  // Attach shaders to program
  gl.attachShader( program, vertexShader );
  gl.attachShader( program, fragmentShader );
  gl.linkProgram( program );

  // If creating the shader program failed, alert
  if ( !gl.getProgramParameter( program, gl.LINK_STATUS ) ) {
    alert("Unable to initialize the shader program.");
  }

  return program;

}

// Loads a shader program by scouring the current document,
// looking for a script with the specified ID.
function getShader(gl, id) {
  var shaderScript = document.getElementById(id);

  // Didn't find an element with the specified ID; abort.

  if (!shaderScript) {
    return null;
  }

  // Walk through the source element's children, building the
  // shader source string.
  var theSource = "";
  var currentChild = shaderScript.firstChild;

  while(currentChild) {
    if (currentChild.nodeType == 3) {
      theSource += currentChild.textContent;
    }
    currentChild = currentChild.nextSibling;
  }

  // Now figure out what type of shader script we have,
  // based on its MIME type.
  var shader;

  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;  // Unknown shader type
  }

  // Send the source to the shader object
  gl.shaderSource(shader, theSource);

  // Compile the shader program
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}
