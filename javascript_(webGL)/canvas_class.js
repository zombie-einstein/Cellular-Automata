'use strict';

// ====== General WebGL program class ====== //
function PROGRAM(){

  this.program;           // Actual shader program
  this.positionLocation;  // Location of position attribute
  this.texCoordLocation;  // Location of texture co-ordinate attribute

}

PROGRAM.prototype.initialize = function( gl, vertex, fragment ){

  this.program = initProgram( gl, vertex, fragment );                         // Get shader program from HTML
  this.positionLocation = gl.getAttribLocation( this.program, "a_position" ); // Set location for position attribute
  this.texCoordLocation = gl.getAttribLocation( this.program, "a_texCoord" ); // Set location for texture coordinates

  console.log("Program created");
}

PROGRAM.prototype.addUniform = function( gl, newUniform, location ){

  this[newUniform] = gl.getUniformLocation( this.program, location );
  console.log(newUniform+" added");
}

PROGRAM.prototype.render = function( gl ){

  // Clear framebuffer
  gl.clear( gl.COLOR_BUFFER_BIT );
  // provide texture coordinates for the rectangle.
  var texCoordBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, texCoordBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( [ 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0] ), gl.STATIC_DRAW );
  gl.enableVertexAttribArray( this.texCoordLocation );
  gl.vertexAttribPointer( this.texCoordLocation, 2, gl.FLOAT, false, 0, 0 );

  // Set a rectangle the same size as the image.
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( [ -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0] ), gl.STATIC_DRAW );
  gl.enableVertexAttribArray( this.positionLocation );
  gl.vertexAttribPointer( this.positionLocation, 2, gl.FLOAT, false, 0, 0);

  gl.drawArrays( gl.TRIANGLES, 0, 6 );

}

// ====== General texture class ====== //
function TEXTURE(){

  this.data;
  this.dimensions = new vec(0,0);

}

TEXTURE.prototype.loadR = function( gl, w, h, data ){

  this.data = gl.createTexture(); // Create texture
  this.dimensions.x = w;
  this.dimensions.y = h;
  gl.bindTexture( gl.TEXTURE_2D, this.data );
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

}

TEXTURE.prototype.clearR = function( gl ){

  this.loadR( gl, this.dimensions.x, this.dimensions.y );

}

TEXTURE.prototype.fillRandomR = function( gl, r, g, b, a, rate ){

  this.clearR( gl );
  var randomData = new Uint8Array( 4*this.dimensions.x*this.dimensions.y );

  for ( var i = 0; i < randomData.length; i+=4 ){
    if ( Math.random() < rate ){
      randomData[i]   = r;
      randomData[i+1] = g;
      randomData[i+2] = b;
      randomData[i+3] = a;
    }
  }
  this.loadR( gl, this.dimensions.x, this.dimensions.y, randomData );
  console.log("Texture randomly filled");
}

TEXTURE.prototype.loadO = function( gl, w, h, data ){

  this.data = gl.createTexture(); // Create texture
  this.dimensions.x = w;
  this.dimensions.y = h;
  gl.bindTexture( gl.TEXTURE_2D, this.data );
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

}

TEXTURE.prototype.loadOFromImage = function( gl, w, h, filename ){

  this.data = gl.createTexture();
  this.dimensions.x = w;
  this.dimensions.y = h;
  gl.bindTexture( gl.TEXTURE_2D, this.data );

  var image = new Image();
  image.onload = function(){

    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image );
    // gl.NEAREST ensures no interpolation between pixels!
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // Clear binding
    gl.bindTexture( gl.TEXTURE_2D, null );

  }
  image.src = filename;
}

TEXTURE.prototype.getPixelValue = function( gl, x, y ){

  var framebuffer = gl.createFramebuffer();
  var pixelRGBA   = new Uint8Array(4);
  gl.bindFramebuffer( gl.FRAMEBUFFER, framebuffer );
  gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.data, 0);
  gl.readPixels( x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelRGBA );
  gl.bindFramebuffer( gl.FRAMEBUFFER, null );
  return pixelRGBA;

}

TEXTURE.prototype.setPixelValue = function( gl, x, y, r, g, b, a ){

  gl.bindTexture( gl.TEXTURE_2D, this.data );
  gl.texSubImage2D( gl.TEXTURE_2D, 0, x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE,  new Uint8Array([r, g, b, a]) );
  gl.bindTexture( gl.TEXTURE_2D, null );

}

// ======== General WebGL canvas class ======== //

function WEBGLCANVAS( ID ){

  this.id         = document.getElementById(ID);       // HTML object ID
  this.dimensions = new vec;  // Canvas dimensions

  this.programs   = {};       // WebGL programs
  this.textures   = {};       // Textures

  this.gl;       // OpenGL context

}

WEBGLCANVAS.prototype.resize = function(){

  this.id.width = this.dimensions.x;
  this.id.height= this.dimensions.y;

}

WEBGLCANVAS.prototype.getMousePos = function( event ){

  var rect 		= this.id.getBoundingClientRect();
  var mousePos 	= new vec( event.clientX -rect.left, rect.bottom-event.clientY );
  return mousePos;

}

// Initialize webGL for the canvas and set clear background
WEBGLCANVAS.prototype.initWebGL = function(){

  this.gl = initWebGL( this.id );
  if( this.gl ){
    this.gl.clearColor( 0.0, 0.0, 0.0, 0.0 ); // Set canvas background transparent
    this.gl.clear( this.gl.COLOR_BUFFER_BIT );
    console.log("WebGL initialized");
  }
  else{ alert("WebGL failed to start!"); }    // Alert message if WebGL fails
}

WEBGLCANVAS.prototype.addProgram = function( newProgram, vertex, fragment ){

  this.programs[newProgram] = new PROGRAM;
  this.programs[newProgram].initialize( this.gl, vertex, fragment );
  console.log("Program "+newProgram+" loaded");

}


// ================ Initialize WebGL, return alert if initialization fails ==============
function initWebGL( canvas ){

  var gl = null;

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

// ================= Shader construction below here ================= //

// Initialize shaders & return program
function initProgram( gl, vertex, fragment ) {


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
