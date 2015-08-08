function Note(){
	
	this.model = TTR.models.note;
	this.start_time = new Date();
	this.should_delete = false;
	this.parent_object = "";
	
}

Note.prototype.draw = function(){
	mvPushMatrix();
		var vertical_lifespan = TTR.constants.note_lifespan_factor * ( TTR.now.getTime() - this.start_time.getTime() );
		mvTranslate([0,9 - vertical_lifespan,0]);
		this.model.draw();
		if(vertical_lifespan > 18){
			this.should_delete = true;
		}
	mvPopMatrix();
};