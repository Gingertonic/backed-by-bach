// Create an audio context (allow for legacy browsers)
let audioContext
let masterVolume
let playback
let chords = {
    "first": {
        notes: [
            {name: "root", f: 440, v: 0.4, ch: null},
            {name: "third", f: 550, v: 0.2, ch: null},
            {name: "fifth", f: 660, v: 0.3, ch: null},
            {name: "seventh", f: 770, v: 0.1, ch: null}
        ],
        gain: 0,
        volChannel: null
    },
    "second": {
        notes: [
            {name: "root", f: 220, v: 0.4, ch: null},
            {name: "third", f: 330, v: 0.2, ch: null},
            {name: "fifth", f: 440, v: 0.3, ch: null},
            {name: "seventh", f: 550, v: 0.1, ch: null}
        ],
        gain: 0,
        volChannel: null
    },
    "third": {
        notes: [
            {name: "root", f: 330, v: 0.4, ch: null},
            {name: "third", f: 440, v: 0.2, ch: null},
            {name: "fifth", f: 550, v: 0.3, ch: null},
            {name: "seventh", f: 660, v: 0.1, ch: null}
        ],
        gain: 0,
        volChannel: null
    },
    "fourth": {
        notes: [
            {name: "root", f: 330, v: 0.4, ch: null},
            {name: "third", f: 440, v: 0.2, ch: null},
            {name: "fifth", f: 550, v: 0.3, ch: null},
            {name: "seventh", f: 660, v: 0.1, ch: null}
        ],
        gain: 0,
        volChannel: null
    }
}

let state = {
    current: null
}

window.onload = function() {
  document.getElementById('toggle').addEventListener('click', setupStudio);
  document.getElementById('play').addEventListener('click', startPlayback);
  document.querySelectorAll('.chord-slider .slider').forEach(slider => slider.addEventListener('change', updateNote))
  document.querySelector('#master').addEventListener('change', updateMasterVolume)
}

const createChords = () => {
    for (let ch in chords){createNotes(ch)}
  }

  const createNotes = (chord) => {
      chords[chord].notes.forEach(n => createNote(n, chord))
  }

 const createNote = (n, chord) => {
    var sine = audioContext.createOscillator();
    sine.frequency.value = n.f 
    sine.type = "sine"
    sine.start();
    sine.connect(chords[chord].volChannel);
    n.ch = sine
  } 

const updateNote = e => {
    let chord = chords[e.currentTarget.parentNode.id]
    note = chord.notes.find(n => n.name == e.target.id)
    note.ch.frequency.value = parseInt(e.target.value)
}

const setupStudio = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
   
    masterVolume = audioContext.createGain()
    masterVolume.gain.value = 0.2

    for(let ch in chords){
        chords[ch].volChannel = audioContext.createGain()
        chords[ch].volChannel.gain = chords[ch].gain
        chords[ch].volChannel.connect(masterVolume)
    }

    createChords() 
}

const startPlayback = () => {
    playback = setInterval(playSequence, 1000)
    masterVolume.connect(audioContext.destination)
}

const playSequence = () => {
    switch(state.current){
        case "first": 
            state.current = "second"; break;
        case "second":
            state.current = "third"; break;
        case "third":
            state.current = "fourth"; break;
        case "fourth":
            masterVolume.disconnect();
            clearInterval(playback); state.current = null; break;
        default: state.current = "first"; break;
    }
    for(let ch in chords){playChord(ch)}
}

const playChord = ch => { 
    chords[ch].gain = (state.current === ch ? 0.1 : 0)
    chords[ch].volChannel.gain.value = chords[ch].gain 
}

const updateMasterVolume = e => {
    masterVolume.gain.value = (parseInt(e.target.value)/100)
}