# Cellular automata based on John Conway's game of life #

Implemented using JavaScript and HTML5

===== CELLULAR AUTOMATA =====

Fundamentally cellular automata update each turn based on the state of their neighbours (these can vary based on topology). In John Conway’s "Game of Life" and other rule-sets the cells can either be alive or dead, then count the number of live neighbours and update the state of the cell based on this number. Wikipedia is an excellent start for more info.
More complicated versions can include larger number of possible states for the cells, and complex update rules.

The basic algorithm loop on this page therefore runs as:
-Generate an array of cell, and assign them a list of neighbour and initial states.
-Run through the array of cells and count the live neighbours.
-Apply the currently chosen rule-set based on this number.
-Update this state of the cells and display them.

Although it's somewhat inefficient to check every cell and have each cell run over a list of neighbours, as well as a full set of rules; this does allow for a large degree of flexibility. In particular rules and neighbourhood can be added in a very modular manner without actually changing the underlying code.

====== WebGL VERSION =======

The main page currently uses software rendering of a HTML5 canvas. Though this is easier to implement with a great deal of flexibility but it does come with a large drawback when running a large number of cells, especially live cells that need to rendered individually.

Switching to WebGL means the state of all the cells is stored on a texture. The rule-sets are applied to the cell using a shader program by the GPU as oppose to the CPU. As this is done in parallel it greatly increases the speed and number of cells that can be rendered effectively. The state of the cell is currently stored just on the red channel of the texture, this opens up the possibility of using other colour channels or possibly alpha values for complex rule sets.

See http://nullprogram.com/blog/2014/06/10/ or http://mingplusplus.com/game-of-life/ for much better explanations as I am far from a WebGL expert!

This is currently implemented for simple dead & alive states with arbitrary rule sets on a torus. There are a number of additions to be implemented:

- Non power of 2 numbers of cells. Is possible but more complex
- Non torus topologies. Also possible but again more complex as the neighbour checks are generated when the shader is created.
- Alternate neighbourhoods. Needs finalising, is half implemented.
- More complex rule sets and update methods. As the logic is applied by the shader program this could be implemented on a shader-per-rule set basis but it would be good to have a general method of applying methods externally.

====== RULE SETS =======

Rule sets can be added in "resets.js", adding them to the presets object will then mean that they show up in the presets menu (they are produce dynamically at run time).

In the non WebGL version the rules are expressed by the statements:
IF: If the cell is in a state
AND: The number of neighbours is related by an operator
THAN: To set value of neighbours
THE: The state will be
In many cases this reduces having to specify an updated state for each possible number of neighbours.

In the WebGL version the rules are expressed as arrays for each possible state, with sub-arrays for each possible number of neighbours containing the resulting RGBA values. Currently only the red channel is used. This could be greatly improved and generalised by expressing rules as some sort of matrices acting on the state, though this requires some work.

====== PRESET PATTERNS =======

Preset patterns that can be pasted over cells can be easily added into "patterns.js" in the patternArray object. Add the pattern under a pattern-type (i.e. static) and it will appear dynamically in the menu, and can be pasted onto cells. All the patterns currently contained are for "Game of Life", but their implementation is general.

====== COLOUR SCHEMES =======

Likewise colour schemes can be added via "color.js". Colours are grouped under colour-sets. New colours or while sets can be inserted by hex value here, following the template. 

======= UPDATE METHODS =======

For the non-WebGL version I have attempted to make the update methods modular like the colours and patterns. Each method has a name and description of how it works for the purposes of the HTML. It also has an initialization function called when it is selected e.g. when one-dimensional is selected it clears all the cells except the left column, and it tells the 2nd column to update next.

The actually implementation of an update method is somewhat more involved, though the main loop basically just calls the chosen update method each loop. It's my hope that using WebGL update methods and russets can be rolled into one matrix or set of vectors for multiple state. Like colours and patterns, methods added here will show up menus when added to the appropriate objects. 
