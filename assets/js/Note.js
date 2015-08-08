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
	curr_time += 62.5 * Math.round(curr_milliseconds / 16); 
	return curr_time;
};

Note.prototype.draw = function(){
	if(!this.should_delete){
		mvPushMatrix();
			var vertical_lifespan = TTR.constants.note_lifespan_factor * ( TTR.now - this.start_time );
			mvTranslate([0,TTR.constants.note_lifespan - vertical_lifespan,0]);
			mvRotate(90, [1,0,0]);
			this.model.draw();
			if(vertical_lifespan > TTR.constants.note_lifespan+9){
				this.should_delete = true;
			}
		mvPopMatrix();
	}
};