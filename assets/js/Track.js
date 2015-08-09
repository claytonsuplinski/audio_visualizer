function Track(x){

	this.x = x;
	this.model = TTR.models.track;
	this.time = new Date();
	this.notes = "";
	
	this.init_notes();
};

Track.prototype.init_notes = function(){
	this.notes = [];
};

Track.prototype.add_note = function(note){
	note.parent_object = this;
	
	if(this.notes.length > 0){
		if(this.notes[this.notes.length-1].start_time == note.start_time){
			return;
		}
	}
	this.notes.push(note);
};

Track.prototype.draw = function(){
	var self = this;
	
	mvPushMatrix();
	
		mvTranslate([this.x, 0, 0]);

		gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		
		this.model.draw();
		
		gl.disable(gl.BLEND);
		
		tmp_notes = [];
		var score_change = false;
		this.notes.forEach(function(note){
			note.draw();
			if(!note.should_delete){
				tmp_notes.push(note);
			//	self.notes.splice(index, 1);
			}
			else{
				TTR.user.score -= 150;
				score_change = true;
			}
		});
		this.notes = tmp_notes;
		if(score_change){
			$("#user-score").html(TTR.user.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
		}
	
	mvPopMatrix();
};