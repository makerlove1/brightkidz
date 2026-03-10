<template>
  <Game
    nav-back-path="/misc"
    :explanation="explanation"
    @restart="restart"
    :current-level="selectedLevel"
    @previous="previousLevel"
    @next="nextLevel"
  >
    <div class="game-container">
      <div class="mixing-area">
        <div class="dropzone-container">
          <div 
            v-for="(slot, index) in dropSlots" 
            :key="'slot-' + index"
            class="dropzone empty-droppable-element"
            :data-slot-index="index"
            :style="{ backgroundColor: slot.color || '#f0f0f0' }"
          >
            <div v-if="slot.color" class="slot-label">
              {{ getColorName(slot.color) }}
            </div>
            <div v-else class="slot-placeholder">
              Drop color {{ index + 1 }} here
            </div>
          </div>
        </div>
        
        <div class="result-area" v-if="mixedColor">
          <div class="mixed-color-display" :style="{ backgroundColor: mixedColor }">
            <div class="mixed-color-label">Mixed Color</div>
          </div>
          <button class="play-sound-btn" @click="playMixedColorSound">
            <i class="fas fa-volume-up"></i> Play Sound
          </button>
          <button class="clear-btn" @click="clearMixedColor">
            <i class="fas fa-times"></i> Clear
          </button>
        </div>
      </div>
      
      <div class="color-palette">
        <div 
          v-for="color in colors" 
          :key="color.id"
          class="draggable-element color-item"
          :data-color-id="color.id"
          :style="{ backgroundColor: color.hex }"
          @click="playColorSound(color.id)"
        >
          <div class="color-name">{{ color.name.en }}</div>
          <div class="color-name-filipino">{{ color.name.fil }}</div>
        </div>
      </div>
    </div>
    
    <ErrorAnimation ref="errorAnimation"></ErrorAnimation>
  </Game>
</template>

<script>
import Game from "../Game.vue";
import { dragDrop } from "../mixins/dragDrop";
import { SoundUtils } from "../utils/SoundUtils";
import ErrorAnimation from "../ErrorAnimation.vue";

