
var startTarget = ffbomesh.controls.target.clone();
var startPosition = ffbomesh.camera.position.clone();
var startUp = ffbomesh.controls.object.up.clone();
var noiseCam = new THREE.Vector3( 0, 0, 0 );
var noiseSigma = new THREE.Vector3( 0.5, 1., 0.5 );

Array.prototype.sample = function(){
	var len = this.length;
	var idx = Math.floor(Math.random()*len);
	var out = this[idx];
	return out;
}

randn = function() {
	var out = 0;
	for (var i = 0; i < 30; i += 1) {
		out = out + (Math.random()*2. - 1.)/30;
	}
	return out;
}

addNoiseCameraman = function() {
	var a = new THREE.Vector3();
	a.copy(noiseSigma);
	var b = new THREE.Vector3( randn(), randn(), randn() );
	a.multiply(b);
	noiseCam.add(a);
}

var thetaCam = 190/180*Math.PI; 
var xCam = 0.5;
var dxCam = 0.01;

var myCameraman;

interpolateCameramanPos = function(out) {
	var intCam = 1-(Math.cos(xCam*Math.PI)+1)/2;
	ffbomesh.camera.position.x = out.posx*intCam + (1-intCam) * startPosition.x + noiseCam.x;
	ffbomesh.camera.position.y = out.posy*intCam + (1-intCam) * startPosition.y + noiseCam.y;
	ffbomesh.camera.position.z = out.posz*intCam + (1-intCam) * startPosition.z + noiseCam.z; 	
	ffbomesh.controls.target.x = out.tarx*intCam +  (1-intCam) * startTarget.x; 
	ffbomesh.controls.target.y = out.tary*intCam +  (1-intCam) * startTarget.y; 
	ffbomesh.controls.target.z = out.tarz*intCam +  (1-intCam) * startTarget.z; 
	ffbomesh.controls.object.up.x = out.upx*intCam +  (1-intCam) * startUp.x; 
	ffbomesh.controls.object.up.y = out.upy*intCam  +  (1-intCam) * startUp.y; 
	ffbomesh.controls.object.up.z = out.upz*intCam +  (1-intCam) * startUp.z; 
}

clearCameraman = function() {
	clearInterval(myCameraman);
	startTarget = ffbomesh.controls.target.clone();
	startPosition = ffbomesh.camera.position.clone();
	startUp = ffbomesh.controls.object.up.clone();
}

getCameramanPosDefault = function() {
	var out = {};
	out.posx = ffbomesh.camera.position.x;
	out.posy = ffbomesh.camera.position.y;
	out.posz = ffbomesh.camera.position.z;
	out.tarx = ffbomesh.controls.target0.x;
	out.tary = ffbomesh.controls.target0.y;
	out.tarz = ffbomesh.controls.target0.z;
	out.upx = ffbomesh.controls.up0.x;
	out.upy = ffbomesh.controls.up0.y;
	out.upz = ffbomesh.controls.up0.z;
	return out;
}

sampleCameramanMove = function() {
	var randomRoll = [1,2,3,4].sample();
	if (randomRoll == 1)
	{
		getCameramanPos = function() {
			var out = getCameramanPosDefault();
			out.posx = (1800*Math.cos(thetaCam) + ffbomesh.controls.target0.x);
			out.posy = ffbomesh.controls.target0.y;
			out.posz = (1800*Math.sin(thetaCam)+ffbomesh.controls.target0.z);
			return out;
		}
	}
	if (randomRoll == 2)
	{
		getCameramanPos = function() {
			var out = getCameramanPosDefault();
			out.posx = (1400 + 400*Math.cos(thetaCam) + ffbomesh.controls.target0.z);
			out.posy = ffbomesh.controls.target0.y; 
			out.posz = ffbomesh.controls.target0.z; 
			return out;
		}
	}
	if (randomRoll == 3)
	{
		getCameramanPos = function() {
			var out = getCameramanPosDefault();
			out.posx = ffbomesh.controls.target0.x; 
			out.posy = ffbomesh.controls.target0.y; 
			out.posz = (1400 + 400*Math.cos(thetaCam) + ffbomesh.controls.target0.x);
			return out;
		}
	}
	if (randomRoll == 4)
	{
		getCameramanPos = function() {
			var out = getCameramanPosDefault();
			out.posx = (200 + 800*Math.sin(thetaCam) + ffbomesh.controls.target0.x);
			out.posy = (200 + 800*Math.cos(thetaCam) + ffbomesh.controls.target0.y);
			out.posz = startPosition.z; 
			return out;
		}
	}
}

sampleCameramanMove();

updateCameraman = function() {
	thetaCam = (thetaCam - 100*dxCam/180*Math.PI) % (2 * Math.PI); 
	xCam = Math.min(1.0, xCam + dxCam);
	if (xCam == 1)
	{
		//console.log('Cameraman: Selecting new move...');
		//thetaCam = 190/180*Math.PI; 
		startTarget = ffbomesh.controls.target.clone();
		startPosition = ffbomesh.camera.position.clone();
		startUp = ffbomesh.controls.object.up.clone();
		sampleCameramanMove();
		dxCam = [0.005,0.01,0.01,0.015].sample();
		xCam = 0;
	}
}

startCameraman = function() {
	myCameraman = setInterval(function(){
	updateCameraman();
	addNoiseCameraman();
	interpolateCameramanPos(getCameramanPos());
	}, 50);
};

startCameraman();

