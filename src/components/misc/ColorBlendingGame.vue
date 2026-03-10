<template>
  <Game
    :is-highlight-animation-running="isGameOver"
    nav-back-path="/misc"
    :explanation="explanation"
    @previous="previousLevel"
    @restart="restart"
    :current-level="selectedLevel"
    @next="nextLevel"
  >
    <div class="mixing-area">
      <div class="drop-slots">
        <div 
          v-for="(slot, index) in dropSlots" 
          :key="index"
          class="drop-slot"
          :data-slot-index="index"
          :style="{ backgroundColor: slot.color ? slot.color.hex : '#f0f0f0' }"
        >
          <span v-if="!slot.color">Drop color here</span>
          <span v-else>{{ slot.color.name.en }}</span>
        </div>
      </div>
      
      <div class="mixed-color-result" v-if="mixedColor">
        <div 
          class="result-color"
          :style="{ backgroundColor: mixedColor }"
        >
          {{ mixedColorResult ? mixedColorResult.name.en : 'Mixed Color' }}
        </div>
      </div>
    </div>
    
    <div class="color-palette">
      <div 
        v-for="color in colors" 
        :key="color.id"
        class="color-item"
        :data-color-id="color.id"
        :style="{ backgroundColor: color.hex }"
        @click="playColorSound(color.id)"
      >
        <span>{{ color.name.en }}</span>
        <span class="filipino-name">{{ color.name.fil }}</span>
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
        { colors: 8, slots: 2 },
        { colors: 10, slots: 2 },
        { colors: 12, slots: 2 }
      ],
      colors: [],
      dropSlots: [],
      mixedColor: null,
      mixedColorResult: null,
      explanation: "color_blending",
      // All colors with English and Filipino names
      allColors: [
        { id: "red", hex: "#FF0000", name: { en: "Red", fil: "Pula" }, sound: { en: "red", fil: "pula" } },
        { id: "blue", hex: "#0000FF", name: { en: "Blue", fil: "Asul" }, sound: { en: "blue", fil: "asul" } },
        { id: "yellow", hex: "#FFFF00", name: { en: "Yellow", fil: "Dilaw" }, sound: { en: "yellow", fil: "dilaw" } },
        { id: "green", hex: "#00FF00", name: { en: "Green", fil: "Berde" }, sound: { en: "green", fil: "berde" } },
        { id: "orange", hex: "#FFA500", name: { en: "Orange", fil: "Kahel" }, sound: { en: "orange", fil: "kahel" } },
        { id: "purple", hex: "#800080", name: { en: "Purple", fil: "Lila" }, sound: { en: "purple", fil: "lila" } },
        { id: "pink", hex: "#FFC0CB", name: { en: "Pink", fil: "Rosas" }, sound: { en: "pink", fil: "rosas" } },
        { id: "brown", hex: "#A52A2A", name: { en: "Brown", fil: "Kayumanggi" }, sound: { en: "brown", fil: "kayumanggi" } },
        { id: "black", hex: "#000000", name: { en: "Black", fil: "Itim" }, sound: { en: "black", fil: "itim" } },
        { id: "white", hex: "#FFFFFF", name: { en: "White", fil: "Puti" }, sound: { en: "white", fil: "puti" } },
        { id: "cyan", hex: "#00FFFF", name: { en: "Cyan", fil: "Syan" }, sound: { en: "cyan", fil: "syan" } },
        { id: "magenta", hex: "#FF00FF", name: { en: "Magenta", fil: "Magenta" }, sound: { en: "magenta", fil: "magenta" } }
      ],
      // Color mixing rules
      colorMixingRules: {
        "red+blue": { color: "#800080", result: "purple" },
        "blue+red": { color: "#800080", result: "purple" },
        "red+yellow": { color: "#FFA500", result: "orange" },
        "yellow+red": { color: "#FFA500", result: "orange" },
        "blue+yellow": { color: "#00FF00", result: "green" },
        "yellow+blue": { color: "#00FF00", result: "green" },
        "red+green": { color: "#8B4513", result: "brown" },
        "green+red": { color: "#8B4513", result: "brown" },
        "blue+orange": { color: "#8B4513", result: "brown" },
        "orange+blue": { color: "#8B4513", result: "brown" },
        "yellow+purple": { color: "#8B4513", result: "brown" },
        "purple+yellow": { color: "#8B4513", result: "brown" },
        "red+cyan": { color: "#FF69B4", result: "pink" },
        "cyan+red": { color: "#FF69B4", result: "pink" },
        "blue+magenta": { color: "#800080", result: "purple" },
        "magenta+blue": { color: "#800080", result: "purple" }
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
      this.mixedColorResult = null;
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
      const dropElement = event.currentTarget;
      const dragElement = event.relatedTarget;
      const slotIndex = parseInt(dropElement.getAttribute("data-slot-index"));
      const colorId = dragElement.getAttribute("data-color-id");
      
      const color = this.allColors.find(c => c.id === colorId);
      if (!color) return false;
      
      // Set color in slot
      this.dropSlots[slotIndex].color = color;
      
      // Check if all slots are filled
      const allFilled = this.dropSlots.every(slot => slot.color !== null);
      if (allFilled) {
        this.mixColors();
      }
      
      return true;
    },
    mixColors() {
      if (this.dropSlots.length < 2) return;
      
      const color1 = this.dropSlots[0].color.id;
      const color2 = this.dropSlots[1].color.id;
      const mixKey = `${color1}+${color2}`;
      
      if (this.colorMixingRules[mixKey]) {
        const result = this.colorMixingRules[mixKey];
        this.mixedColor = result.color;
        this.mixedColorResult = this.allColors.find(c => c.id === result.result);
        
        // Play mixed color sound
        setTimeout(() => {
          SoundUtils.play(`color/mixed_${color1}_${color2}`);
        }, 500);
        
        // Show success
        setTimeout(() => {
          this.emitter.emit("showReward", [this.selectedLevel + 1]);
          this.isGameOver = true;
          SoundUtils.playBigSuccess();
        }, 1500);
      } else {
        // No valid mix
        this.$refs.errorAnimation.showError();
        SoundUtils.playError();
      }
    },
    playColorSound(colorId) {
      SoundUtils.play(`color/${colorId}`);
    }
  },
  computed: {
    isGameOver() {
      return this.mixedColor !== null;
    }
  }
};
</script>

<style scoped lang="scss">
.mixing-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
}

.drop-slots {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.drop-slot {
  width: 100px;
  height: 100px;
  border: 3px dashed #ccc;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.9rem;
  color: #666;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    background-color: rgba(102, 126, 234, 0.1);
  }
}

.mixed-color-result {
  margin-top: 20px;
  text-align: center;
}

.result-color {
  width: 120px;
  height: 120px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  border: 3px solid white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.color-palette {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin: 20px 0;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
}

.color-item {
  height: 80px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  border: 2px solid white;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.filipino-name {
  font-size: 0.8rem;
  opacity: 0.9;
  margin-top: 4px;
}

// Mobile optimizations
@media (max-width: 768px) {
  .drop-slots {
    flex-direction: column;
    align-items: center;
  }
  
  .color-palette {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .drop-slot {
    width: 80px;
    height: 80px;
  }
  
  .result-color {
    width: 100px;
    height: 100px;
  }
}

// Tablet optimizations
@media (min-width: 769px) and (max-width: 1024px) {
  .color-palette {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
<!-- Fixed: Color blending game now correctly shows color mixing instead of drag-drop characters -->