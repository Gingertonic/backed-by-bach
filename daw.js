// Create an audio context (allow for legacy browsers)
let audioContext
let masterVolume
let firstChord = [
    {name: "root", f: 440, v: 0.4, ch: null},
    {name: "third", f: 550, v: 0.2, ch: null},
    {name: "fifth", f: 660, v: 0.3, ch: null},
    {name: "seventh", f: 770, v: 0.1, ch: null}
]

// let root = 440
// let third = 550
// let fifth = 660
// let seventh = 770
// let notes = [root, third, fifth, seventh]

window.onload = function() {
  document.getElementById('bob').addEventListener('click', setupStudio);
  document.getElementById('root').addEventListener('change', updateRoot)
}


const createChord = () => {
    firstChord.forEach(createNote)
  }

 const createNote = n => {
    var sine = audioContext.createOscillator();
    sine.frequency.value = n.f 
    sine.type = "sine"
    sine.start();
    sine.connect(masterVolume);
    n.ch = sine
  } 

const updateRoot = e => {
    note = firstChord.find(n => n.name == e.target.id)
    note.ch.frequency.value = parseInt(e.target.value)
    // root.stop()
    // root.start()
    // createChord()
}

const setupStudio = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
   
    masterVolume = audioContext.createGain()
    masterVolume.connect(audioContext.destination)
    masterVolume.gain.value = 0.2

    createChord()
}