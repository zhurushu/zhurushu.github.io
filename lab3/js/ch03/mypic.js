"use strict";

var gl;
var colors = [];
var vertices = [
		-0.55,0.55,
		-0.55,0.75,
	];
var n  = 2;
var size = 1.0;
var sizeLoc;
var flag = 1;
function create_circle(vertices){
	var nowx = vertices[2];
	var nowy = vertices[3];
	var x;
	var y;
	var degree = 2*Math.PI*(1/360);
	for(var i=0;i<360;i++){
		x = (nowx-vertices[0])*Math.cos(degree) - (nowy-vertices[1])*Math.sin(degree) + vertices[0];
		y = (nowx-vertices[0])*Math.sin(degree) + (nowy-vertices[1])*Math.cos(degree) + vertices[1];
		vertices.push(x,y);
		colors.push(1.0,0.0,1.0);
		nowx = x;
		nowy = y;
		n++;
	}
}
function create_circle4(vertices){
	var nowx = vertices[n*2+2];
	var nowy = vertices[n*2+3];
	var x;
	var y;
	var n0 = n;
	var degree = 2*Math.PI*(1/360);
	for(var i =0;i<360;i++){
		x = (nowx-vertices[n0*2])*Math.cos(degree) - (nowy-vertices[n0*2+1])*Math.sin(degree) + vertices[n0*2];
		y = (nowx-vertices[n0*2])*Math.sin(degree) + (nowy-vertices[n0*2+1])*Math.cos(degree) + vertices[n0*2+1];
		vertices.push(x,y);
		colors.push(0.0,1.0,0.0);
		nowx = x;
		nowy = y;
		n++;
	}
	n+=2;
}
function create_circle5(vertices){
	var nowx = vertices[n*2+2];
	var nowy = vertices[n*2+3];
	var x;
	var y;
	var n0 = n;
	var degree = 2*Math.PI*(1/360);
	for(var i =0;i<360;i++){
		x = (nowx-vertices[n0*2])*Math.cos(degree) - (nowy-vertices[n0*2+1])*Math.sin(degree) + vertices[n0*2];
		y = (nowx-vertices[n0*2])*Math.sin(degree) + (nowy-vertices[n0*2+1])*Math.cos(degree) + vertices[n0*2+1];
		vertices.push(x,y);
		colors.push(1.0,1.0,0.0);
		nowx = x;
		nowy = y;
		n++;
	}
	n+=2;
}

function create_circle2(vertices){
	var p;
	var a = 0.3 , b = 0.1 , c = 0.1;
	for(var i=0;i<362;i++){
		var degree = 2*Math.PI*(i/360);
		p = a*a/(a-c*Math.cos(degree));
		vertices.push(Math.cos(degree)*p+0.117,Math.sin(degree)*p-0.2);
		colors.push(0.5,0.5,0.5);
		n++;
	}
	n+=2;
}
function create_circle3(vertices){
	var nowx = vertices[n*2+2];
	var nowy = vertices[n*2+3];
	var x;
	var y;
	var n0 = n;
	var degree = 2*Math.PI*(1/360);
	for(var i =0;i<360;i++){
		x = (nowx-vertices[n0*2])*Math.cos(degree) - (nowy-vertices[n0*2+1])*Math.sin(degree) + vertices[n0*2];
		y = (nowx-vertices[n0*2])*Math.sin(degree) + (nowy-vertices[n0*2+1])*Math.cos(degree) + vertices[n0*2+1];
		vertices.push(x,y);
		colors.push(0.7,0.7,0.7);
		nowx = x;
		nowy = y;
		n++;
	}
	n+=2;
}

function press(){
	window.onkeypress = function(e){
		if(e.charCode == 49){
			flag = 0.6;
		}
	}	
}

function init(){
	var canvas = document.getElementById( "triangle-canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
	if( !gl ){
		alert( "WebGL isn't available" );
	}

	
	
	colors.push(1.0,0.0,1.0);
	colors.push(1.0,0.0,1.0);
	create_circle(vertices);//362
	
	vertices.push(0.05,-0.4,0.05,-0.5);//推进器1 362
	colors.push(0.0,1.0,0.0);
	colors.push(0.0,1.0,0.0);
	create_circle4(vertices);

	vertices.push(0.25,-0.47,0.25,-0.57);//推进器2 362
	colors.push(0.0,1.0,0.0);
	colors.push(0.0,1.0,0.0);
	create_circle4(vertices);
	
	vertices.push(0.46,-0.37,0.46,-0.47);//推进器3 362
	colors.push(0.0,1.0,0.0);
	colors.push(0.0,1.0,0.0);
	create_circle4(vertices);
		
	vertices.push(0.0,0.0,0.5,0.0);//飞盘 364
	colors.push(0.5,0.5,0.5);
	colors.push(0.5,0.5,0.5);
	create_circle2(vertices);
	
	vertices.push(0.22,-0.1,0.22,0.18);//穹
	colors.push(0.7,0.7,0.7);
	colors.push(0.7,0.7,0.7);
	create_circle3(vertices);
	
	vertices.push(0.5,0.4,0.5,0.45);//导弹头
	// console.log(vertices[2176]);
	colors.push(1.0,1.0,0.0);
	colors.push(1.0,1.0,0.0);
	create_circle5(vertices);
	
	vertices.push(0.5,0.35,0.5,0.45,
				  0.7,0.45,0.7,0.35);
	colors.push(1.0,0.5,0.5);
	colors.push(1.0,0.5,0.5);
	

	// Configure WebGL
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 0, 0, 0, 1.0 );

	// Load shaders and initialize attribute buffers
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	// Load the data into the GPU
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

	// Associate external shader variables with data buffer
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );	
	
	
	
	var cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	
	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);
	
	sizeLoc = gl.getUniformLocation( program, "size" );
	render();
}

function render(){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	gl.uniform1f(sizeLoc,size);
	
	gl.drawArrays( gl.TRIANGLE_FAN, 0, 362);//恒星
	
	gl.drawArrays( gl.TRIANGLE_FAN, 362, 362);//推进器1
	
	gl.drawArrays( gl.TRIANGLE_FAN, 724, 362);//推进器2
	
	gl.drawArrays( gl.TRIANGLE_FAN, 1086, 362);//推进器3
	
	gl.drawArrays( gl.TRIANGLE_FAN, 1448, 364);//飞盘
	
	gl.drawArrays( gl.TRIANGLE_FAN, 1812, 362);//穹
	
	gl.drawArrays( gl.TRIANGLE_FAN, 2174, 362);//导弹头
	
	gl.drawArrays( gl.TRIANGLE_FAN, 2536, 4);//导弹体
	
	setTimeout( function (){ size*=flag; requestAnimFrame( render ); }, 1000 );
}