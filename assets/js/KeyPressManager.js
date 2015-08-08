document.addEventListener('keydown', function(event) {
	if(TTR.keys_pressed.indexOf(event.keyCode) == -1){
		TTR.keys_pressed.push(event.keyCode);
	}
});

document.addEventListener('keyup', function(event) {
	TTR.keys_pressed.splice(TTR.keys_pressed.indexOf(event.keyCode), 1);
});

setInterval(function(){
	if(TTR.keys_pressed.indexOf(87) != -1) { // W
		// Go forwards
		if(TTR.user.free_mode){
			var tmp_angle = -TTR.user.rotation.y*TTR.constants.to_radians;
			TTR.user.position.x += Math.sin(tmp_angle);
			TTR.user.position.z += Math.cos(tmp_angle);
		}
    }
	if(TTR.keys_pressed.indexOf(83) != -1) { // S
        // Go backwards
		if(TTR.user.free_mode){
			var tmp_angle = -TTR.user.rotation.y*TTR.constants.to_radians;
			TTR.user.position.x -= Math.sin(tmp_angle);
			TTR.user.position.z -= Math.cos(tmp_angle);
		}
    }
	if(TTR.keys_pressed.indexOf(68) != -1) { // D
        // Rotate right
		if(TTR.user.free_mode){
			TTR.user.rotation.y++;
			while(TTR.user.rotation.y < 0){
				TTR.user.rotation.y += 360;
			}
			TTR.user.rotation.y %= 360;
		}
    }
	if(TTR.keys_pressed.indexOf(65) != -1) { // A
        // Rotate left
		if(TTR.user.free_mode){
			TTR.user.rotation.y--;
			while(TTR.user.rotation.y < 0){
				TTR.user.rotation.y += 360;
			}
			TTR.user.rotation.y %= 360;
		}
    }
	if(TTR.keys_pressed.indexOf(81) != -1) { // Q
        // Go up
		if(TTR.user.free_mode){
			TTR.user.position.y++;
		}
    }
	if(TTR.keys_pressed.indexOf(90) != -1) { // Z
        // Go down
		if(TTR.user.free_mode){
			TTR.user.position.y--;
		}
    }
	if(TTR.keys_pressed.indexOf(38) != -1) { // Up Arrow
        // Go down
		if(TTR.user.free_mode){
			TTR.user.rotation.x--;
		}
    }
	if(TTR.keys_pressed.indexOf(40) != -1) { // Down Arrow
        // Go down
		if(TTR.user.free_mode){
			TTR.user.rotation.x++;
		}
    }
}, 60);

function init_mouse_controls(){
	$("#glcanvas")
		.mousedown(function (event){
			TTR.mouse.x = event.pageX;
			TTR.mouse.y = event.pageY;
			if(event.which == 1){ // Left mouse
				TTR.mouse.left_down = true;
			}
			if(event.which == 3){ // Right mouse
				TTR.mouse.right_down = true;
			}
		})	
		.mousemove(function(event) {
			if(TTR.mouse.left_down){
				TTR.user.rotation.y += (event.pageX - TTR.mouse.x);
				TTR.user.rotation.x += (event.pageY - TTR.mouse.y)/2;
				while(TTR.user.rotation.y < 0){
					TTR.user.rotation.y += 360;
				}
				while(TTR.user.rotation.y > 360){
					TTR.user.rotation.y -= 360;
				}
				if(TTR.user.rotation.x > 90){
					TTR.user.rotation.x = 90;
				}
				if(TTR.user.rotation.x < -90){
					TTR.user.rotation.x = -90;
				}
			}
			if(TTR.mouse.right_down){
				TTR.user.position.z -= (event.pageY - TTR.mouse.y);
				if(TTR.user.position.z > 0){
					TTR.user.position.z = 0;
				}
				if(TTR.user.position.z < -1000){
					TTR.user.position.z = -1000;
				}
			}
			TTR.mouse.x = event.pageX;
			TTR.mouse.y = event.pageY;
		})
		.bind('mousewheel DOMMouseScroll', function (event){
			var tmp_delta = parseInt(parseInt(event.originalEvent.wheelDelta)/4 || -parseInt(event.originalEvent.detail)*8);
			TTR.user.position.z += tmp_delta/4;
			if(TTR.user.position.z > 0){
				TTR.user.position.z = 0;
			}
			if(TTR.user.position.z < -1000){
				TTR.user.position.z = -1000;
			}
		});
		
	$("body")
		.mouseup(function (event){
			if(event.which == 1){ // Left mouse
				TTR.mouse.left_down = false;
			}
			if(event.which == 3){ // Right mouse
				TTR.mouse.right_down = false;
			}
		});
}