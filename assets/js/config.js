TTR = {};

TTR.constants = {};
TTR.constants.to_radians = Math.PI/180;
TTR.constants.note_lifespan = 40;
TTR.constants.audio_delay = 5000;
TTR.constants.note_lifespan_factor = TTR.constants.note_lifespan/TTR.constants.audio_delay;

TTR.now = new Date();

TTR.keys_pressed = [];

TTR.user = {};
TTR.user.free_mode = false;
TTR.user.position = {};
TTR.user.position.x = 0;
TTR.user.position.y = 0;
TTR.user.position.z = -20;
TTR.user.rotation = {};
TTR.user.rotation.x = 0;
TTR.user.rotation.y = 0;

TTR.mouse = {};
TTR.mouse.left_down = false;
TTR.mouse.right_down = false;
TTR.mouse.x = "";
TTR.mouse.y = "";

TTR.models = {};

TTR.models.electrons = {};

function init_models(){
	TTR.models.track = new Rectangle(2, 19);
	TTR.models.track.set_texture("./assets/textures/track.png");
	TTR.models.track.set_shader(basic_shader);

	TTR.models.note = new Sphere(0.8, 24, 24);
	TTR.models.note.set_texture("./assets/textures/note.png");
	TTR.models.note.set_shader(basic_shader);
	
	TTR.models.neutrons = new Sphere(0.8, 24, 24);
	TTR.models.neutrons.set_texture("./assets/textures/neutron.png");
	TTR.models.neutrons.set_shader(basic_shader);

	TTR.models.electrons["s"] = new Sphere(0.2, 8, 8);
	TTR.models.electrons["s"].set_texture("./assets/textures/electron_s.png");
	TTR.models.electrons["s"].set_shader(basic_shader);
	
	TTR.models.electrons["p"] = new Sphere(0.2, 8, 8);
	TTR.models.electrons["p"].set_texture("./assets/textures/electron_p.png");
	TTR.models.electrons["p"].set_shader(basic_shader);	
	
	TTR.models.electrons["d"] = new Sphere(0.2, 8, 8);
	TTR.models.electrons["d"].set_texture("./assets/textures/electron_d.png");
	TTR.models.electrons["d"].set_shader(basic_shader);	
	
	TTR.models.electrons["f"] = new Sphere(0.2, 8, 8);
	TTR.models.electrons["f"].set_texture("./assets/textures/electron_f.png");
	TTR.models.electrons["f"].set_shader(basic_shader);	
}

function load_elements_data(){
	$.ajaxSetup({async:false});
	var tmp_modal_html = "";
	$.getJSON( "./assets/json/elements.json", function( data ) {
		data.elements.forEach(function (element){
			TTR.data.elements.push(element);
			tmp_modal_html += "<div class='col-xs-12 select-individual-element' ";
				tmp_modal_html += "onclick='atom.set_new_atom("+element["atomic-number"]+", "
						+element["atomic-number"]+", "
						+(parseInt(element["molar-mass"] - element["atomic-number"]))+");' data-dismiss='modal'>";
				tmp_modal_html += "<table><tr>";
					tmp_modal_html += "<td style='width:10%;'>";
						tmp_modal_html += element["atomic-number"];
					tmp_modal_html += "</td>";
					tmp_modal_html += "<td style='width:10%;'>";
						tmp_modal_html += element.symbol;
					tmp_modal_html += "</td>";
					tmp_modal_html += "<td style='width:40%;text-align:center;'>";
						tmp_modal_html += element.name;
					tmp_modal_html += "</td>";
					tmp_modal_html += "<td style='width:40%;text-align:center;'>";
						tmp_modal_html += element["molar-mass"];
					tmp_modal_html += "</td>";
				tmp_modal_html += "</tr></table>";
			tmp_modal_html += "</div>";
		});
	});
	$("#list-of-elements").html(tmp_modal_html);
	$.ajaxSetup({async:true});
}

function init_project(){
	init_models();
	load_elements_data();
}