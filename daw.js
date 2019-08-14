// Create an audio context (allow for legacy browsers)
let audioContext
let volume

// Existing code unchanged.
window.onload = function() {
  document.getElementById('bob').addEventListener('click', function() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
   
    volume = audioContext.createGain()
    volume.connect(audioContext.destination)
    volume.gain.value = 0.2

    createChord()
  });
}


const createChord = () => {
    notes = [440, 523.25, 698.46]
    notes.forEach(createNote)
  }

 const createNote = f => {
    var sine = audioContext.createOscillator();
    sine.frequency.value = f
    sine.type = "sine"
    sine.start();
    sine.connect(volume);
  } 