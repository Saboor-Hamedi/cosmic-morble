import { create } from 'zustand';
import { playBalloonPopSound, playKeyClickSound, playWinFanfare, playPowerUpSound } from '../audio/SoundSynthesizer.js';

const SINGLE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const KIDS_WORDS = [
  // Animals & Creatures
  'CAT', 'DOG', 'SUN', 'STAR', 'MOON', 'JUMP', 'PLAY',
  'TREE', 'FISH', 'BIRD', 'LION', 'BEAR', 'CAKE', 'HAPPY', 'LOVE',
  'COOL', 'HERO', 'BLUE', 'RED', 'PINK', 'GOLD', 'FAST', 'FUN',
  'SHIP', 'ROBOT', 'APPLE', 'DUCK', 'FROG', 'MILK', 'PONY', 'ZOO',
  'TIGER', 'PANDA', 'KOALA', 'SHARK', 'WHALE', 'DOLPHIN', 'EAGLE', 'FALCON',
  'ZEBRA', 'GIRAFFE', 'MONKEY', 'RABBIT', 'TURTLE', 'PENGUIN', 'DRAGON', 'UNICORN',
  'DINOSAUR', 'BUTTERFLY', 'PUPPY', 'KITTEN', 'OTTER', 'SWAN', 'OCTOPUS', 'SEAL',
  'CHEETAH', 'LEOPARD', 'GORILLA', 'HAMSTER', 'PARROT', 'TOUCAN', 'IGUANA', 'CHAMELEON',
  'LADYBUG', 'FIREFLY', 'MANATEE', 'SEAHORSE', 'STARFISH', 'JELLYFISH', 'STINGRAY',
  // Space, Planets & Cosmic Adventure
  'SPACE', 'COMET', 'GALAXY', 'ORBIT', 'ASTRO', 'ALIEN', 'NEBULA', 'ROCKET',
  'PLANET', 'COSMIC', 'MERCURY', 'VENUS', 'EARTH', 'MARS', 'SATURN', 'JUPITER',
  'URANUS', 'NEPTUNE', 'PLUTO', 'METEOR', 'SOLAR', 'LUNAR', 'COSMOS', 'VOYAGE',
  'ASTRONAUT', 'SATELLITE', 'STARLIGHT', 'HORIZON', 'ECLIPSE', 'EQUINOX', 'POLARIS', 'CRATER',
  'GRAVITY', 'SHUTTLE', 'SKYLAB', 'STATION', 'QUASAR', 'PULSAR', 'SUPERNOVA', 'CLUSTER',
  // Nature, Elements & Science Wonders
  'OCEAN', 'RIVER', 'MOUNTAIN', 'RAINBOW', 'THUNDER', 'STORM', 'SUMMER', 'WINTER',
  'SPRING', 'AUTUMN', 'BREEZE', 'FLOWER', 'GARDEN', 'FOREST', 'ISLAND', 'SUNSET',
  'GEYSER', 'GLACIER', 'VOLCANO', 'CANYON', 'DESERT', 'JUNGLE', 'SAVANNAH', 'CORAL',
  'ATOM', 'LASER', 'MAGNET', 'FOSSIL', 'CRYSTAL', 'PRISM', 'ENERGY', 'LIGHT',
  'SOUND', 'MOTION', 'SCIENCE', 'WONDER', 'NATURE', 'WEATHER', 'CLOUD', 'BREEZY',
  // Adventure, Magic & Treats
  'MAGIC', 'CASTLE', 'TREASURE', 'PIRATE', 'KNIGHT', 'WIZARD', 'QUEEN', 'KING',
  'CROWN', 'DIAMOND', 'RUBY', 'PEARL', 'SPARKLE', 'CANDY', 'COOKIE',
  'PIZZA', 'ICECREAM', 'BANANA', 'ORANGE', 'BERRY', 'CHERRY', 'SUPER', 'CHAMP',
  'WINNER', 'ROCKSTAR', 'GAMES', 'PARTY', 'SMILE', 'FRIEND', 'GLOW', 'DREAM',
  'FLIGHT', 'SOAR', 'BRAVE', 'SHINE', 'CLEVER', 'GENIUS', 'PEACE', 'JOY',
  'DONUT', 'MUFFIN', 'WAFFLE', 'BURGER', 'NOODLE', 'MELON', 'PEACH', 'HONEY',
  'SUGAR', 'COCOA', 'SNACK', 'SWEET', 'YUMMY', 'DELIGHT', 'CELEBRATE',
  // Superpowers, Music & Action
  'POWER', 'ULTRA', 'HYPER', 'SONIC', 'BLITZ', 'MIGHTY', 'SHIELD', 'VALIANT',
  'GLORY', 'HEROIC', 'GUITAR', 'DRUM', 'PIANO', 'DANCE', 'SING', 'PAINT',
  'COLOR', 'RHYTHM', 'FLUTE', 'MELODY', 'HARMONY', 'CHORUS', 'VIOLIN', 'TRUMPET',
  'SPEED', 'ZOOM', 'DASH', 'SPRINT', 'LEAP', 'BOUND', 'CLIMB', 'EXPLORE',
  // ── Islamic Words ─────────────────────────────────────────────────────────
  // Five Pillars & Core Acts of Worship
  'ISLAM', 'IMAN', 'SALAH', 'ZAKAT', 'SAWM', 'HAJJ', 'WUDU', 'TAYAMMUM',
  'FAJR', 'DHUHR', 'ASR', 'MAGHRIB', 'ISHA', 'TAHAJJUD', 'WITR', 'SUNNAH',
  'FARD', 'NAFL', 'DHIKR', 'DUA', 'TAWBAH', 'TAWAKKUL', 'SABR', 'SHUKR',
  // Allah's Beautiful Names (Al-Asma ul-Husna)
  'ALLAH', 'RAHMAN', 'RAHIM', 'MALIK', 'QUDDUS', 'SALAM', 'MUMIN', 'AZIZ',
  'JABBAR', 'MUTAKABBIR', 'KHALIQ', 'BARI', 'MUSAWWIR', 'GHAFFAR', 'QAHHAAR',
  'WAHHAB', 'RAZZAQ', 'FATTAH', 'ALIM', 'QABID', 'BASIT', 'HAFIZ', 'MUQIT',
  'HASIB', 'JALIL', 'KARIM', 'RAQIB', 'MUJIB', 'WASI', 'HAKIM', 'WADUD',
  'MAJID', 'BAITH', 'SHAHID', 'HAQQ', 'WAKIL', 'QAWI', 'MATIN', 'WALI',
  'HAMID', 'MUHSI', 'MUBDI', 'MUID', 'MUHYI', 'MUMIT', 'HAYY', 'QAYYUM',
  'AHAD', 'SAMAD', 'QADIR', 'MUQTADIR', 'MUQADDIM', 'MUAKHKHIR', 'AWWAL',
  'AKHIR', 'ZAHIR', 'BATIN', 'WALI', 'MUTAALI', 'BARR', 'TAWWAB', 'MUNTAQIM',
  'AFUW', 'RAUF', 'MALIKUL', 'DHUL', 'NAFI', 'NUR', 'HADI', 'BADI',
  // Prophets of Allah (Peace be upon them)
  'ADAM', 'IDRIS', 'NUH', 'HUD', 'SALIH', 'IBRAHIM', 'ISMAIL', 'ISHAQ',
  'YAQUB', 'YUSUF', 'LUT', 'SHUAIB', 'MUSA', 'HARUN', 'DAWUD', 'SULAIMAN',
  'AYYUB', 'YUNUS', 'ILYAS', 'ALYASA', 'DHULKIFL', 'ZAKARIYYA', 'YAHYA',
  'ISA', 'MUHAMMAD',
  // Quran, Revelation & Islamic Knowledge
  'QURAN', 'SURAH', 'AYAH', 'TAFSIR', 'TAJWEED', 'TILAWAH', 'HIFDH', 'HAFIZ',
  'HADITH', 'SUNNAH', 'FIQH', 'AQIDAH', 'TAWHID', 'SHIRK', 'KUFR', 'TAQWA',
  'ILAM', 'FATWA', 'IJTIHAD', 'IJMA', 'QIYAS', 'USUL', 'MAQASID', 'SHARIA',
  // Sacred Places & History
  'MECCA', 'MEDINA', 'KAABA', 'MASJID', 'MOSQUE', 'MINARET', 'MIHRAB', 'MIMBAR',
  'MADINAH', 'BADR', 'UHUD', 'KHANDAQ', 'TABUK', 'HUNAYN', 'TAIF', 'JERUSALEM',
  'AQSA', 'DOME', 'ZAMZAM', 'ARAFAT', 'MINA', 'MUZDALIFAH', 'SAFA', 'MARWA',
  // Islamic Virtues & Character
  'ADAB', 'AKHLAQ', 'AMANAH', 'SIDQ', 'ADALAH', 'IHSAN', 'IKHLAS', 'BIRR',
  'TAWADU', 'HILM', 'AFUW', 'RAHMA', 'ADALA', 'HAYA', 'WAFA', 'UKHUWWAH',
  'AMANA', 'ZUHD', 'QANAAH', 'SHAJA', 'MURUWWAH', 'KARAM', 'INFAQ', 'SADAQAH',
  // Islamic Celebrations & Events
  'EID', 'RAMADAN', 'IFTAR', 'SUHOOR', 'LAYLAT', 'QADR', 'FITR', 'ADHA',
  'MUBARAK', 'HIJRA', 'ISRA', 'MIRAJ', 'ASHURA', 'DHULHIJJA', 'MUHARRAM',
  // Common Islamic Phrases (romanised)
  'BISMILLAH', 'ALHAMDULILLAH', 'SUBHANALLAH', 'ALLAHU', 'AKBAR', 'INSHALLAH',
  'MASHALLAH', 'ASTAGHFIRULLAH', 'ASSALAM', 'ALAYKUM', 'JAZAKALLAH', 'BARAKALLAH',
  'HAMDULILLAH', 'AMEEN', 'YARHAMUK', 'YARHAMUKALLAH',
];

