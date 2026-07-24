import { create } from 'zustand';
import { playBalloonPopSound, playKeyClickSound, playWinFanfare, playPowerUpSound } from '../audio/SoundSynthesizer.js';
import { SINGLE_LETTERS, KIDS_WORDS } from './words.js';

const BALLOON_COLORS = [
  '#ff0055', '#00b4d8', '#00ff88', '#ff9e00', 
  '#b026ff', '#ff206e', '#7b2cbf', '#ffff00'
];

const SOUND_THEMES = ['synth', 'piano', 'laser', 'water'];

let nextBalloonId = 1;
let nextBurstId = 1;

export const useTypingGameStore = create((set, get) => ({
  gameState: 'menu', // 'menu', 'playing', 'gameover'
  lives: 3,
  mode: 'letters', // 'letters' or 'words'
  capsLock: true,  // true = uppercase, false = lowercase
  isPaused: false, // true = paused (`cntl + enter toggle`)
  
  // Progression & DB State
  currentLevel: 1,
  totalScore: 0,
  highestCombo: 0,
  unlockedThemes: [],
  shakeTime: 0,

  triggerShake: () => set({ shakeTime: Date.now() }),

  loadProgress: async () => {
    if (window.electronAPI && window.electronAPI.db) {
      try {
        const data = await window.electronAPI.db.getProgress();
        if (data) {
          set((state) => ({
            currentLevel: data.currentLevel || 1,
            totalScore: data.totalScore || 0,
            highestCombo: data.highestCombo || 0,
            unlockedThemes: data.unlockedThemes ? JSON.parse(data.unlockedThemes) : []
          }));
        }
      } catch (err) {
        console.error("Failed to load progress from DB", err);
      }
    }
  },

  saveProgress: async () => {
    if (window.electronAPI && window.electronAPI.db) {
      const s = get();
      try {
        await window.electronAPI.db.saveProgress({
          currentLevel: s.currentLevel,
          totalScore: s.totalScore,
          highestCombo: s.highestCombo,
          unlockedThemes: s.unlockedThemes
        });
      } catch (err) {
        console.error("Failed to save progress to DB", err);
      }
    }
  },

  startGame: () => set({
    gameState: 'playing',
    isPaused: false,
    score: 0,
    streak: 0,
    maxStreak: 0,
    lives: 3,
    nextBossScore: 1000,
    balloons: [],
    bursts: [],
    lasers: [],
    activeTargetId: null,
    typedIndex: 0
  }),

  gameOver: () => {
    const s = get();
    set({
      gameState: 'gameover',
      isPaused: true,
      totalScore: s.totalScore + s.score,
      highestCombo: Math.max(s.highestCombo, s.maxStreak)
    });
    get().saveProgress();
  },
  
  // Feature 1: Sound Packs (`synth`, `piano`, `laser`, `water`)
  soundTheme: 'synth',
  cycleSoundTheme: () => {
    const currentIdx = SOUND_THEMES.indexOf(get().soundTheme);
    const nextTheme = SOUND_THEMES[(currentIdx + 1) % SOUND_THEMES.length];
    set({ soundTheme: nextTheme });
  },

  // Feature 2: Superpower states (`rainbow`, `freeze`, `starburst`)
  activePowerUp: null,
  powerUpEndTime: 0,

  // Feature 4: Meteor Storm Rush Mode
  gameStyle: 'normal', // 'normal' or 'rush'
  rushTimeLeft: 60,
  rushActive: false,
  toggleRushMode: () => {
    const current = get().gameStyle;
    if (current === 'normal') {
      set({
        gameStyle: 'rush',
        rushTimeLeft: 60,
        rushActive: true,
        balloons: [],
        streak: 0
      });
    } else {
      set({
        gameStyle: 'normal',
        rushActive: false,
        balloons: []
      });
    }
  },

  // Feature 5: Achievement Stats
  totalWordsTyped: 0,
  maxCombo: 0,
  powerUpsCollected: 0,
  rushCompleted: 0,
  showBadgesModal: false,
  toggleBadgesModal: () => set((s) => ({ showBadgesModal: !s.showBadgesModal })),

  score: 0,
  streak: 0,
  highScore: 0,
  balloons: [],
  bursts: [],
  activeKey: null,
  activeKeyTime: 0,
  activeTargetId: null, // Tracks the currently focused balloon in words mode

  togglePaused: () => {
    set((state) => ({ isPaused: !state.isPaused }));
  },

  setPaused: (paused) => {
    set({ isPaused: Boolean(paused) });
  },

  toggleCapsLock: () => {
    const newCaps = !get().capsLock;
    set({
      capsLock: newCaps,
      balloons: get().balloons.map((b) => ({
        ...b,
        text: newCaps ? b.text.toUpperCase() : b.text.toLowerCase()
      }))
    });
  },

  setCapsLock: (isCaps) => {
    if (get().capsLock !== isCaps) {
      set({
        capsLock: isCaps,
        balloons: get().balloons.map((b) => ({
          ...b,
          text: isCaps ? b.text.toUpperCase() : b.text.toLowerCase()
        }))
      });
    }
  },

  setMode: (mode) => {
    set({
      mode,
      score: 0,
      streak: 0,
      balloons: [],
      activeTargetId: null
    });
  },

  setActiveKey: (key) => {
    const char = (key || '').toUpperCase();
    set({ activeKey: char, activeKeyTime: Date.now() });
    setTimeout(() => {
      if (get().activeKey === char && Date.now() - get().activeKeyTime >= 150) {
        set({ activeKey: null });
      }
    }, 180);
  },

  spawnBalloon: () => {
    const state = get();
    // Only spawn balloons if playing
    if (state.isPaused || state.gameState !== 'playing') return;
    
    // Difficulty Scaling: Increase max balloons on screen based on score
    const scoreBonus = Math.floor(state.score / 300);
    const maxBalloons = (state.mode === 'letters' ? 8 : 5) + scoreBonus;
    // Cap it at a maximum to prevent chaos
    const absoluteMax = state.mode === 'letters' ? 14 : 9;
    if (state.balloons.length >= Math.min(maxBalloons, absoluteMax)) return;

    let bestX = null;
    let bestZ = null;
    const minSpawnDist = state.mode === 'letters' ? 2.1 : 2.6;

    for (let attempt = 0; attempt < 20; attempt++) {
      const candX = (Math.random() - 0.5) * 8.6;
      const candZ = (Math.random() - 0.5) * 1.5 - 0.2;
      
      const hasOverlap = state.balloons.some((b) => {
        const dist = Math.hypot(candX - b.position[0], candZ - b.position[2]);
        return dist < minSpawnDist;
      });

      if (!hasOverlap) {
        bestX = candX;
        bestZ = candZ;
        break;
      }
    }

    if (bestX === null) return;

    const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
    
    // Boss Balloon Logic
    let isBoss = false;
    if (state.score >= (state.nextBossScore || 1000)) {
      isBoss = true;
      // Increment by 2500 so popping a Boss (500+ pts) doesn't instantly trigger another one
      set({ nextBossScore: (state.nextBossScore || 1000) + 2500 });
    }

    let text;
    if (state.mode === 'letters') {
      if (isBoss) {
        // Bosses in Letters mode are at most 2 letters!
        const twoLetterCombos = ['GO', 'NO', 'HI', 'UP', 'DO', 'ME', 'WE', 'HE', 'BE', 'AS', 'AT', 'BY', 'IN', 'IS', 'IT', 'OF', 'ON', 'OR', 'SO', 'TO'];
        text = twoLetterCombos[Math.floor(Math.random() * twoLetterCombos.length)];
      } else {
        text = SINGLE_LETTERS[Math.floor(Math.random() * SINGLE_LETTERS.length)];
      }
    } else {
      // Words mode
      // Remove giant words: normal words are 3-4 letters, bosses are also kept simple (max 4-5 letters).
      // The user requested: "remove the gaint words, 2 letters are going to max for the letters"
      const maxLen = isBoss ? 5 : 4;
      const wordsPool = KIDS_WORDS.filter(w => w.length <= maxLen);
      text = wordsPool[Math.floor(Math.random() * wordsPool.length)];
    }

    text = state.capsLock ? text.toUpperCase() : text.toLowerCase();

    // Determine if this bubble carries a Superpower (`18% chance`)
    let powerUpType = null;
    if (Math.random() < 0.18) {
      const r = Math.random();
      powerUpType = r < 0.36 ? 'rainbow' : r < 0.68 ? 'freeze' : 'starburst';
    }

    // Difficulty Scaling: Speed Multiplier
    // Every 500 points, balloons get 15% faster, capped at +100% speed
    const difficultySpeedMultiplier = Math.min(2.0, 1.0 + (state.score / 500) * 0.15);

    // Speed formula: if words mode or Boss, rise much slower so children have time to read/type. 
    let speed = (0.8 + Math.random() * 0.55) * (state.gameStyle === 'rush' ? 1.55 : 1.0) * difficultySpeedMultiplier;
    if (state.mode === 'words' || isBoss) {
      speed = (0.40 + Math.random() * 0.25) * (state.gameStyle === 'rush' ? 1.45 : 1.0) * difficultySpeedMultiplier;
    }
    // Bosses are massive and slow!
    if (isBoss) speed *= 0.6;

    const swaySpeed = 1.6 + Math.random() * 0.8;
    const swayAmount = 0.18 + Math.random() * 0.14;
    const swayPhase = Math.random() * Math.PI * 2;
    const FUN_GEOMETRIES = ['sphere', 'torus', 'icosahedron', 'capsule', 'cylinder'];
    // Randomize movement pattern based on current level!
    // Level 1: Default
    // Level 2+: Introduce fast meteors
    // Level 3+: Introduce zig-zag UFOs
    let movementPattern = 'default';
    const rand = Math.random();
    if (state.currentLevel >= 3 && rand < 0.2) {
      movementPattern = 'zigzag';
    } else if (state.currentLevel >= 2 && rand < 0.4) {
      movementPattern = 'meteor';
    }

    const newBalloon = {
      id: nextBalloonId++,
      text,
      position: [bestX, -3.5, bestZ],
      color,
      speed: speed * (movementPattern === 'meteor' ? 1.8 : 1.0),
      isBoss,
      powerUpType,
      typedIndex: 0,
      shapeType: state.mode === 'words' || isBoss ? 'word_capsule' : 'sphere',
      geometryShape: 'sphere',
      movementPattern,
      spawnX: bestX,
      swaySpeed: 1.6 + Math.random() * 0.8,
      swayAmount: 0.18 + Math.random() * 0.14,
      swayPhase: Math.random() * Math.PI * 2,
      scale: isBoss ? 0.60 : (state.mode === 'words' ? 0.65 : 0.45),
      spawnTime: Date.now()
    };

    set({ balloons: [...state.balloons, newBalloon] });
  },

  updateBalloons: (delta) => {
    const state = get();
    if (state.isPaused) return;

    const now = Date.now();
    // Check expiration of active powerup
    let currentPowerUp = state.activePowerUp;
    if (currentPowerUp && now > state.powerUpEndTime) {
      currentPowerUp = null;
    }

    // Update Rush Mode Timer
    let newRushTime = state.rushTimeLeft;
    let newRushActive = state.rushActive;
    let rushCompletedBonus = state.rushCompleted;

    if (state.gameStyle === 'rush' && state.rushActive) {
      newRushTime -= delta;
      if (newRushTime <= 0) {
        newRushTime = 0;
        newRushActive = false;
        rushCompletedBonus += 1;
        playWinFanfare();
      }
    }

    if (state.balloons.length === 0 && !currentPowerUp && newRushTime === state.rushTimeLeft) {
      if (currentPowerUp !== state.activePowerUp) {
        set({ activePowerUp: null });
      }
      return;
    }

    // Apply speed modifier if Freeze Time powerup is active (`0.4x speed`)
    const speedMultiplier = currentPowerUp === 'freeze' ? 0.4 : 1.0;

    const moved = [];
    const cloudBursts = [];
    let currentStreak = state.streak;
    let currentTargetId = state.activeTargetId;
    let livesLost = 0;
    
    state.balloons.forEach((b) => {
      const newY = b.position[1] + (b.speed * speedMultiplier) * delta;
      
      let newX = b.position[0];
      if (b.movementPattern === 'zigzag') {
        newX = b.spawnX + Math.sin(now * 0.003 + b.id) * 2.5; // Wobble back and forth
      }

      if (newY < 6.8) {
        moved.push({
          ...b,
          position: [newX, newY, b.position[2]]
        });
      } else {
        // Collided with the cloud! Spawn a burst of water bubbles!
        cloudBursts.push({
          id: nextBurstId++,
          position: [b.position[0], 6.8, b.position[2]],
          color: b.color,
          text: b.text,
          timestamp: now
        });
        currentStreak = 0; // Missed the balloon! Reset streak combo!
        livesLost += 1;
        if (currentTargetId === b.id) currentTargetId = null;
      }
    });

    // Elastic Collision Separation (`push them more` so letters never stick together!)
    const minSeparation = state.mode === 'letters' ? 1.95 : 2.35;
    for (let i = 0; i < moved.length; i++) {
      for (let j = i + 1; j < moved.length; j++) {
        const b1 = moved[i];
        const b2 = moved[j];

        const dx = b2.position[0] - b1.position[0];
        const dy = b2.position[1] - b1.position[1];
        const dz = b2.position[2] - b1.position[2];
        const dist = Math.hypot(dx, dy, dz);

        if (dist < minSeparation && dist > 0.001) {
          const overlap = (minSeparation - dist) * 0.8;
          const pushX = (dx / dist) * overlap * 1.4;
          const pushY = (dy / dist) * overlap * 0.7;
          const pushZ = (dz / dist) * overlap * 0.9;

          moved[i].position = [
            b1.position[0] - pushX,
            b1.position[1] - pushY,
            b1.position[2] - pushZ
          ];
          moved[j].position = [
            b2.position[0] + pushX,
            b2.position[1] + pushY,
            b2.position[2] + pushZ
          ];
        }
      }
    }

    const activeBursts = [...state.bursts.filter((br) => now - br.timestamp < 2500), ...cloudBursts];
    
    let newLives = state.lives - livesLost;
    if (newLives <= 0) {
      set({
        gameState: 'gameover',
        isPaused: true,
        lives: 0,
        balloons: moved,
        bursts: activeBursts,
        activeTargetId: currentTargetId
      });
      return;
    }

    set({
      balloons: moved,
      bursts: activeBursts,
      activePowerUp: currentPowerUp,
      rushTimeLeft: newRushTime,
      rushActive: newRushActive,
      rushCompleted: rushCompletedBonus,
      streak: currentStreak,
      lives: newLives,
      activeTargetId: currentTargetId
    });
  },

  updateBursts: () => {
    const now = Date.now();
    const currentBursts = get().bursts;
    if (currentBursts.length === 0) return;
    
    const nextBursts = currentBursts.filter((br) => now - br.timestamp < 2500);
    if (nextBursts.length !== currentBursts.length) {
      set({ bursts: nextBursts });
    }
  },

  finalizeBurst: (id) => {
    const state = get();
    const balloon = state.balloons.find(b => b.id === id);
    if (!balloon) return; // Already cleaned up or didn't exist
    
    set({
      balloons: state.balloons.filter(b => b.id !== id),
      bursts: [...state.bursts, {
        id: nextBurstId++,
        position: balloon.position,
        color: balloon.color,
        text: balloon.text,
        powerUpType: balloon.powerUpType,
        timestamp: Date.now()
      }]
    });
  },

  moveBalloonById: (id, newPos) => {
    const state = get();
    set({
      balloons: state.balloons.map((b) =>
        b.id === id ? { ...b, position: newPos } : b
      )
    });
  },

  burstBalloonById: (id) => {
    const state = get();
    const target = state.balloons.find((b) => b.id === id);
    if (!target) return;

    playBalloonPopSound();

    // If Rainbow double points active, multiply by 2 (`Rainbow Superpower`)
    let basePoints = (state.mode === 'words' || target.isBoss ? 50 : 15) + state.streak * 5;
    if (target.isBoss) basePoints += 500; // HUGE Boss Bonus!
    if (state.activePowerUp === 'rainbow' || target.powerUpType === 'rainbow') {
      basePoints *= 2;
    }

    const newScore = state.score + basePoints;
    const newStreak = state.streak + 1;
    const newMaxCombo = Math.max(state.maxCombo, newStreak);
    const newWordsTyped = state.totalWordsTyped + 1;
    
    // Level up every 15 words typed or 3000 points!
    let newLevel = state.currentLevel;
    if (newScore > newLevel * 2000) {
      newLevel += 1;
      playWinFanfare(); // Play a nice sound on level up
      state.triggerShake(); // Big screen shake for level up
      
      // Every 3 levels, unlock a random theme
      if (newLevel % 3 === 0) {
        const themeId = `theme${Math.floor(Math.random() * 10) + 11}`; // Unlock themes 11-20
        if (!state.unlockedThemes.includes(themeId)) {
          set({ unlockedThemes: [...state.unlockedThemes, themeId] });
          get().saveProgress();
        }
      }
    }

    // Boss kill shake
    if (target.isBoss) {
      state.triggerShake();
    }

    let newPowerUpsCollected = state.powerUpsCollected;
    let nextActivePowerUp = state.activePowerUp;
    let powerUpEndTime = state.powerUpEndTime;

    // Handle superpower trigger
    if (target.powerUpType) {
      newPowerUpsCollected += 1;
      playPowerUpSound();
      if (target.powerUpType === 'rainbow') {
        nextActivePowerUp = 'rainbow';
        powerUpEndTime = Date.now() + 15000;
      } else if (target.powerUpType === 'freeze') {
        nextActivePowerUp = 'freeze';
        powerUpEndTime = Date.now() + 10000;
      }
    }

    if (state.mode === 'words') {
      playWinFanfare();
    }
    
    // Shoot a standalone bullet from near the camera (Z=15) into the screen!
    import('./useBullet.js').then(({ useBullet }) => {
      useBullet.getState().fireBullet([0, 0, 15], [...target.position], target.color, id);
    });

    set({
      score: newScore,
      streak: newStreak,
      highScore: Math.max(state.highScore, newScore),
      maxCombo: newMaxCombo,
      totalWordsTyped: newWordsTyped,
      powerUpsCollected: newPowerUpsCollected,
      activePowerUp: nextActivePowerUp,
      powerUpEndTime,
      activeTargetId: state.activeTargetId === id ? null : state.activeTargetId,
      // Mark it as popped so the bullet can travel to it, but don't delete it or burst yet!
      balloons: state.balloons.map((b) => b.id === id ? { ...b, isPopped: true } : b)
    });
  },

  pressKey: (keyChar) => {
    if (!keyChar) return;
    const state = get();
    if (state.isPaused) return;

    if (keyChar === 'CapsLock' || keyChar.toLowerCase() === 'capslock') {
      state.toggleCapsLock();
      return;
    }

    if (keyChar === 'Backspace' || keyChar === 'Escape') {
      if (state.mode === 'words' && state.activeTargetId) {
        set({
          activeTargetId: null,
          balloons: state.balloons.map((b) => b.id === state.activeTargetId ? { ...b, typedIndex: 0 } : b)
        });
      }
      return;
    }

    if (keyChar.length !== 1) return;
    const char = keyChar.toUpperCase();

    // Prevent hardware chatter / gaming keyboard macros from firing the same key multiple times instantly!
    const now = Date.now();
    if (state.activeKey === char && now - state.activeKeyTime < 60) {
      return; // Ignore if the exact same key was pressed less than 60ms ago
    }

    state.setActiveKey(keyChar);
    playKeyClickSound(char);

    // Prioritize the HIGHEST balloon on the screen (the one closest to escaping)
    // Ignore popped balloons that are just waiting for their arrow to hit!
    const activeBalloons = state.balloons.filter(b => !b.isPopped);
    const sorted = activeBalloons.sort((a, b) => b.position[1] - a.position[1]);

    if (state.mode === 'letters') {
      // Support multi-letter strings in letters mode by checking the next untyped character
      const match = sorted.find((b) => b.text[b.typedIndex || 0].toUpperCase() === char);
      if (match) {
        if (match.text.length === 1) {
          state.burstBalloonById(match.id);
        } else {
          // Boss balloon or multi-letter word in letters mode
          const isComplete = match.typedIndex + 1 >= match.text.length;
          if (isComplete) {
            state.burstBalloonById(match.id);
          } else {
            playKeyClickSound(char);
            set({
              balloons: state.balloons.map(b => 
                b.id === match.id 
                  ? { ...b, typedIndex: b.typedIndex + 1 } 
                  : b
              ),
              score: state.score + 10,
              streak: state.streak + 1
            });
          }
        }
      }
    } else {
      let currentTargetId = state.activeTargetId;
      let targetBalloon = null;

      if (currentTargetId) {
        targetBalloon = sorted.find((b) => b.id === currentTargetId);
        if (!targetBalloon) {
          currentTargetId = null;
          set({ activeTargetId: null });
        }
      }

      // If no target, find a new one
      if (!targetBalloon) {
        targetBalloon = sorted.find((b) => b.text[0] && b.text[0].toUpperCase() === char);
        if (targetBalloon) {
          currentTargetId = targetBalloon.id;
          set({ activeTargetId: currentTargetId });
        }
      }

      if (targetBalloon) {
        if (targetBalloon.text[targetBalloon.typedIndex] && targetBalloon.text[targetBalloon.typedIndex].toUpperCase() === char) {
          const nextIdx = targetBalloon.typedIndex + 1;
          if (nextIdx >= targetBalloon.text.length) {
            state.burstBalloonById(targetBalloon.id);
            set({ activeTargetId: null });
          } else {
            playKeyClickSound(char);
            set({
              balloons: state.balloons.map((b) =>
                b.id === targetBalloon.id ? { ...b, typedIndex: nextIdx } : b
              ),
              score: state.score + 10,
              streak: state.streak + 1
            });
          }
        } else {
           // Wrong letter! Just ignore for now so we don't punish them too harshly.
        }
      }
    }
  },

  clickBalloon: (id) => {
    const state = get();
    if (state.isPaused) return;
    const target = state.balloons.find((b) => b.id === id);
    if (!target) return;

    if (state.mode === 'letters') {
      state.burstBalloonById(id);
    } else {
      const nextIdx = target.typedIndex + 1;
      if (nextIdx >= target.text.length) {
        state.burstBalloonById(id);
      } else {
        playKeyClickSound(target.text[target.typedIndex] || 'A');
        set({
          balloons: state.balloons.map((b) =>
            b.id === id ? { ...b, typedIndex: nextIdx } : b
          ),
          score: state.score + 10
        });
      }
    }
  }
}));
