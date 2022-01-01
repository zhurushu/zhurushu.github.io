"use strict";
const {
	vec3,
	vec4,
	mat4
} = glMatrix;

var gl;
var buffer;
var cBuffer
var points = [];
var index;
var pointIndex = 0; //全部点的个数
var graph = []; //记录图形
var s = [1.0, 1.0, 1.0];
var ds = 0.01; //缩放
//颜色选择器
var color = [0.0, 0.0, 0.0, 1.0];
//三角形
var trangle = [
	-0.1, -0.1, 0,
	0, 0.1, 0,
	0.1, -0.1, 0
]
//矩形
var rectangle = [
	0.1, 0.1, 0.0,
	0.1, -0.1, 0.0,
	-0.1, -0.1, 0.0,
	-0.1, 0.1, 0.0
]
var thetaLoc;
var sLoc;
var posLoc;

var theta_r = 0.0;
var theta_c = 0.0;

function get(button) {
	index = button.value;
}
var circle = [];

function get_circle() {
	var x = 0,
		y = 0.1;
	var a = 0,
		b = 0;
	circle.push(0.0, 0.0, x, y);
	var degree = Math.PI / 180;
	for (var i = 0; i < 360; i++) {
		a = x * Math.cos(degree) - y * Math.sin(degree);
		b = x * Math.sin(degree) + y * Math.cos(degree);
		x = a;
		y = b;
		circle.push(a, b);
	}
	// console.log(circle);
}

function canvas_clear() {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = canvas.width;
}

window.onload = function inti() {
	var canvas = document.getElementById("canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) {
		alert("WebGL isn't available");
	}
	get_circle();
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, 16 * 100000, gl.STATIC_DRAW);

	var Position = gl.getAttribLocation(program, "Position");
	gl.vertexAttribPointer(Position, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(Position);

	cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, 16 * 100000, gl.STATIC_DRAW);

	var Color = gl.getAttribLocation(program, "Color");
	gl.vertexAttribPointer(Color, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(Color);

	thetaLoc = gl.getUniformLocation(program, "theta");
	sLoc = gl.getUniformLocation(program, "s");
	posLoc = gl.getUniformLocation(program, "pos");

	document.getElementById("cl").onchange = function(event) {
		var c = 0;
		var ch = 0;
		var x = document.getElementById("cl").value;
		var Scolor = x.colorRgb();
		for (var i = 0; i < Scolor.length; i++) {
			if (parseInt(Scolor[i]) <= 9 && parseInt(Scolor[i]) >= 0) {
				c = 10 * c + parseInt(Scolor[i]);
			} else {
				color[ch++] = c;
				c = 0;
			}
			if (i == Scolor.length - 1) {
				color[ch++] = c;
				c = 0;
			}
		}
		color[3] = 1.0;
		color[0] /= 255;
		color[1] /= 255;
		color[2] /= 255;
		// console.log(color);
	}

	canvas.addEventListener("mousedown", function(event) {
		var x = (event.clientX - canvas.width / 2) / (canvas.width / 2);
		var y = -(event.clientY - canvas.height / 2) / (canvas.height / 2);
		if (index == 0) {
			mtrangle(x, y);
		} else if (index == 1) {
			mrectangle(x, y);
		} else if (index == 2) {
			mcube(x, y);
		} else if (index == 3) {
			mcircle(x, y);
		}
	})

	render();
}

function mtrangle(x, y) {
	points.push(x, y);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	for (var i = 0; i < 3; i++) {
		gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (pointIndex + i), new Float32Array(glMatrix.vec4.fromValues(trangle[i *
			3], trangle[i * 3 + 1], trangle[i * 3 + 2], 1.0)))
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	for (var i = 0; i < 3; i++) {
		gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (pointIndex + i), new Float32Array(color));
	}
	pointIndex += 3;
	graph.push(0);
}

function mrectangle(x, y) {
	points.push(x, y);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	for (var i = 0; i < 4; i++) {
		gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (pointIndex + i), new Float32Array(glMatrix.vec4.fromValues(rectangle[i *
			3], rectangle[i * 3 + 1], rectangle[i * 3 + 2], 1.0)))
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	for (var i = 0; i < 4; i++) {
		gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (pointIndex + i), new Float32Array(color));
	}
	pointIndex += 4;
	graph.push(1);
}