const BALLOON_COLORS = [
  '#ff0055', '#00b4d8', '#00ff88', '#ff9e00', 
  '#b026ff', '#ff206e', '#7b2cbf', '#ffff00'
];

const SOUND_THEMES = ['synth', 'piano', 'laser', 'water'];

let nextBalloonId = 1;
let nextBurstId = 1;

export const useTypingGameStore = create((set, get) => ({
  mode: 'letters', // 'letters' or 'words'
  capsLock: true,  // true = uppercase, false = lowercase
  isPaused: false, // true = paused (`cntl + enter toggle`)
  
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
    if (state.isPaused) return;
    const maxBalloons = state.mode === 'letters' ? 8 : 5;
    if (state.balloons.length >= maxBalloons) return;

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
    let text = '';
    if (state.mode === 'letters') {
      text = SINGLE_LETTERS[Math.floor(Math.random() * SINGLE_LETTERS.length)];
    } else {
      text = KIDS_WORDS[Math.floor(Math.random() * KIDS_WORDS.length)];
    }

    text = state.capsLock ? text.toUpperCase() : text.toLowerCase();

    // Determine if this bubble carries a Superpower (`18% chance`)
    let powerUpType = null;
    if (Math.random() < 0.18) {
      const r = Math.random();
      powerUpType = r < 0.36 ? 'rainbow' : r < 0.68 ? 'freeze' : 'starburst';
    }

    // Speed formula: if words mode, make them rise much slower so children have time to read/type. If rush mode (`Meteor Storm`), rise faster.
    let speed = (0.8 + Math.random() * 0.55) * (state.gameStyle === 'rush' ? 1.55 : 1.0);
    if (state.mode === 'words') {
      speed = (0.40 + Math.random() * 0.25) * (state.gameStyle === 'rush' ? 1.45 : 1.0);
    }

    const swaySpeed = 1.6 + Math.random() * 0.8;
    const swayAmount = 0.18 + Math.random() * 0.14;
    const swayPhase = Math.random() * Math.PI * 2;

    const newBalloon = {
      id: nextBalloonId++,
      text,
      shapeType: state.mode === 'words' ? 'word_capsule' : 'sphere',
      typedIndex: 0,
      position: [bestX, -3.5, bestZ],
      speed,
      swaySpeed,
      swayAmount,
      swayPhase,
      scale: state.mode === 'words' ? 0.65 : 0.45,
      color,
      powerUpType
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
    state.balloons.forEach((b) => {
      const newY = b.position[1] + (b.speed * speedMultiplier) * delta;
      if (newY < 6.8) {
        moved.push({
          ...b,
          position: [b.position[0], newY, b.position[2]]
        });
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

    const activeBursts = state.bursts.filter((br) => now - br.timestamp < 1200);

    set({
      balloons: moved,
      bursts: activeBursts,
      activePowerUp: currentPowerUp,
      rushTimeLeft: newRushTime,
      rushActive: newRushActive,
      rushCompleted: rushCompletedBonus
    });
  },

  updateBursts: () => {
    const now = Date.now();
    set({
      bursts: get().bursts.filter((br) => now - br.timestamp < 600)
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

    let basePoints = (state.mode === 'words' ? 50 : 15) + state.streak * 5;
    // If Rainbow double points active, multiply by 2 (`Rainbow Superpower`)
    if (state.activePowerUp === 'rainbow' || target.powerUpType === 'rainbow') {
      basePoints *= 2;
    }

    let newScore = state.score + basePoints;
    const newStreak = state.streak + 1;
    const newMaxCombo = Math.max(state.maxCombo, newStreak);
    const newWordsTyped = state.totalWordsTyped + (state.mode === 'words' ? 1 : 0);
    let newPowerUpsCollected = state.powerUpsCollected;
    let nextActivePowerUp = state.activePowerUp;
    let nextPowerUpEndTime = state.powerUpEndTime;

    // Handle superpower trigger
    if (target.powerUpType) {
      newPowerUpsCollected += 1;
      playPowerUpSound();
      if (target.powerUpType === 'rainbow') {
        nextActivePowerUp = 'rainbow';
        nextPowerUpEndTime = Date.now() + 15000;
      } else if (target.powerUpType === 'freeze') {
        nextActivePowerUp = 'freeze';
        nextPowerUpEndTime = Date.now() + 10000;
      }
    }

    const newBurst = {
      id: nextBurstId++,
      position: [...target.position],
      color: target.color,
      text: target.text,
      timestamp: Date.now()
    };

    if (state.mode === 'words') {
      playWinFanfare();
    }

    let remainingBalloons = state.balloons.filter((b) => b.id !== id);
    let extraBursts = [newBurst];

    // If Starburst superpower triggered, we used to pop nearby bubbles, but this confused users who thought it was a bug where typing a single letter cleared the screen!
    // We will just grant extra score or play a big sound instead, leaving the other balloons alone.
    if (target.powerUpType === 'starburst') {
      newScore += 50; // Bonus points for starburst instead of popping everything!
    }

    set({
      balloons: remainingBalloons,
      bursts: [...state.bursts, ...extraBursts],
      score: newScore,
      streak: newStreak,
      highScore: Math.max(state.highScore, newScore),
      maxCombo: newMaxCombo,
      totalWordsTyped: newWordsTyped,
      powerUpsCollected: newPowerUpsCollected,
      activePowerUp: nextActivePowerUp,
      powerUpEndTime: nextPowerUpEndTime
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
    // This fixes the bug where users type a letter to pop a high balloon, but a newly spawned identical letter at the bottom pops instead, making them think their keystroke was ignored!
    const sorted = [...state.balloons].sort((a, b) => b.position[1] - a.position[1]);

    if (state.mode === 'letters') {
      const match = sorted.find((b) => b.text.toUpperCase() === char);
      if (match) {
        state.burstBalloonById(match.id);
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
