"use strict";
const { vec3, vec4, mat4 } = glMatrix;

var rotationMatrix;
var rotationMatrixLoc;

var angle = 0.0;
var axis = [ 0, 0, 1 ];

var trackingMouse = false;
var trackballMove = false;

var lastPos = [ 0, 0, 0 ];
var curx, cury;
var startx, starty;

var canvas;
var gl;

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

// var axis = 0;
// var theta = [0, 0, 0];
// var thetaLoc;

var maxis = -1;
var t = 0;
var d = [0.0, 0.0, 0.0];
var dLoc;
var dist = 0;
function set_dist(){
	dist = document.getElementById("dist").value;
	// console.log(dist);
}
var s = 1;
var smaxis = -1;
var size = [1.0,1.0,1.0];
var sizeLoc;
function set_size(){
	s = document.getElementById("size").value;
}

function initCube() {
    canvas = document.getElementById("rtcb-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    makeCube();

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    // load shaders and initialize attribute buffer
    var program = initShaders(gl, "rtvshader", "rtfshader");
    gl.useProgram(program);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
	
	rotationMatrix = mat4.create();
	rotationMatrixLoc = gl.getUniformLocation( program, "rmat" );
	gl.uniformMatrix4fv( rotationMatrixLoc, false, new Float32Array(rotationMatrix) );
	
	canvas.addEventListener( "mousedown", function(event){
		var x = 2*event.clientX/canvas.width-1;
		var y = 2*(canvas.height-event.clientY)/canvas.height-1;
		startMotion( x, y );
	});
	
	canvas.addEventListener( "mouseup", function(event){
		var x = 2*event.clientX/canvas.width-1;
		var y = 2*(canvas.height-event.clientY)/canvas.height-1;
		stopMotion( x, y );
	});
	
	canvas.addEventListener( "mousemove", function(event){
		var x = 2*event.clientX/canvas.width-1;
		var y = 2*(canvas.height-event.clientY)/canvas.height-1;
		moveMotion( x, y );
	});

	//旋转方向
    // thetaLoc = gl.getUniformLocation(program, "theta");
    // gl.uniform3fv(thetaLoc, theta);
    // document.getElementById("xbutton").onclick = function () {
    //     axis = xAxis;
    // }

    // document.getElementById("ybutton").onclick = function () {
    //     axis = yAxis;
    // }

    // document.getElementById("zbutton").onclick = function () {
    //     axis = zAxis;
    // }
	
	//平移方向
	dLoc = gl.getUniformLocation(program, "d");
	gl.uniform3fv(dLoc, d);
	document.getElementById("move_x").onclick = function(){
		maxis = xAxis;
		t = 0.01;
	}
	document.getElementById("move_y").onclick = function(){
		maxis = yAxis;
		t = 0.01;
	}
	document.getElementById("move_z").onclick = function(){
		maxis = zAxis;
		t = 0.01;
	}
	document.getElementById("move_fx").onclick = function(){
		maxis = xAxis;
		t = -0.01;
	}
	document.getElementById("move_fy").onclick = function(){
		maxis = yAxis;
		t = -0.01;
	}
	document.getElementById("move_fz").onclick = function(){
		maxis = zAxis;
		t = -0.01;
	}
	
	//缩放
	sizeLoc = gl.getUniformLocation(program, "size");
	gl.uniform3fv(sizeLoc, size);
	document.getElementById("change_x").onclick = function(){
		// console.log("x"+s);
		smaxis = xAxis;
	}
	document.getElementById("change_y").onclick = function(){
		// console.log("y"+s);
	 	smaxis = yAxis;
	} 
	document.getElementById("change_z").onclick = function(){
	 	smaxis = zAxis;
		 console.log("z"+s);
	 } 

    render();
}


function trackballView( x, y ){
	var d, a;
	var v = [];

	v[0] = x;
	v[1] = y;

	d = v[0]*v[0]+v[1]*v[1];
	if( d < 1.0 )
		v[2] = Math.sqrt( 1.0 - d );
	else{
		v[2] = 0.0;
		a = 1.0 / Math.sqrt( d );
		v[0] *= a;
		v[1] *= a;
	}
	return v;
}

function startMotion( x, y ){
	trackingMouse = true;
	startx = x;
	starty = y;
	curx = x;
	cury = y;

	lastPos = trackballView( x, y );
	trackballMove = true;
}

function moveMotion( x, y ){
	var dx, dy, dz;

	var curPos = trackballView( x, y );
	if( trackingMouse ){
		dx = curPos[0] - lastPos[0];
		dy = curPos[1] - lastPos[1];
		dz = curPos[2] - lastPos[2];

		if( dx || dy || dz ){
			angle = -1.0*Math.sqrt( dx*dx + dy*dy + dz*dz );

			axis[0] = lastPos[1] * curPos[2] - lastPos[2] * curPos[1];
			axis[1] = lastPos[2] * curPos[0] - lastPos[0] * curPos[2];
			axis[2] = lastPos[0] * curPos[1] - lastPos[1] * curPos[0];

			lastPos[0] = curPos[0];
			lastPos[1] = curPos[1];
			lastPos[2] = curPos[2];
		}
	}
	render();
}

function stopMotion( x, y ){
	trackingMouse = false;
	if( startx != x || starty != y ){
	}else{
		angle = 0.0;
		trackballMove = false;
	}
}


function makeCube() {
    var vertices = [
        glMatrix.vec4.fromValues(-0.5, -0.5, 0.5, 1.0),
        glMatrix.vec4.fromValues(-0.5, 0.5, 0.5, 1.0),
        glMatrix.vec4.fromValues(0.5, 0.5, 0.5, 1.0),
        glMatrix.vec4.fromValues(0.5, -0.5, 0.5, 1.0),
        glMatrix.vec4.fromValues(-0.5, -0.5, -0.5, 1.0),
        glMatrix.vec4.fromValues(-0.5, 0.5, -0.5, 1.0),
        glMatrix.vec4.fromValues(0.5, 0.5, -0.5, 1.0),
        glMatrix.vec4.fromValues(0.5, -0.5, -0.5, 1.0),
    ];

    var vertexColors = [
        glMatrix.vec4.fromValues(0.0, 0.0, 0.0, 1.0),
        glMatrix.vec4.fromValues(1.0, 0.0, 0.0, 1.0),
        glMatrix.vec4.fromValues(1.0, 1.0, 0.0, 1.0),
        glMatrix.vec4.fromValues(0.0, 1.0, 0.0, 1.0),
        glMatrix.vec4.fromValues(0.0, 0.0, 1.0, 1.0),
        glMatrix.vec4.fromValues(1.0, 0.0, 1.0, 1.0),
        glMatrix.vec4.fromValues(0.0, 1.0, 1.0, 1.0),
        glMatrix.vec4.fromValues(1.0, 1.0, 1.0, 1.0)
    ];

    var faces = [
        1, 0, 3, 1, 3, 2, //正
        2, 3, 7, 2, 7, 6, //右
        3, 0, 4, 3, 4, 7, //底
        6, 5, 1, 6, 1, 2, //顶
        4, 5, 6, 4, 6, 7, //背
        5, 4, 0, 5, 0, 1  //左
    ];

	// console.log(vertices[faces[0]][0],vertices[faces[0]][1],vertices[faces[0]][2]);
    for (var i = 0; i < faces.length; i++) {
        points.push(vertices[faces[i]][0], vertices[faces[i]][1], vertices[faces[i]][2]);

        colors.push(vertexColors[Math.floor(i / 6)][0], vertexColors[Math.floor(i / 6)][1], vertexColors[Math.floor(i / 6)][2], vertexColors[Math.floor(i / 6)][3]);
    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // theta[axis] += 0.05;
    // gl.uniform3fv(thetaLoc, theta);
	
	if( trackballMove ){
		vec3.normalize(axis,axis);//axis = normalize( axis );
		//rotationMatrix = multiply( rotationaMatrix, rotate(angle, axis) );
		var rmat=mat4.create();
		mat4.fromRotation(rmat,angle,axis);
		mat4.multiply(rotationMatrix, rotationMatrix, rmat);
		gl.uniformMatrix4fv( rotationMatrixLoc, false, new Float32Array(rotationMatrix) );
	}
	
	if(maxis != -1 && dist > 0 ){
		dist -= 2;
		d[maxis] += t;
		gl.uniform3fv(dLoc, d);	
	}else if(dist <= 0){
		maxis = -1;
	}
	
	if(smaxis != -1){
		size[smaxis] = s;
		gl.uniform3fv(sizeLoc, size);	
		smaxis = -1;
	}
	
    gl.drawArrays(gl.TRIANGLES, 0, points.length / 3);

    requestAnimFrame(render);
}