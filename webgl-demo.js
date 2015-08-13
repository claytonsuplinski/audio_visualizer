var canvas;
var gl;

function initWebGL() {
	gl = null;

	try {
		gl = canvas.getContext("experimental-webgl");
	}
	catch(e) {
	}

	if (!gl) {
		alert("Unable to initialize WebGL. Your browser may not support it.");
	}
}

function resize_canvas(){
	canvas = document.getElementById("glcanvas");
	canvas.style.width = window.innerWidth;
	canvas.style.height = window.innerHeight;
}

window.addEventListener('resize', resize_canvas);

$.ajaxSetup({async:false});

function start() {

	init_mouse_controls();	
	resize_canvas();

	initWebGL(canvas);

	if (gl) {
		gl.clearColor(0.0, 0.02, 0.04, 1.0);  // Clear to black, fully opaque
		gl.clearDepth(1.0);                 // Clear everything
		gl.enable(gl.DEPTH_TEST);           // Enable depth testing
		gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
			
		basic_shader = new Shader("shader-vs", "shader-fs");

		init_project();
		
		test_track = new Track(-5);
		//test_track.add_note(new Note());
		
		test_track_2 = new Track(0);
		//test_track_2.add_note(new Note());
		
		test_track_3 = new Track(5);
		//test_track_3.add_note(new Note());
		
		test_sphere = new Sphere(30, 50, 50);
		test_sphere.set_texture("./assets/textures/background2.png");
		test_sphere.set_shader(basic_shader);
		test_sphere_rotation = 0;
		
		dots_sphere = new Sphere(25, 50, 50);
		dots_sphere.set_texture("./assets/textures/dots.png");
		dots_sphere.set_shader(basic_shader);
		dots_sphere_rotation = 0;
		
		floor = new Rectangle(80, 80);
		floor.set_texture("./assets/textures/floor.png");
		floor.set_shader(basic_shader);

		setInterval(drawScene, 15);

/*		
		setInterval(function(){test_track.add_note(new Note());}, 500);
		setInterval(function(){test_track_2.add_note(new Note());}, 1500);
		setInterval(function(){test_track_3.add_note(new Note());}, 1000);
*/
	}
}

function drawScene() {

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	perspectiveMatrix = makePerspective(45, window.innerWidth/window.innerHeight, 0.1, 5000.0);

	loadIdentity();

	if(TTR.user.free_mode){
		mvRotate(TTR.user.rotation.x, [1,0,0]);
		mvRotate(TTR.user.rotation.y, [0,1,0]);
		mvTranslate([TTR.user.position.x,0-TTR.user.position.y,TTR.user.position.z]);
	}
	else{
		mvTranslate([TTR.user.position.x,0-TTR.user.position.y,TTR.user.position.z]);
		mvRotate(TTR.user.rotation.x, [1,0,0]);
		mvRotate(TTR.user.rotation.y, [0,1,0]);
	}
	
	mvRotate(-(-30+TTR.user.rotation.x), [1,0,0]);
	mvRotate(test_sphere_rotation, [0,1,0]);
	test_sphere.draw();
	mvRotate(-test_sphere_rotation, [0,1,0]);
	mvRotate((-30+TTR.user.rotation.x), [1,0,0]);
	test_sphere_rotation+=0.1;
	
	gl.enable(gl.BLEND);
	gl.disable(gl.DEPTH_TEST);
	mvPushMatrix();
	mvTranslate([0,0,-12]);
	mvRotate(90, [0,0,1]);
	mvRotate(-dots_sphere_rotation, [0,1,0]);
	dots_sphere.draw();
	mvPopMatrix();
	dots_sphere_rotation+=0.1;
	gl.enable(gl.DEPTH_TEST);
	gl.disable(gl.BLEND);
	
	floor.draw();
	
	test_track.draw();
	test_track_2.draw();
	test_track_3.draw();
  
}