function mcube(x, y) {
	points.push(x, y);
	var vertices = [
		glMatrix.vec4.fromValues(-0.1, -0.1, 0.1, 1.0),
		glMatrix.vec4.fromValues(-0.1, 0.1, 0.1, 1.0),
		glMatrix.vec4.fromValues(0.1, 0.1, 0.1, 1.0),
		glMatrix.vec4.fromValues(0.1, -0.1, 0.1, 1.0),
		glMatrix.vec4.fromValues(-0.1, -0.1, -0.1, 1.0),
		glMatrix.vec4.fromValues(-0.1, 0.1, -0.1, 1.0),
		glMatrix.vec4.fromValues(0.1, 0.1, -0.1, 1.0),
		glMatrix.vec4.fromValues(0.1, -0.1, -0.1, 1.0),
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
		5, 4, 0, 5, 0, 1 //左
	];
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	for (var i = 0; i < faces.length; i++) {
		gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (pointIndex + i), new Float32Array(vertices[faces[i]]));
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	for (var i = 0; i < faces.length; i++) {
		gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (pointIndex + i), new Float32Array(vertexColors[Math.floor(i / 6)]));
	}
	pointIndex += 36;
	graph.push(2);
}

function mcircle(x, y) {
	points.push(x, y);
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	for (var i = 0; i < 362; i++) {
		gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (pointIndex + i), new Float32Array(glMatrix.vec4.fromValues(circle[i *
			2], circle[i * 2 + 1], 0.0, 1.0)));
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	for (var i = 0; i < 362; i++) {
		gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (pointIndex + i), new Float32Array(color));
	}
	pointIndex += 362;
	graph.push(3);
}

function render() {
	var pindex = 0;
	for (var i = 0; i < graph.length; i++) {
		if (graph[i] == 3) {
			var dx = Math.random() / 5;
			var dy = Math.random() / 5;
			var f = Math.random();
			var f1 = Math.random();
			if (f > 0.5) {
				dx = -dx;
			}
			if (f1 > 0.5) {
				dy = -dy;
			}
			gl.uniform3fv(posLoc, [points[i * 2] + dx, points[i * 2 + 1] + dy, 0.0]);
		} else gl.uniform3fv(posLoc, [points[i * 2], points[i * 2 + 1], 0.0]);
		if (graph[i] == 0) {
			trender(pindex);
			pindex += 3;
		} else if (graph[i] == 1) {
			rrender(pindex);
			pindex += 4;
		} else if (graph[i] == 2) {
			crender(pindex);
			pindex += 36;
		} else if (graph[i] == 3) {
			// console.log(1);
			cirender(pindex);
			pindex += 362;
		}
	}
	requestAnimFrame(render);
}

function trender(pindex) {
	s[0] = s[1] = s[2] += ds;
	if (s[0] < 0.5) ds *= -1;
	else if (s[0] > 2) ds *= -1;
	gl.uniform3fv(sLoc, s);
	gl.uniform3fv(thetaLoc, [0.0, 0.0, 0.0]);
	gl.drawArrays(gl.TRIANGLES, pindex, 3);
}

function rrender(pindex) {
	theta_r += 0.01;
	if (theta_r > 2 * Math.PI) theta_r -= Math.PI * 2;
	gl.uniform3fv(sLoc, [1.0, 1.0, 1.0]);
	gl.uniform3fv(thetaLoc, [0.0, 0.0, theta_r]);
	gl.drawArrays(gl.TRIANGLE_FAN, pindex, 4);
}

function crender(pindex) {
	theta_c += 0.01;
	if (theta_c > 2 * Math.PI) theta_c -= Math.PI * 2;
	gl.uniform3fv(sLoc, [1.0, 1.0, 1.0]);
	gl.uniform3fv(thetaLoc, [0.5, 0.5, theta_c]);
	gl.drawArrays(gl.TRIANGLES, pindex, 36);
}

function cirender(pindex) {
	gl.uniform3fv(sLoc, [1.0, 1.0, 1.0]);
	gl.uniform3fv(thetaLoc, [0.0, 0.0, 0.0]);
	gl.drawArrays(gl.TRIANGLE_FAN, pindex, 362);
}

var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
String.prototype.colorRgb = function() {
	var sColor = this.toLowerCase();
	if (sColor && reg.test(sColor)) {
		if (sColor.length === 4) {
			var sColorNew = "#";
			for (var i = 1; i < 4; i += 1) {
				sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
			}
			sColor = sColorNew;
		}
		//处理六位的颜色值
		var sColorChange = [];
		for (var i = 1; i < 7; i += 2) {
			sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
		}
		return sColorChange.join(",");
	} else {
		return sColor;
	}
}