export default {
  name: "ColorBlendingGame",
  components: { Game, ErrorAnimation },
  mixins: [dragDrop],
  data() {
    return {
      selectedLevel: 0,
      levels: [
        { colors: 6, slots: 2 },
        { colors: 9, slots: 2 },
        { colors: 12, slots: 2 }
      ],
      colors: [],
      dropSlots: [],
      mixedColor: null,
      explanation: "color_blending",
      allColors: [
        { id: "red", hex: "#FF0000", name: { en: "Red", fil: "Pula" }, sound: { en: "red", fil: "pula" } },
        { id: "blue", hex: "#0000FF", name: { en: "Blue", fil: "Asul" }, sound: { en: "blue", fil: "asul" } },
        { id: "yellow", hex: "#FFFF00", name: { en: "Yellow", fil: "Dilaw" }, sound: { en: "yellow", fil: "dilaw" } },
        { id: "green", hex: "#00FF00", name: { en: "Green", fil: "Berde" }, sound: { en: "green", fil: "berde" } },
        { id: "orange", hex: "#FFA500", name: { en: "Orange", fil: "Kahel" }, sound: { en: "orange", fil: "kahel" } },
        { id: "purple", hex: "#800080", name: { en: "Purple", fil: "Lila" }, sound: { en: "purple", fil: "lila" } }
      ],
      colorMixingRules: {
        "red+blue": "#800080",
        "red+yellow": "#FFA500", 
        "blue+yellow": "#00FF00"
      }
    };
  },
  created() {
    SoundUtils.playExplanation(this.explanation);
    this.restart();
  },
  mounted() {
    this.$nextTick(() => {
      this.initDragDrop(false);
    });
  },
  unmounted() {
    SoundUtils.stopAll();
  },
  methods: {
    restart() {
      const level = this.levels[this.selectedLevel];
      this.dropSlots = Array(level.slots).fill().map(() => ({ color: null }));
      this.mixedColor = null;
      this.colors = this.allColors.slice(0, level.colors);
      this.resetGameComponents();
      this.$nextTick(() => {
        this.initDragDrop(false);
      });
    },
    resetGameComponents() {
      this.resetDragAndDropSuccessions();
    },
    previousLevel() {
      if (this.selectedLevel > 0) this.selectedLevel--;
      this.restart();
    },
    nextLevel() {
      if (this.selectedLevel < this.levels.length - 1) this.selectedLevel++;
      this.restart();
    },
    ondragstart(event) {
      const colorId = event.target.getAttribute("data-color-id");
      this.playColorSound(colorId);
    },
    ondrop(event) {
      const slotIndex = parseInt(event.currentTarget.getAttribute("data-slot-index"));
      const colorId = event.relatedTarget.getAttribute("data-color-id");
      
      this.dropSlots[slotIndex].color = colorId;
      
      if (this.dropSlots.every(slot => slot.color !== null)) {
        this.mixColors();
      }
      
      return true;
    },
    mixColors() {
      const colorIds = this.dropSlots.map(slot => slot.color).sort();
      const mixKey = colorIds.join('+');
      
      this.mixedColor = this.colorMixingRules[mixKey] || "#808080";
      
      setTimeout(() => {
        this.playMixedColorSound();
      }, 500);
    },
    playColorSound(colorId) {
      const color = this.allColors.find(c => c.id === colorId);
      if (color) {
        const lang = SoundUtils.getLanguagePath();
        const soundPath = `${lang}/color/${color.sound[lang === 'filipino' ? 'fil' : 'en']}`;
        SoundUtils.playSound(soundPath);
      }
    },
    playMixedColorSound() {
      if (!this.mixedColor) return;
      
      const colorIds = this.dropSlots.map(slot => slot.color).sort();
      const color1 = this.allColors.find(c => c.id === colorIds[0]);
      const color2 = this.allColors.find(c => c.id === colorIds[1]);
      
      if (color1 && color2) {
        const lang = SoundUtils.getLanguagePath();
        const soundPath = `${lang}/color/mixed_${color1.sound[lang === 'filipino' ? 'fil' : 'en']}_${color2.sound[lang === 'filipino' ? 'fil' : 'en']}`;
        SoundUtils.playSound(soundPath);
      }
    },
    clearMixedColor() {
      this.dropSlots = this.dropSlots.map(() => ({ color: null }));
      this.mixedColor = null;
      this.resetGameComponents();
    },
    getColorName(colorId) {
      const color = this.allColors.find(c => c.id === colorId);
      if (!color) return "Unknown";
      
      const lang = SoundUtils.getLanguagePath();
      return color.name[lang === 'filipino' ? 'fil' : 'en'];
    }
  }
};
</script>

<style scoped lang="scss">
.game-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10pt;
  gap: 20pt;
}

.mixing-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15pt;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12pt;
  padding: 15pt;
}

.dropzone-container {
  display: flex;
  gap: 15pt;
  justify-content: center;
  flex-wrap: wrap;
}

.dropzone {
  width: 80pt;
  height: 80pt;
  border-radius: 10pt;
  border: 3px dashed #ccc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.empty-droppable-element {
    background-color: #f0f0f0 !important;
  }
  
  &.drop-target-active {
    border-color: #6060d7;
    background-color: rgba(96, 96, 215, 0.1) !important;
  }
  
  &.drop-success {
    border-style: solid;
    border-color: #24ff02;
  }
}

.slot-label {
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  text-align: center;
  padding: 5pt;
}

.slot-placeholder {
  color: #666;
  font-size: 0.9rem;
  text-align: center;
  padding: 5pt;
}

.result-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10pt;
  margin-top: 10pt;
}

.mixed-color-display {
  width: 100pt;
  height: 100pt;
  border-radius: 12pt;
  border: 4px solid white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}

.mixed-color-label {
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  text-align: center;
  padding: 10pt;
}

.play-sound-btn, .clear-btn {
  padding: 8pt 15pt;
  border: none;
  border-radius: 8pt;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5pt;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
}

.clear-btn {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
}

.color-palette {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80pt, 1fr));
  gap: 10pt;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12pt;
  padding: 15pt;
}

.color-item {
  width: 80pt;
  height: 80pt;
  border-radius: 10pt;
  border: 3px solid white;
  cursor: move;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  touch-action: none;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }
  
  &.drag-success {
    visibility: hidden;
  }
}

.color-name {
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  font-size: 1rem;
}

.color-name-filipino {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

@media (max-width: 768px) {
  .dropzone, .color-item {
    width: 70pt;
    height: 70pt;
  }
  
  .color-palette {
    grid-template-columns: repeat(auto-fill, minmax(70pt, 1fr));
  }
}
</style>