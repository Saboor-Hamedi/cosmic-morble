import { create } from 'zustand';
import { playBalloonPopSound, playKeyClickSound, playWinFanfare } from '../audio/SoundSynthesizer.js';

const SINGLE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const KIDS_WORDS = [
  // Animals & Creatures
  'CAT', 'DOG', 'SUN', 'STAR', 'MOON', 'BALL', 'JUMP', 'PLAY', 
  'TREE', 'FISH', 'BIRD', 'LION', 'BEAR', 'CAKE', 'HAPPY', 'LOVE', 
  'COOL', 'HERO', 'BLUE', 'RED', 'PINK', 'GOLD', 'FAST', 'FUN',
  'SHIP', 'ROBOT', 'APPLE', 'DUCK', 'FROG', 'MILK', 'PONY', 'ZOO',
  'TIGER', 'PANDA', 'KOALA', 'SHARK', 'WHALE', 'DOLPHIN', 'EAGLE', 'FALCON',
  'ZEBRA', 'GIRAFFE', 'MONKEY', 'RABBIT', 'TURTLE', 'PENGUIN', 'DRAGON', 'UNICORN',
  'DINOSAUR', 'BUTTERFLY', 'PUPPY', 'KITTEN', 'OTTER', 'SWAN', 'OCTOPUS', 'SEAL',
  'CHEETAH', 'LEOPARD', 'GORILLA', 'HAMSTER', 'PARROT', 'TOUCAN', 'IGUANA', 'CHAMELEON',
  'LADYBUG', 'FIREFLY', 'DOLPHIN', 'MANATEE', 'SEAHORSE', 'STARFISH', 'JELLYFISH', 'STINGRAY',
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
  'CROWN', 'DIAMOND', 'RUBY', 'PEARL', 'CRYSTAL', 'SPARKLE', 'CANDY', 'COOKIE',
  'PIZZA', 'ICECREAM', 'BANANA', 'ORANGE', 'BERRY', 'CHERRY', 'SUPER', 'CHAMP',
  'WINNER', 'ROCKSTAR', 'GAMES', 'PARTY', 'SMILE', 'FRIEND', 'GLOW', 'DREAM',
  'FLIGHT', 'SOAR', 'BRAVE', 'SHINE', 'CLEVER', 'GENIUS', 'PEACE', 'JOY',
  'DONUT', 'MUFFIN', 'WAFFLE', 'BURGER', 'NOODLE', 'MELON', 'PEACH', 'HONEY',
  'SUGAR', 'COCOA', 'POP', 'SNACK', 'SWEET', 'YUMMY', 'DELIGHT', 'CELEBRATE',
  // Superpowers, Music & Action
  'POWER', 'ULTRA', 'HYPER', 'SONIC', 'BLITZ', 'MIGHTY', 'SHIELD', 'VALIANT',
  'GLORY', 'HEROIC', 'GUITAR', 'DRUM', 'PIANO', 'DANCE', 'SING', 'PAINT',
  'COLOR', 'RHYTHM', 'FLUTE', 'MELODY', 'HARMONY', 'CHORUS', 'VIOLIN', 'TRUMPET',
  'SPEED', 'ZOOM', 'DASH', 'SPRINT', 'LEAP', 'BOUND', 'CLIMB', 'EXPLORE'
];

const BALLOON_COLORS = [
  '#ff0055', '#00b4d8', '#00ff88', '#ff9e00', 
  '#b026ff', '#ff206e', '#7b2cbf', '#ffff00'
];

let nextBalloonId = 1;
let nextBurstId = 1;

export const useTypingGameStore = create((set, get) => ({
  mode: 'letters', // 'letters' or 'words'
  capsLock: true,  // true = uppercase letters, false = lowercase letters
  score: 0,
  streak: 0,
  highScore: 0,
  balloons: [],
  bursts: [],
  activeKey: null,
  activeKeyTime: 0,

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

  setMode: (newMode) => {
    set({
      mode: newMode,
      balloons: [],
      streak: 0
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

    // Format text case dynamically based on capsLock setting (`if we press caps lock the letter becomes upper case if we off lower case`)
    text = state.capsLock ? text.toUpperCase() : text.toLowerCase();

    const speed = 0.8 + Math.random() * 0.55;
    const swaySpeed = 1.6 + Math.random() * 0.8;
    const swayAmount = 0.18 + Math.random() * 0.14;
    const swayPhase = Math.random() * Math.PI * 2;

    const shapeTypes = ['sphere', 'cube', 'cuboid', 'cylinder'];
    const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];

    const newBalloon = {
      id: nextBalloonId++,
      text,
      shapeType,
      typedIndex: 0,
      position: [bestX, -3.5, bestZ],
      speed,
      swaySpeed,
      swayAmount,
      swayPhase,
      scale: 0.45,
      color
    };

    set({ balloons: [...state.balloons, newBalloon] });
  },

  updateBalloons: (delta) => {
    const state = get();
    if (state.balloons.length === 0) return;

    // 1. First pass: Move upward with buoyant momentum
    const moved = [];
    state.balloons.forEach((b) => {
      const newY = b.position[1] + b.speed * delta;
      if (newY < 6.8) {
        moved.push({
          ...b,
          position: [b.position[0], newY, b.position[2]]
        });
      }
    });

    // 2. Second pass: Elastic Collision Separation (`push them more` when closer than 1.95 units so letters never stick together!)
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

    const now = Date.now();
    const activeBursts = state.bursts.filter((br) => now - br.timestamp < 1200);

    set({ balloons: moved, bursts: activeBursts });
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
    const newScore = state.score + (state.mode === 'words' ? 50 : 15) + state.streak * 5;
    const newStreak = state.streak + 1;

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

    set({
      balloons: state.balloons.filter((b) => b.id !== id),
      bursts: [...state.bursts, newBurst],
      score: newScore,
      streak: newStreak,
      highScore: Math.max(state.highScore, newScore)
    });
  },

  pressKey: (keyChar) => {
    if (!keyChar) return;
    const state = get();

    // If Caps Lock key pressed, toggle case for entire game immediately (`if we press caps lock the letter becomes upper case`)
    if (keyChar === 'CapsLock' || keyChar.toLowerCase() === 'capslock') {
      state.toggleCapsLock();
      return;
    }

    if (keyChar.length !== 1) return;
    const char = keyChar.toUpperCase();

    state.setActiveKey(keyChar);
    playKeyClickSound();

    const sorted = [...state.balloons].sort((a, b) => a.position[1] - b.position[1]);

    if (state.mode === 'letters') {
      const match = sorted.find((b) => b.text.toUpperCase() === char);
      if (match) {
        state.burstBalloonById(match.id);
      }
    } else {
      const match = sorted.find((b) => b.text[b.typedIndex] && b.text[b.typedIndex].toUpperCase() === char);
      if (match) {
        const nextIdx = match.typedIndex + 1;
        if (nextIdx >= match.text.length) {
          state.burstBalloonById(match.id);
        } else {
          playKeyClickSound();
          set({
            balloons: state.balloons.map((b) =>
              b.id === match.id ? { ...b, typedIndex: nextIdx } : b
            ),
            score: state.score + 10,
            streak: state.streak + 1
          });
        }
      }
    }
  },

  clickBalloon: (id) => {
    const state = get();
    const target = state.balloons.find((b) => b.id === id);
    if (!target) return;

    if (state.mode === 'letters') {
      state.burstBalloonById(id);
    } else {
      const nextIdx = target.typedIndex + 1;
      if (nextIdx >= target.text.length) {
        state.burstBalloonById(id);
      } else {
        playKeyClickSound();
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
