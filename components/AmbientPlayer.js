import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './AmbientPlayer.module.css'

const MOODS = [
  {
    id: 'morning',
    label: 'Morning Flow',
    icon: '🌸',
    desc: 'Soft & uplifting',
    root: 261.63, // C4
    intervals: [1, 1.25, 1.5, 1.667, 2],
    reverbWet: 0.6,
    tempo: 0.18,
  },
  {
    id: 'calm',
    label: 'Deep Calm',
    icon: '🌿',
    desc: 'Grounding & slow',
    root: 220, // A3
    intervals: [1, 1.125, 1.333, 1.5, 1.778],
    reverbWet: 0.75,
    tempo: 0.1,
  },
  {
    id: 'focus',
    label: 'Focus',
    icon: '✦',
    desc: 'Clear & steady',
    root: 293.66, // D4
    intervals: [1, 1.2, 1.5, 1.8, 2],
    reverbWet: 0.5,
    tempo: 0.22,
  },
  {
    id: 'restore',
    label: 'Restore',
    icon: '🌙',
    desc: 'Dreamy & soft',
    root: 174.61, // F3
    intervals: [1, 1.25, 1.5, 1.667, 1.875],
    reverbWet: 0.85,
    tempo: 0.08,
  },
]

function createReverb(ctx, seconds = 3, decay = 2) {
  const convolver = ctx.createConvolver()
  const rate = ctx.sampleRate
  const length = rate * seconds
  const impulse = ctx.createBuffer(2, length, rate)
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch)
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay)
    }
  }
  convolver.buffer = impulse
  return convolver
}

