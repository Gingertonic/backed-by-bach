// Create an audio context (allow for legacy browsers)
let audioContext
let masterVolume
let ch1Vol
let ch2Vol
let ch3Vol
let ch4Vol
let playback
let chords = {
    "first": {
        notes: [
            {name: "root", f: 440, v: 0.4, ch: null},
            {name: "third", f: 550, v: 0.2, ch: null},
            {name: "fifth", f: 660, v: 0.3, ch: null},
            {name: "seventh", f: 770, v: 0.1, ch: null}
        ],
        gain: 0.2,
        volChannel: ch1Vol
    },
    "second": {
        notes: [
            {name: "root", f: 220, v: 0.4, ch: null},
            {name: "third", f: 330, v: 0.2, ch: null},
            {name: "fifth", f: 440, v: 0.3, ch: null},
            {name: "seventh", f: 550, v: 0.1, ch: null}
        ],
        gain: 0,
        volChannel: ch2Vol
    },
    "third": {
        notes: [
            {name: "root", f: 330, v: 0.4, ch: null},
            {name: "third", f: 440, v: 0.2, ch: null},
            {name: "fifth", f: 550, v: 0.3, ch: null},
            {name: "seventh", f: 660, v: 0.1, ch: null}
        ],
        gain: 0,
        volChannel: ch3Vol
    },
    "fourth": {
        notes: [
            {name: "root", f: 330, v: 0.4, ch: null},
            {name: "third", f: 440, v: 0.2, ch: null},
            {name: "fifth", f: 550, v: 0.3, ch: null},
            {name: "seventh", f: 660, v: 0.1, ch: null}
        ],
        gain: 0,
        volChannel: ch4Vol
    }
}

let state = {
    current: "first"
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
    let channel
    switch(chord) {
        case "first": channel = chords["first"].volChannel; break;
        case "second": channel = ch2Vol; break;
        case "third": channel = ch3Vol; break;
        case "fourth": channel = ch4Vol; break;
    }
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

    chords["first"].volChannel = audioContext.createGain()
    ch2Vol = audioContext.createGain()
    ch3Vol = audioContext.createGain()
    ch4Vol = audioContext.createGain()
    
    chords["first"].volChannel.gain = chords["first"].gain 
    ch2Vol.gain.value = chords["second"].gain
    ch3Vol.gain.value = chords["third"].gain
    ch4Vol.gain.value = chords["fourth"].gain
    masterVolume.gain.value = 0.2

    chords["first"].volChannel.connect(masterVolume)
    ch2Vol.connect(masterVolume)
    ch3Vol.connect(masterVolume)
    ch4Vol.connect(masterVolume)
 
    masterVolume.connect(audioContext.destination)

    createChords() 
    startPlayback()
}

const startPlayback = () => {
    masterVolume.connect(audioContext.destination)
    state.current = "first"
    playback = setInterval(playSequence, 1000)
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
            clearInterval(playback)
            masterVolume.disconnect(); break;
        default: null
    }
    console.log("playing")
    for(let ch in chords){playChord(ch)}
    // playC1()
//     playC2()
//     playC3()
//     playC4()
}

const playChord = ch => { 
    // debugger
    chords[ch].gain = (state.current === ch ? 0.1 : 0)
    chords[ch].volChannel.gain.value = chords[ch].gain 
}

// const playC2 = () => { 
//     chords["second"].gain = (state.current === "second" ? 0.1 : 0)
//     ch2Vol.gain.value = chords["second"].gain 
// }

// const playC3 = () => { 
//     chords["third"].gain = (state.current === "third" ? 0.1 : 0)
//     ch3Vol.gain.value = chords["third"].gain 
// }

// const playC4 = () => { 
//     chords["fourth"].gain = (state.current === "fourth" ? 0.1 : 0)
//     ch4Vol.gain.value = chords["fourth"].gain 
// }

const updateMasterVolume = e => {
    masterVolume.gain.value = (parseInt(e.target.value)/100)
}