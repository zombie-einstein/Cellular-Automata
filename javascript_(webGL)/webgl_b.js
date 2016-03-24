'use strict';

var mainCanvas = new WEBGLCANVAS( "canvas" );

mainCanvas.dimensions.x = window.innerWidth-document.getElementById("menus").offsetWidth;
mainCanvas.dimensions.y = window.innerHeight;

mainCanvas.initWebGL();

mainCanvas.addProgram( display, "2d-vertex-shader", "2d-fragment-display" );
mainCanvas.addProgram( rules  , "2d-vertex-shader", "2d-fragment-rules"   );

// Add color shift location to display (to get correct live cell color)
mainCanvas.programs.display.addUniform( mainCanvas.gl, colorLocation, "u_colorShift" );
// Add texture size location to rule shader
mainCanvas.programs.rules.addUniform( mainCanvas.gl, textureSizeLocation, "u_textureSize" );
// Add ruleset texture location to rule shader
mainCanvas.programs.rules.addUniform( mainCanvas.gl, ruleSizeLocation, "u_ruleSize" );
// Get texture locations
mainCanvas.programs.rules.addUniform( mainCanvas.gl, backText0Location, "u_backText;" );
mainCanvas.programs.rules.addUniform( mainCanvas.gl, ruleText1Location, "u_rulesText" );
// Add neighbour array location to rule program
mainCanvas.programs.rules.neighbours = [];
for ( var i = 0; i < 8; i++ ){
  mainCanvas.programs.rules.neighbours[i] = mainCanvas.gl.getUniformLocation( mainCanvas.programs.rules.program, "neighbours["+i.toString()+"]");
}

console.log("Neigbours added");
