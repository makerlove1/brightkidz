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
    <div class="instructions">
      <p>Click two colors to blend them</p>
    </div>
    
    <div class="selected-colors">
      <div class="selected-color-container">
        <div 
          class="selected-color"
          :style="{ backgroundColor: selectedColors[0] ? selectedColors[0].hex : '#f0f0f0' }"
        >
          <span v-if="!selectedColors[0]">First color</span>
          <span v-else>{{ selectedColors[0].name.en }}</span>
        </div>
        <div class="plus-sign" v-if="selectedColors[0]">+</div>
        <div 
          class="selected-color"
          :style="{ backgroundColor: selectedColors[1] ? selectedColors[1].hex : '#f0f0f0' }"
        >
          <span v-if="!selectedColors[1]">Second color</span>
          <span v-else>{{ selectedColors[1].name.en }}</span>
        </div>
        <div class="equals-sign" v-if="mixedColorResult">=</div>
        <div 
          class="result-color"
          v-if="mixedColorResult"
          :style="{ backgroundColor: mixedColor }"
        >
          {{ mixedColorResult.name.en }}
        </div>
      </div>
    </div>
    
    <div class="color-palette">
      <div 
        v-for="color in colors" 
        :key="color.id"
        class="color-item"
        :class="{ 'selected': isColorSelected(color.id), 'disabled': mixedColorResult }"
        :style="{ backgroundColor: color.hex }"
        @click="selectColor(color)"
      >
        <span>{{ color.name.en }}</span>
        <span class="filipino-name">{{ color.name.fil }}</span>
      </div>
    </div>
    
    <div class="reset-button-container" v-if="mixedColorResult">
      <button class="reset-button" @click="restart">Try Again</button>
    </div>
    
    <ErrorAnimation ref="errorAnimation"></ErrorAnimation>
  </Game>
</template>

<script>
import Game from "../Game.vue";
import { SoundUtils } from "../utils/SoundUtils";
import ErrorAnimation from "../ErrorAnimation.vue";

export default {
  name: "ColorBlendingGame",
  components: { Game, ErrorAnimation },
  data() {
    return {
      selectedLevel: 0,
      levels: [
        { colors: 6 },
        { colors: 8 },
        { colors: 10 },
        { colors: 12 }
      ],
      colors: [],
      selectedColors: [],
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
  unmounted() {
    SoundUtils.stopAll();
  },
  methods: {
    restart() {
      const level = this.levels[this.selectedLevel];
      this.selectedColors = [];
      this.mixedColor = null;
      this.mixedColorResult = null;
      this.colors = this.allColors.slice(0, level.colors);
    },
    previousLevel() {
      if (this.selectedLevel > 0) this.selectedLevel--;
      this.restart();
    },
    nextLevel() {
      if (this.selectedLevel < this.levels.length - 1) this.selectedLevel++;
      this.restart();
    },
    selectColor(color) {
      // If we already have a result, don't allow more selections
      if (this.mixedColorResult) return;
      
      // If color is already selected, deselect it
      const index = this.selectedColors.findIndex(c => c.id === color.id);
      if (index !== -1) {
        this.selectedColors.splice(index, 1);
        return;
      }
      
      // Play the color sound when clicked
      SoundUtils.play(`color/${color.id}`);
      
      // Add color to selection (max 2 colors)
      if (this.selectedColors.length < 2) {
        this.selectedColors.push(color);
        
        // If we now have 2 colors, blend them
        if (this.selectedColors.length === 2) {
          this.blendColors();
        }
      }
    },
    blendColors() {
      if (this.selectedColors.length < 2) return;
      
      const color1 = this.selectedColors[0].id;
      const color2 = this.selectedColors[1].id;
      const mixKey = `${color1}+${color2}`;
      
      if (this.colorMixingRules[mixKey]) {
        const result = this.colorMixingRules[mixKey];
        this.mixedColor = result.color;
        this.mixedColorResult = this.allColors.find(c => c.id === result.result);
        
        // Play the resulting color sound (e.g., "purple" for blue + red)
        setTimeout(() => {
          SoundUtils.play(`color/${result.result}`);
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
        
        // Clear selection after error
        setTimeout(() => {
          this.selectedColors = [];
        }, 1000);
      }
    },
    isColorSelected(colorId) {
      return this.selectedColors.some(c => c.id === colorId);
    }
  },
  computed: {
    isGameOver() {
      return this.mixedColorResult !== null;
    }
  }
};
</script>

<style scoped lang="scss">
.instructions {
  text-align: center;
  margin: 20px 0;
  font-size: 1.2rem;
  color: white;
  font-weight: bold;
}

.selected-colors {
  display: flex;
  justify-content: center;
  margin: 30px 0;
}

.selected-color-container {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.selected-color {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.9rem;
  color: white;
  text-align: center;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  border: 3px solid white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  
  &:first-child {
    background-color: #f0f0f0;
    color: #666;
  }
}

.plus-sign, .equals-sign {
  font-size: 2rem;
  font-weight: bold;
  color: white;
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
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
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
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
  
  &:hover:not(.disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }
  
  &:active:not(.disabled) {
    transform: scale(0.95);
  }
  
  &.selected {
    border: 4px solid #ffd700;
    box-shadow: 0 0 15px #ffd700;
  }
  
  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.filipino-name {
  font-size: 0.8rem;
  opacity: 0.9;
  margin-top: 4px;
}

.reset-button-container {
  text-align: center;
  margin: 20px 0;
}

.reset-button {
  padding: 12px 24px;
  font-size: 1.1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: scale(0.95);
  }
}

// Mobile optimizations
@media (max-width: 768px) {
  .selected-color-container {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  
  .plus-sign, .equals-sign {
    font-size: 1.5rem;
  }
  
  .color-palette {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .selected-color {
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