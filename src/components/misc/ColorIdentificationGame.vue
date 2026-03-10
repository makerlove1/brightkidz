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
      <div class="question-area">
        <div class="color-display" :style="{ backgroundColor: currentColor.hex }">
          <img 
            v-if="currentColor.image" 
            :src="currentColor.image" 
            :alt="currentColor.name.en"
            class="color-image"
          />
        </div>
        <div class="question-text">
          {{ t('games.color_identification.what_color_is_this') }}
        </div>
      </div>
      
      <div class="options-area">
        <div 
          v-for="(option, index) in options" 
          :key="index"
          class="option-button"
          :class="{ 
            'correct': showResult && option.id === currentColor.id,
            'incorrect': showResult && selectedOption === option.id && option.id !== currentColor.id,
            'disabled': showResult
          }"
          @click="selectOption(option)"
        >
          <div class="option-color" :style="{ backgroundColor: option.hex }"></div>
          <div class="option-text">
            <div class="option-name-en">{{ option.name.en }}</div>
            <div class="option-name-fil">{{ option.name.fil }}</div>
          </div>
        </div>
      </div>
      
      <div class="progress-area">
        <div class="score">{{ t('games.color_identification.score') }}: {{ score }}/{{ totalQuestions }}</div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
      </div>
    </div>
    
    <ErrorAnimation ref="errorAnimation"></ErrorAnimation>
  </Game>
</template>

<script>
import Game from "../Game.vue";
import { SoundUtils } from "../utils/SoundUtils";
import ErrorAnimation from "../ErrorAnimation.vue";
import translationMixin from "@/mixins/translationMixin";

export default {
  name: "ColorIdentificationGame",
  components: { Game, ErrorAnimation },
  mixins: [translationMixin],
  data() {
    return {
      selectedLevel: 0,
      levels: [
        { colors: 6, options: 3, questions: 10 },
        { colors: 9, options: 4, questions: 15 },
        { colors: 12, options: 4, questions: 20 }
      ],
      explanation: "color_identification",
      currentColor: null,
      options: [],
      selectedOption: null,
      showResult: false,
      score: 0,
      currentQuestion: 0,
      totalQuestions: 10,
      allColors: [
        // 12 colors from the color wheel
        { id: "red", hex: "#FF0000", name: { en: "Red", fil: "Pula" }, sound: { en: "red", fil: "pula" }, image: "/img/colors/red.svg" },
        { id: "red-orange", hex: "#FF4500", name: { en: "Red Orange", fil: "Pula-Kahel" }, sound: { en: "red-orange", fil: "pula-kahel" }, image: "/img/colors/red-orange.svg" },
        { id: "orange", hex: "#FFA500", name: { en: "Orange", fil: "Kahel" }, sound: { en: "orange", fil: "kahel" }, image: "/img/colors/orange.svg" },
        { id: "yellow-orange", hex: "#FFD700", name: { en: "Yellow Orange", fil: "Dilaw-Kahel" }, sound: { en: "yellow-orange", fil: "dilaw-kahel" }, image: "/img/colors/yellow-orange.svg" },
        { id: "yellow", hex: "#FFFF00", name: { en: "Yellow", fil: "Dilaw" }, sound: { en: "yellow", fil: "dilaw" }, image: "/img/colors/yellow.svg" },
        { id: "yellow-green", hex: "#9ACD32", name: { en: "Yellow Green", fil: "Dilaw-Berde" }, sound: { en: "yellow-green", fil: "dilaw-berde" }, image: "/img/colors/yellow-green.svg" },
        { id: "green", hex: "#00FF00", name: { en: "Green", fil: "Berde" }, sound: { en: "green", fil: "berde" }, image: "/img/colors/green.svg" },
        { id: "blue-green", hex: "#008080", name: { en: "Blue Green", fil: "Asul-Berde" }, sound: { en: "blue-green", fil: "asul-berde" }, image: "/img/colors/blue-green.svg" },
        { id: "blue", hex: "#0000FF", name: { en: "Blue", fil: "Asul" }, sound: { en: "blue", fil: "asul" }, image: "/img/colors/blue.svg" },
        { id: "blue-violet", hex: "#4B0082", name: { en: "Blue Violet", fil: "Asul-Lila" }, sound: { en: "blue-violet", fil: "asul-lila" }, image: "/img/colors/blue-violet.svg" },
        { id: "violet", hex: "#800080", name: { en: "Violet", fil: "Lila" }, sound: { en: "violet", fil: "lila" }, image: "/img/colors/violet.svg" },
        { id: "red-violet", hex: "#C71585", name: { en: "Red Violet", fil: "Pula-Lila" }, sound: { en: "red-violet", fil: "pula-lila" }, image: "/img/colors/red-violet.svg" }
      ]
    };
  },
  computed: {
    progressPercentage() {
      return (this.currentQuestion / this.totalQuestions) * 100;
    }
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
      this.totalQuestions = level.questions;
      this.score = 0;
      this.currentQuestion = 0;
      this.generateQuestion();
    },
    previousLevel() {
      if (this.selectedLevel > 0) this.selectedLevel--;
      this.restart();
    },
    nextLevel() {
      if (this.selectedLevel < this.levels.length - 1) this.selectedLevel++;
      this.restart();
    },
    generateQuestion() {
      const level = this.levels[this.selectedLevel];
      const availableColors = this.allColors.slice(0, level.colors);
      
      // Select random color for question
      this.currentColor = availableColors[Math.floor(Math.random() * availableColors.length)];
      
      // Generate options (including correct answer)
      this.options = [this.currentColor];
      
      // Add random incorrect options
      while (this.options.length < level.options) {
        const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
        if (!this.options.find(opt => opt.id === randomColor.id)) {
          this.options.push(randomColor);
        }
      }
      
      // Shuffle options
      this.options = this.shuffleArray(this.options);
      
      this.selectedOption = null;
      this.showResult = false;
      
      // Play color sound after a short delay
      setTimeout(() => {
        this.playColorSound(this.currentColor.id);
      }, 500);
    },
    selectOption(option) {
      if (this.showResult) return;
      
      this.selectedOption = option.id;
      this.showResult = true;
      
      if (option.id === this.currentColor.id) {
        this.score++;
        SoundUtils.playSuccess();
      } else {
        SoundUtils.playError();
        this.$refs.errorAnimation.show();
      }
      
      // Play the selected color sound
      this.playColorSound(option.id);
      
      // Move to next question after delay
      setTimeout(() => {
        this.currentQuestion++;
        if (this.currentQuestion < this.totalQuestions) {
          this.generateQuestion();
        } else {
          this.gameComplete();
        }
      }, 2000);
    },
    gameComplete() {
      const percentage = (this.score / this.totalQuestions) * 100;
      if (percentage >= 80) {
        SoundUtils.playSuccess();
      } else {
        SoundUtils.playError();
      }
      
      // Show completion message
      setTimeout(() => {
        alert(`Game Complete! Score: ${this.score}/${this.totalQuestions} (${percentage.toFixed(1)}%)`);
        this.restart();
      }, 1000);
    },
    playColorSound(colorId) {
      const color = this.allColors.find(c => c.id === colorId);
      if (color) {
        const lang = SoundUtils.getLanguagePath();
        const soundPath = `${lang}/color/${color.id}`;
        SoundUtils.play(soundPath);
      }
    },
    shuffleArray(array) {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }
  }
};
</script>

