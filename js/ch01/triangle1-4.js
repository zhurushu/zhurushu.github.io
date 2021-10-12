
// 任务d 不同颜色的三角形+四边形
function task4(){
	var c=document.getElementById("tr-canvas");
	var ctx=c.getContext("2d");
	ctx.beginPath();
	ctx.moveTo(100, 0);
	ctx.lineTo(0, 100);
	ctx.lineTo(100, 100);
	ctx.fillStyle = "#FFFF00";
	ctx.fill();
	ctx.fillStyle="#FF00FF";
	ctx.fillRect(0,100,100,100);
}
