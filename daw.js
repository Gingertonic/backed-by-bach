// Create an audio context (allow for legacy browsers)
let audioContext
let masterVolume
let ch1Vol
let ch2Vol
let chords = {
    "first": {
        notes: [
            {name: "root", f: 440, v: 0.4, ch: null},
            {name: "third", f: 550, v: 0.2, ch: null},
            {name: "fifth", f: 660, v: 0.3, ch: null},
            {name: "seventh", f: 770, v: 0.1, ch: null}
        ],
        gain: 0.05
    },
    "second": {
        notes: [
            {name: "root", f: 220, v: 0.4, ch: null},
            {name: "third", f: 330, v: 0.2, ch: null},
            {name: "fifth", f: 440, v: 0.3, ch: null},
            {name: "seventh", f: 550, v: 0.1, ch: null}
        ],
        gain: 0
    }
}

window.onload = function() {
  document.getElementById('bob').addEventListener('click', setupStudio);
  document.querySelectorAll('.slider').forEach(slider => slider.addEventListener('change', updateNote))
}

const createChords = () => {
    for (let ch in chords){
        createNotes(ch)
    }
  }

  const createNotes = (chord) => {
      chords[chord].notes.forEach(n => createNote(n, chord))
  }

 const createNote = (n, chord) => {
    var sine = audioContext.createOscillator();
    sine.frequency.value = n.f 
    sine.type = "sine"
    sine.start();
    let channel = chord === "first" ? ch1Vol : ch2Vol
    sine.connect(channel);
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
    ch1Vol = audioContext.createGain()
    ch2Vol = audioContext.createGain()
    
    ch1Vol.gain.value = chords["first"].gain 
    ch2Vol.gain.value = chords["second"].gain
    masterVolume.gain.value = 0.2

    ch1Vol.connect(masterVolume)
    ch2Vol.connect(masterVolume)
 
    masterVolume.connect(audioContext.destination)

    createChords()

    setInterval(playback, 1000)
}

const playback = () => {
    playC1()
    playC2()
}

const playC1 = () => { 
    chords["first"].gain = (chords["first"].gain === 0 ? 0.1 : 0)
    ch1Vol.gain.value = chords["first"].gain 
}

const playC2 = () => { 
    chords["second"].gain = (chords["second"].gain === 0 ? 0.1 : 0)
    ch2Vol.gain.value = chords["second"].gain 
}