export default function AmbientPlayer() {
  const [playing, setPlaying] = useState(false)
  const [mood, setMood] = useState(MOODS[0])
  const [volume, setVolume] = useState(0.4)
  const [expanded, setExpanded] = useState(false)

  const ctxRef = useRef(null)
  const masterRef = useRef(null)
  const reverbRef = useRef(null)
  const intervalsRef = useRef([])
  const volumeRef = useRef(volume)

  useEffect(() => { volumeRef.current = volume }, [volume])

  const stopAll = useCallback(() => {
    intervalsRef.current.forEach(clearInterval)
    intervalsRef.current = []
    if (masterRef.current) {
      try { masterRef.current.gain.setTargetAtTime(0, ctxRef.current.currentTime, 0.5) } catch {}
    }
    setTimeout(() => {
      try { if (ctxRef.current) ctxRef.current.close() } catch {}
      ctxRef.current = null
      masterRef.current = null
      reverbRef.current = null
    }, 600)
  }, [])

  const playTone = useCallback((freq, duration, startTime, ctx, dest, gain = 0.12) => {
    const osc = ctx.createOscillator()
    const env = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    env.gain.setValueAtTime(0, startTime)
    env.gain.linearRampToValueAtTime(gain, startTime + duration * 0.2)
    env.gain.setTargetAtTime(0, startTime + duration * 0.6, duration * 0.15)
    osc.connect(env)
    env.connect(dest)
    osc.start(startTime)
    osc.stop(startTime + duration + 0.5)
  }, [])

  const startAmbient = useCallback((selectedMood) => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    ctxRef.current = ctx

    const master = ctx.createGain()
    master.gain.setValueAtTime(0, ctx.currentTime)
    master.gain.linearRampToValueAtTime(volumeRef.current, ctx.currentTime + 1.5)
    masterRef.current = master

    const reverb = createReverb(ctx, 4, 2.5)
    reverbRef.current = reverb

    const dryGain = ctx.createGain()
    dryGain.gain.value = 1 - selectedMood.reverbWet
    const wetGain = ctx.createGain()
    wetGain.gain.value = selectedMood.reverbWet

    master.connect(dryGain)
    master.connect(reverb)
    reverb.connect(wetGain)
    dryGain.connect(ctx.destination)
    wetGain.connect(ctx.destination)

    // Low drone
    const drone = ctx.createOscillator()
    const droneGain = ctx.createGain()
    drone.type = 'sine'
    drone.frequency.value = selectedMood.root * 0.5
    droneGain.gain.value = 0.06
    drone.connect(droneGain)
    droneGain.connect(master)
    drone.start()

    // Slow LFO wobble on drone
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.value = 0.07
    lfoGain.gain.value = selectedMood.root * 0.003
    lfo.connect(lfoGain)
    lfoGain.connect(drone.frequency)
    lfo.start()

    // Melodic note scheduler
    let noteIndex = 0
    const schedule = () => {
      const now = ctx.currentTime
      const noteDuration = 3.5 + Math.random() * 3
      const freqIdx = noteIndex % selectedMood.intervals.length
      const octave = Math.random() > 0.7 ? 2 : 1
      const freq = selectedMood.root * selectedMood.intervals[freqIdx] * octave
      playTone(freq, noteDuration, now, ctx, master, 0.08 + Math.random() * 0.04)

      // Occasional soft harmony
      if (Math.random() > 0.55) {
        const harmonyFreq = selectedMood.root * selectedMood.intervals[(freqIdx + 2) % selectedMood.intervals.length]
        playTone(harmonyFreq, noteDuration * 0.8, now + 0.3, ctx, master, 0.04)
      }

      noteIndex++
    }

    schedule()
    const intervalMs = (1 / selectedMood.tempo) * 1000
    const id = setInterval(schedule, intervalMs)
    intervalsRef.current.push(id)
  }, [playTone])

  const toggle = () => {
    if (playing) {
      stopAll()
      setPlaying(false)
    } else {
      startAmbient(mood)
      setPlaying(true)
    }
  }

  const changeMood = (newMood) => {
    setMood(newMood)
    if (playing) {
      stopAll()
      setTimeout(() => startAmbient(newMood), 700)
    }
  }

  const handleVolume = (e) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (masterRef.current && ctxRef.current) {
      masterRef.current.gain.setTargetAtTime(v, ctxRef.current.currentTime, 0.1)
    }
  }

  useEffect(() => () => stopAll(), [stopAll])

  return (
    <div className={`${styles.player} ${expanded ? styles.expanded : ''}`}>
      <div className={styles.bar}>
        <button className={`${styles.playBtn} ${playing ? styles.playing : ''}`} onClick={toggle} aria-label={playing ? 'Pause music' : 'Play music'}>
          {playing ? (
            <span className={styles.pauseIcon}>
              <span /><span />
            </span>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path d="M3 2l9 5-9 5z"/>
            </svg>
          )}
        </button>

        <div className={styles.info}>
          <span className={styles.moodIcon}>{mood.icon}</span>
          <div>
            <span className={styles.moodLabel}>{mood.label}</span>
            {playing && <span className={styles.nowPlaying}> · playing</span>}
          </div>
        </div>

        <button className={styles.expandBtn} onClick={() => setExpanded(e => !e)} aria-label="Expand player">
          {expanded ? '▾' : '▸'}
        </button>
      </div>

      {expanded && (
        <div className={styles.drawer}>
          <div className={styles.moods}>
            {MOODS.map(m => (
              <button
                key={m.id}
                className={`${styles.moodBtn} ${mood.id === m.id ? styles.moodActive : ''}`}
                onClick={() => changeMood(m)}
              >
                <span className={styles.moodBtnIcon}>{m.icon}</span>
                <span className={styles.moodBtnLabel}>{m.label}</span>
                <span className={styles.moodBtnDesc}>{m.desc}</span>
              </button>
            ))}
          </div>

          <div className={styles.volumeRow}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolume}
              className={styles.volSlider}
              aria-label="Volume"
            />
            <span className={styles.volVal}>{Math.round(volume * 100)}%</span>
          </div>

          {playing && (
            <div className={styles.visualiser}>
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className={styles.bar2} style={{ animationDelay: `${i * 0.13}s` }} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
