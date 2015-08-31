function AudioManager(src){	
	var audio_hidden = new Audio(src);
	
	this.context = new AudioContext();

	var audioElement = audio_hidden;
	var mediaSourceNode = this.context.createMediaElementSource(audioElement);

	var self = this;
	this.analyser = this.context.createAnalyser();
	mediaSourceNode.connect(self.analyser);
	this.analyser.connect(this.context.destination);

	this.analyser.fftSize = 32;
	var bufferLength = this.analyser.frequencyBinCount;
	this.dataArray = new Float32Array(bufferLength);
	
	///////////pitch detect///////////////
	
	window.AudioContext = window.AudioContext || window.webkitAudioContext;

	theBuffer = null;
	
	context = this.context;
	var request = new XMLHttpRequest();
	request.open("GET", src, true);
	request.responseType = "arraybuffer";
	request.onload = function() {
	  context.decodeAudioData( request.response, function(buffer) { 
	    	theBuffer = buffer;
		} );
	}
	request.send();
	
	detectorElem = document.getElementById( "detector" );
	pitchElem = document.getElementById( "pitch" );
	noteElem = document.getElementById( "note" );
	detuneElem = document.getElementById( "detune" );
	detuneAmount = document.getElementById( "detune_amt" );
	
	/////////end pitch detect/////////////

	audioElement.play();
	audioElement.volume=0.001;

	this.prev_data = {};
	this.prev_data.left   = 0;
	this.prev_data.middle = 0;
	this.prev_data.right  = 0;
	this.prev_data.channels = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

	var audio_audible = new Audio(src);
	var audioElement2 = audio_audible;
	var self = this;
	setTimeout(function(){audioElement2.play();self.analyze();}, TTR.constants.audio_delay);
}

AudioManager.prototype.analyze = function(){
		TTR.now = (new Date()).getTime();
	
		var self = this;
		
		self.analyser.getFloatFrequencyData(this.dataArray);
		
		var tmp_html = "";
		var curr_data = {};
		curr_data.left   = 0;
		curr_data.middle = 0;
		curr_data.right  = 0;
		curr_data.channels = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		Object.keys(self.dataArray).forEach(function(d){
			var index = parseInt(d);
			var val = Math.max((self.dataArray[d] + 200)*2/3, 0).toFixed(0);
			curr_data.channels[index] = val;
			//tmp_html += "<div class='audio-line'><div class='audio-bar' style='width:"+val+"%;'>"+d+": "+val+"</div></div>";
		});
		
		
		curr_data.channels.forEach(function(channel, index){
			if(index > 7){
				curr_data.left += channel-self.prev_data.channels[index];
			}
			else if(index > 4){
				curr_data.middle += channel-self.prev_data.channels[index];
			}
			else{
				curr_data.right+= channel-self.prev_data.channels[index];
			}
			if(curr_data.channels[0] > 0){
				var val = (100 * (channel / curr_data.channels[0])).toFixed(0);
				tmp_html += "<div class='audio-line'><div class='audio-bar' style='width:"+val+"%;'>"+index+": "+val+"</div></div>";
			}
		});
		/*
		if(curr_data.left > 15){
			test_track.add_note(new Note());
		}
		if(curr_data.middle > 12){
			test_track_2.add_note(new Note());
		}
		if(Math.abs(curr_data.right) > 10){
			test_track_3.add_note(new Note());
		}*/
		test_track.add_note(new Note());
		
		self.prev_data.channels = curr_data.channels;
		
		$('#audio-content').html(tmp_html);
		
		var now = new Date();
		var tmp_offset = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 
					now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds()+5) - now;
		
		setTimeout(function(){self.analyze();}, tmp_offset);
};

var now = new Date();
var tmp_offset = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds()+1, 0) - now;

setTimeout(function(){new AudioManager("./assets/audio/in_paris.mp3");}, tmp_offset);


///////////////////////
///////////////////////
///////////////////////
///////////////////////
///////////////////////
///////////////////////
///////////////////////
///////////////////////


function togglePlayback() {
    sourceNode = context.createBufferSource();
    sourceNode.buffer = theBuffer;

    analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    sourceNode.connect( analyser );
    analyser.connect( context.destination );
    sourceNode.start( 0 );
    updatePitch();
}

var buffer_length = 1024;
var buf = new Float32Array( buffer_length );

var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function noteFromPitch( frequency ) {
	var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
	return Math.round( noteNum ) + 69;
}

function frequencyFromNoteNumber( note ) {
	return 440 * Math.pow(2,(note-69)/12);
}

function centsOffFromPitch( frequency, note ) {
	return Math.floor( 1200 * Math.log( frequency / frequencyFromNoteNumber( note ))/Math.log(2) );
}

function autoCorrelate( buf, sampleRate ) {
	var SIZE = buf.length;
	var MAX_SAMPLES = Math.floor(SIZE/2);
	var best_offset = -1;
	var best_correlation = 0;
	var rms = 0;
	var foundGoodCorrelation = false;
	var correlations = new Array(MAX_SAMPLES);

	for (var i=0;i<SIZE;i++) {
		var val = buf[i];
		rms += val*val;
	}
	rms = Math.sqrt(rms/SIZE);
	if (rms<0.01) // not enough signal
		return -1;

	var previous_correlation=1;
	for (var offset = 0; offset < MAX_SAMPLES; offset++) {
		var correlation = 0;

		for (var i=0; i<MAX_SAMPLES; i++) {
			correlation += Math.abs((buf[i])-(buf[i+offset]));
		}
		correlation = 1 - (correlation/MAX_SAMPLES);
		correlations[offset] = correlation; // store it, for the tweaking we need to do below.
		if ((correlation>0.9) && (correlation > previous_correlation)) {
			foundGoodCorrelation = true;
			if (correlation > best_correlation) {
				best_correlation = correlation;
				best_offset = offset;
			}
		} else if (foundGoodCorrelation) {
			var shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset];  
			return sampleRate/(best_offset+(8*shift));
		}
		previous_correlation = correlation;
	}
	if (best_correlation > 0.01) {
		return sampleRate/best_offset;
	}
	return -1;
}

function updatePitch( time ) {
	analyser.getFloatTimeDomainData( buf );
	var ac = autoCorrelate( buf, context.sampleRate );
	
 	if (ac != -1) {
	 	detectorElem.className = "confident";
	 	pitch = ac;
	 	pitchElem.innerHTML = Math.round( pitch ) ;
	 	var note =  noteFromPitch( pitch );
		noteElem.innerHTML = noteStrings[note%12];
		var detune = centsOffFromPitch( pitch, note );
		if (detune == 0 ) {
			detuneElem.className = "";
			detuneAmount.innerHTML = "--";
		} else {
			if (detune < 0)
				detuneElem.className = "flat";
			else
				detuneElem.className = "sharp";
			detuneAmount.innerHTML = Math.abs( detune );
		}
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = window.webkitRequestAnimationFrame;
	window.requestAnimationFrame( updatePitch );
}