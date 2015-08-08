function Track(x){

	this.x = x;
	this.model = TTR.models.track;
	this.time = new Date();
	this.notes = "";
	
};

Track.prototype.add_note = function(note){
	note.parent_object = this;
	if(this.notes == ""){
		this.notes = [];
	}
	this.notes.push(note);
};

Track.prototype.draw = function(){
	var self = this;
	
	mvPushMatrix();
	
		mvTranslate([this.x, 0, 0]);

		this.model.draw();
		this.notes.forEach(function(note, index){
			note.draw();
			if(note.should_delete){
				self.notes.splice(index, 1);
			}
		});
	
	mvPopMatrix();
};