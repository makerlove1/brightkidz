import { Voice } from "@/models/Voice";
import errorLogger from "@/utils/ErrorLogger";
import languageManager from "@/utils/LanguageManager";

// Initialize voice asynchronously
let initializedVoice = null;

const voices = {
  boy0: new Voice("boy0", "Boy Voice"),
  girl0: new Voice("girl0", "Girl Voice"),
};

const randomVoice =
  voices[
    Object.keys(voices)[Math.floor(Math.random() * Object.keys(voices).length)]
  ];

// Load voice preference from database
async function loadVoicePreference() {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const axios = (await import('axios')).default;
      const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api';
      const response = await axios.get(
        `${API_URL}/preferences`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.selectedVoice) {
        return voices[response.data.selectedVoice.id] || randomVoice;
      }
    }
    
    // Fallback to localStorage
    const savedVoice = JSON.parse(localStorage.getItem("selectedVoice"));
    return savedVoice ? voices[savedVoice.id] : randomVoice;
  } catch (e) {
    const savedVoice = JSON.parse(localStorage.getItem("selectedVoice"));
    return savedVoice ? voices[savedVoice.id] : randomVoice;
  }
}

// Initialize voice
loadVoicePreference().then(voice => {
  initializedVoice = voice;
});

export const SoundUtils = {
  voices: voices,
  get selectedVoice() {
    return initializedVoice || randomVoice;
  },
  set selectedVoice(voice) {
    initializedVoice = voice;
  },
  audios: {},
  eventListeners: [],
  
  // Get current language path for sounds
  getLanguagePath: function() {
    return languageManager.getSoundPath();
  },
  preload: function (src) {
    try {
      const audio = new Audio("sounds/" + src + ".mp3");
      audio.addEventListener('error', () => {
        errorLogger.logAudioError("sounds/" + src + ".mp3", 'Failed to preload audio');
      });
      this.audios[src] = audio;
      errorLogger.debug('Audio preloaded', { src });
    } catch (e) {
      errorLogger.logAudioError("sounds/" + src + ".mp3", e);
    }
  },
  stopAll: function () {
    for (const eventListener of this.eventListeners) {
      this.audios[eventListener.src].removeEventListener(
        "ended",
        eventListener.listener
      );
    }

    for (const audio of Object.values(this.audios)) {
      audio.pause();
      audio.currentTime = 0;
    }
  },
  getFromCache: function (src) {
    let audio = this.audios[src];
    if (audio && audio.readyState) {
      return audio;
    }
  },
  playSoundsInRow: function (srcArray) {
    let src = srcArray.shift();
    this.eventListeners.shift();
    if (srcArray.length > 0) {
      let nextSound = this.playSoundsInRow.bind(this, srcArray);
      this.eventListeners.push({ src: src, listener: nextSound });
      return this.playSound(src).addEventListener("ended", nextSound, {
        once: true,
      });
    }

    return this.playSound(src);
  },
  playSound: function (src) {
    let audio = this.getFromCache(src);
    if (!audio) {
      try {
        audio = new Audio("sounds/" + src + ".mp3");
        audio.addEventListener('error', () => {
          errorLogger.logAudioError("sounds/" + src + ".mp3", 'Audio file not found or failed to load');
        });
        this.audios[src] = audio;
      } catch (e) {
        errorLogger.logAudioError("sounds/" + src + ".mp3", e);
        return null;
      }
    }
    try {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          errorLogger.logAudioError("sounds/" + src + ".mp3", e);
        });
      }
    } catch (e) {
      errorLogger.logAudioError("sounds/" + src + ".mp3", e);
    }
    return audio;
  },
  playError: function () {
    let errors = [
      "error1",
      /*"error2" too "strong" as default*,*/ "error3",
      "error4",
    ];
    let randomError = errors[Math.floor(Math.random() * errors.length)];
    return this.playSound(randomError);
  },
  playSuccess: function () {
    let successes = [
      "success1",
      "success2",
      "success3",
      "success4",
      "success5",
    ];
    let randomSuccess = successes[Math.floor(Math.random() * successes.length)];
    return this.playSound(randomSuccess);
  },
  playBigSuccess: function () {
    return this.playSound("big_success1");
  },
  playCharacter: function (character) {
    return this.playSound(this.getCharacterPath(character));
  },
  getCharacterPath: function (character) {
    const lang = this.getLanguagePath();
    // For English and Filipino, use letters-numbers folder
    if (lang === 'english' || lang === 'filipino') {
      return lang + "/letters-numbers/" + character.toLowerCase();
    }
    // For German, keep old structure
    return "de/characters/" + character.toLowerCase();
  },
  playExplanation: function (file) {
    const lang = this.getLanguagePath();
    return this.playSound(lang + "/explanation/" + file);
  },
  playHelper: function (file) {
    const lang = this.getLanguagePath();
    return this.playSound(lang + "/helpers/" + file);
  },
  play: function (src) {
    if (!src) {
      errorLogger.logWarning("No sound source provided", { src });
      return;
    }
    try {
      return this.playSound(src);
    } catch (e) {
      errorLogger.logError("Sound Play Error", { src, error: e });
    }
  },
  async setVoice(voice) {
    try {
      this.selectedVoice = voice;
      
      // Save to database
      const token = localStorage.getItem('token');
      if (token) {
        const axios = (await import('axios')).default;
        const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api';
        await axios.post(
          `${API_URL}/preferences/voice`,
          { voice: { id: voice.id, name: voice.name } },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      // Fallback to localStorage
      localStorage.setItem("selectedVoice", JSON.stringify(voice));
      errorLogger.logInfo("Voice changed", { voice: voice.name });
    } catch (e) {
      errorLogger.logError("Voice Change Error", { voice, error: e });
    }
  },
  useBoy0Voice() {
    this.setVoice(this.voices.boy0);
  },
  useGirl0Voice() {
    this.setVoice(this.voices.girl0);
  },
};

class Sound {
  constructor(group, id) {
    this.group = group;
    this.id = id;
  }

  play() {
    let path = this.id ? this.group + "/" + this.id : this.group;
    SoundUtils.playSound(path);
  }
}

class KidSound extends Sound {
  constructor(group, id) {
    super(group, id);
    try {
      // Preload for all languages
      const languages = ['de', 'english', 'filipino'];
      languages.forEach(lang => {
        if (lang === 'de') {
          SoundUtils.preload(lang + "/" + this.group + "/boy0/" + this.id);
          SoundUtils.preload(lang + "/" + this.group + "/girl0/" + this.id);
        } else {
          // English and Filipino use different folder structure
          const folder = this.group === 'characters' ? 'letters-numbers' : 
                        this.group === 'words' ? 'words' : this.group;
          SoundUtils.preload(lang + "/" + folder + "/" + this.id);
        }
      });
    } catch (e) {
      errorLogger.logError("KidSound Constructor Error", { group, id, error: e });
    }
  }

  play() {
    try {
      const lang = SoundUtils.getLanguagePath();
      let path;
      
      if (lang === 'de') {
        // German uses old structure with voice selection
        path = lang + "/" + this.group + "/" + SoundUtils.selectedVoice.id + "/" + this.id;
      } else {
        // English and Filipino use new structure
        const folder = this.group === 'characters' ? 'letters-numbers' : 
                      this.group === 'words' ? 'words' : this.group;
        path = lang + "/" + folder + "/" + this.id;
      }
      
      SoundUtils.playSound(path);
    } catch (e) {
      errorLogger.logError("KidSound Play Error", { group: this.group, id: this.id, error: e });
    }
  }
}

class DadSound extends Sound {
  constructor(group, id) {
    super(group, id);
    try {
      // Preload for all languages
      const languages = ['de', 'english', 'filipino'];
      languages.forEach(lang => {
        if (lang === 'de') {
          SoundUtils.preload(lang + "/" + this.group + "/dad/" + this.id);
        } else {
          // English and Filipino use words folder
          SoundUtils.preload(lang + "/words/" + this.id);
        }
      });
    } catch (e) {
      errorLogger.logError("DadSound Constructor Error", { group, id, error: e });
    }
  }

  play() {
    try {
      const lang = SoundUtils.getLanguagePath();
      let path;
      
      if (lang === 'de') {
        // German uses old structure
        path = lang + "/" + this.group + "/dad/" + this.id;
      } else {
        // English and Filipino use words folder
        path = lang + "/words/" + this.id;
      }
      
      SoundUtils.playSound(path);
    } catch (e) {
      errorLogger.logError("DadSound Play Error", { group: this.group, id: this.id, error: e });
    }
  }
}

export const SoundLib = {
  // letters
  a: new KidSound("characters", "a"),
  b: new KidSound("characters", "b"),
  c: new KidSound("characters", "c"),
  d: new KidSound("characters", "d"),
  e: new KidSound("characters", "e"),
  f: new KidSound("characters", "f"),
  g: new KidSound("characters", "g"),
  h: new KidSound("characters", "h"),
  i: new KidSound("characters", "i"),
  j: new KidSound("characters", "j"),
  k: new KidSound("characters", "k"),
  l: new KidSound("characters", "l"),
  m: new KidSound("characters", "m"),
  n: new KidSound("characters", "n"),
  o: new KidSound("characters", "o"),
  p: new KidSound("characters", "p"),
  q: new KidSound("characters", "q"),
  r: new KidSound("characters", "r"),
  s: new KidSound("characters", "s"),
  t: new KidSound("characters", "t"),
  u: new KidSound("characters", "u"),
  v: new KidSound("characters", "v"),
  w: new KidSound("characters", "w"),
  x: new KidSound("characters", "x"),
  y: new KidSound("characters", "y"),
  z: new KidSound("characters", "z"),
  // numbers
  0: new KidSound("characters", "0"),
  1: new KidSound("characters", "1"),
  2: new KidSound("characters", "2"),
  3: new KidSound("characters", "3"),
  4: new KidSound("characters", "4"),
  5: new KidSound("characters", "5"),
  6: new KidSound("characters", "6"),
  7: new KidSound("characters", "7"),
  8: new KidSound("characters", "8"),
  9: new KidSound("characters", "9"),
  10: new KidSound("characters", "10"),
  11: new KidSound("characters", "11"),
  12: new KidSound("characters", "12"),
  13: new KidSound("characters", "13"),
  14: new KidSound("characters", "14"),
  15: new KidSound("characters", "15"),
  16: new KidSound("characters", "16"),
  17: new KidSound("characters", "17"),
  18: new KidSound("characters", "18"),
  19: new KidSound("characters", "19"),
  20: new KidSound("characters", "20"),
  // kiz sounds
  ambulance: new KidSound("words", "ambulance"),
  bunny: new KidSound("words", "bunny"),
  butterfly: new KidSound("words", "butterfly"),
  car: new KidSound("words", "car"),
  cat: new KidSound("words", "cat"),
  chicken: new KidSound("words", "chicken"),
  christmasTree: new KidSound("words", "christmas_tree"),
  dino: new KidSound("words", "dino"),
  dog: new KidSound("words", "dog"),
  dragon: new KidSound("words", "dragon"),
  fireDepartment: new KidSound("words", "fire_department"),
  fireEngine: new KidSound("words", "fire_engine"),
  fish: new KidSound("words", "fish"),
  frog: new KidSound("words", "frog"),
  goat: new KidSound("words", "goat"),
  hi: new KidSound("words", "hi"),
  laugh1: new KidSound("words", "laugh1"),
  laugh2: new KidSound("words", "laugh2"),
  laugh3: new KidSound("words", "laugh3"),
  ninja: new KidSound("words", "ninja"),
  owl: new KidSound("words", "owl"),
  penguin: new KidSound("words", "penguin"),
  police: new KidSound("words", "police"),
  rainbow: new KidSound("words", "rainbow"),
  rainbowFish: new KidSound("words", "rainbow_fish"),
  santa: new KidSound("words", "santa"),
  snail: new KidSound("words", "snail"),
  snowman: new KidSound("words", "snowman"),
  tractor: new KidSound("words", "tractor"),
  tree: new KidSound("words", "tree"),
  unicorn: new KidSound("words", "unicorn"),
  // dad sounds
  dad_dragon: new DadSound("words", "drache"),
  // general
  success1: new Sound("success1"),
  success2: new Sound("success2"),
  success3: new Sound("success3"),
  success4: new Sound("success4"),
  success5: new Sound("success5"),
  error1: new Sound("error1"),
  error3: new Sound("error3"),
  error4: new Sound("error4"),
};
