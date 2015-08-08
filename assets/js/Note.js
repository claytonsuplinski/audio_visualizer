function Note(){
	
	this.model = TTR.models.note;
	this.start_time = this.get_start_time();
	this.should_delete = false;
	this.parent_object = "";
	
}

Note.prototype.get_start_time = function(){
	var now = new Date();
	var curr_time = now.getTime();
	var curr_milliseconds = now.getMilliseconds();
	curr_time -= curr_milliseconds;
	if(curr_milliseconds >= 750){
		curr_time += 750;
	}
	else if(curr_milliseconds >= 500){
		curr_time += 500
	}
	else if(curr_milliseconds >= 250){
		curr_time += 250
	}
	return curr_time;
};

Note.prototype.draw = function(){
	mvPushMatrix();
		var vertical_lifespan = TTR.constants.note_lifespan_factor * ( TTR.now.getTime() - this.start_time );
		mvTranslate([0,TTR.constants.note_lifespan - vertical_lifespan,0]);
		this.model.draw();
		if(vertical_lifespan > TTR.constants.note_lifespan+9){
			this.should_delete = true;
		}
	mvPopMatrix();
};