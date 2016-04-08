'use strict';
// **************** Vector Class **************

// Vector constructor
function vec(x,y){
	this.x = x;
	this.y = y;
}


// Vector sum function
vec.prototype.add = function (subject){
	this.x += subject.x;
	this.y += subject.y;
}

// Vector subtract function
vec.prototype.subtract = function (subject){
	this.x -= subject.x;
	this.y -= subject.y;
}

// Vector copyer without changing original object
vec.prototype.assign = function(subject){
	this.x = subject.x;
	this.y = subject.y;
}

// Scaling components by a scalar value
vec.prototype.scale = function(a){
	this.x = a*this.x;
	this.y = a*this.y;
}

// Return new sum of vectors
vec.prototype.sum = function( b ){
	return new vec( this.x + b.x, this.y + b.y );
}