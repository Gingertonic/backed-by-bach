// Create an audio context (allow for legacy browsers)
let audioContext
let volume
let root
let third
let fifth
let seventh
let notes = [root, third, fifth, seventh]

window.onload = function() {
  document.getElementById('bob').addEventListener('click', function() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
   
    volume = audioContext.createGain()
    volume.connect(audioContext.destination)
    volume.gain.value = 0.2

    createChord()
  });

  document.getElementById('root').addEventListener('change', updateRoot)
}


const createChord = () => {
    notes.forEach(createNote)
  }

 const createNote = f => {
    var sine = audioContext.createOscillator();
    sine.frequency.value = f
    sine.type = "sine"
    sine.start();
    sine.connect(volume);
  } 

const updateRoot = e => {
    console.log(e.target.value)
    root = e.target.value
    createChord()
}