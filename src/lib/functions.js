var elem = document.documentElement;
var synth = window.speechSynthesis;
var voice = null;

var initVoice = () => {
    var voices = speechSynthesis.getVoices();
    if (voices.length !== 0) {
        voice = voices.filter(voice => voice.lang === 'en-US' || voice.lang === 'en_US')[0];
    } else {
        setInterval(initVoice, 100);
    }
};
initVoice();

export let sayPhrase = (text, volume) => {
    if (voice) {
        var utterThis = new SpeechSynthesisUtterance(text);
        utterThis.voice = voice;
        utterThis.volume = volume;
        synth.speak(utterThis);
    }
}

export let openFullscreen = () => {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

export let closeFullscreen = () => {
    if (document.fullscreenElement === null) {
        return;
    }
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}