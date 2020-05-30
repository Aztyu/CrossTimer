var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Utile pour le contrôle du volume
var gainNode = audioCtx.createGain();
gainNode.connect(audioCtx.destination);

var beepCourtBuffer = null;
var beepLongBuffer = null;

function loadSound(fileName, callback) {
    var request = new XMLHttpRequest();
    request.open( 'GET', fileName, true );
    request.responseType = 'arraybuffer';
    request.onload = () => {
        var audioData = request.response;
        audioCtx.decodeAudioData(audioData, (buffer) => {
            callback(buffer);
        },
        (e) => { console.log("Error with decoding audio data" + e.err); });
    }
    request.send();
}

function playSound(buffer) {
    var sound = audioCtx.createBufferSource();
    sound.buffer = buffer;
    sound.connect(gainNode);
    sound.start(0);
}

loadSound('sound/beepcourt.mp3', (sound) => { beepCourtBuffer = sound });
loadSound('sound/beeplong.mp3', (sound) => { beepLongBuffer = sound });

export let updateGain = (volume) => {
    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
}

export let playBeepCourt = () => {
    playSound(beepCourtBuffer);
}

export let playBeepLong = () => {
    playSound(beepLongBuffer);
}