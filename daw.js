// Create an audio context (allow for legacy browsers)
let audioContext
let masterVolume
let chords = {
    "first": [
        {name: "root", f: 440, v: 0.4, ch: null},
        {name: "third", f: 550, v: 0.2, ch: null},
        {name: "fifth", f: 660, v: 0.3, ch: null},
        {name: "seventh", f: 770, v: 0.1, ch: null}
    ],
    "second": [
        {name: "root", f: 440, v: 0.4, ch: null},
        {name: "third", f: 550, v: 0.2, ch: null},
        {name: "fifth", f: 660, v: 0.3, ch: null},
        {name: "seventh", f: 770, v: 0.1, ch: null}
    ]
}

window.onload = function() {
  document.getElementById('bob').addEventListener('click', setupStudio);
  document.querySelectorAll('.slider').forEach(slider => slider.addEventListener('change', updateNote))
}

const createChord = () => {
    for (let ch in chords){
        chords[ch].forEach(createNote)
    }

    // chords.forEach((k,v) => v.forEach(createNote))
    // chords["first"].forEach(createNote)}
  }

 const createNote = n => {
    var sine = audioContext.createOscillator();
    sine.frequency.value = n.f 
    sine.type = "sine"
    sine.start();
    sine.connect(masterVolume);
    n.ch = sine
  } 

const updateNote = e => {
    let chord = chords[e.currentTarget.parentNode.id]
    note = chord.find(n => n.name == e.target.id)
    note.ch.frequency.value = parseInt(e.target.value)
}

const setupStudio = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
   
    masterVolume = audioContext.createGain()
    masterVolume.connect(audioContext.destination)
    masterVolume.gain.value = 0.2

    createChord()
}