<style scoped lang="scss">
.game-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 15pt;
  gap: 20pt;
}

.question-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15pt;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15pt;
  padding: 20pt;
}

.color-display {
  width: 120pt;
  height: 120pt;
  border-radius: 15pt;
  border: 4px solid white;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.color-image {
  width: 80%;
  height: 80%;
  object-fit: contain;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
}

.question-text {
  font-size: 1.4rem;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.options-area {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200pt, 1fr));
  gap: 15pt;
  padding: 0 10pt;
}

.option-button {
  display: flex;
  align-items: center;
  gap: 15pt;
  padding: 15pt;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12pt;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(.disabled) {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    border-color: #6060d7;
  }
  
  &.correct {
    border-color: #24ff02;
    background: rgba(36, 255, 2, 0.1);
  }
  
  &.incorrect {
    border-color: #ff2424;
    background: rgba(255, 36, 36, 0.1);
  }
  
  &.disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
}

.option-color {
  width: 50pt;
  height: 50pt;
  border-radius: 8pt;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.option-text {
  display: flex;
  flex-direction: column;
  gap: 5pt;
}

.option-name-en {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.option-name-fil {
  font-size: 1rem;
  color: #666;
  font-style: italic;
}

.progress-area {
  display: flex;
  flex-direction: column;
  gap: 10pt;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12pt;
  padding: 15pt;
}

.score {
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.progress-bar {
  height: 8pt;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4pt;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #24ff02, #6060d7);
  border-radius: 4pt;
  transition: width 0.3s ease;
}

@media (max-width: 768px) {
  .color-display {
    width: 100pt;
    height: 100pt;
  }
  
  .options-area {
    grid-template-columns: 1fr;
  }
  
  .option-button {
    padding: 12pt;
  }
  
  .option-color {
    width: 40pt;
    height: 40pt;
  }
}
</style>