<template>
  <Game
    :is-highlight-animation-running="isCorrect"
    :previous-level-disabled="currentQuestionIndex === 0"
    :next-level-disabled="currentQuestionIndex >= totalQuestions - 1"
    nav-back-path="/misc"
    :explanation="'quiz'"
    :current-level="currentQuestionIndex"
    @previous="previousQuestion"
    @restart="restart"
    @next="nextQuestion"
  >
    <div v-if="questions.length > 0 && currentQuestion.type" class="quiz-container">
      <!-- Question Section -->
      <div class="question-section">
        <div class="question-prompt">
          <em class="fas fa-question-circle"></em>
          <h2>{{ getQuestionText() }}</h2>
        </div>
        
        <!-- Image Display (for object questions) -->
        <div v-if="currentQuestion.type === 'object'" class="question-image">
          <ImageContainer :src="currentQuestion.image" class="quiz-image" />
        </div>
        
        <!-- Text Display (for letter/number questions) -->
        <div v-else class="question-text">
          <div class="display-character-image">
            <img :src="`/img/characters/${currentQuestion.display}.svg`" :alt="currentQuestion.display" />
          </div>
        </div>
      </div>

      <!-- Choices Section -->
      <div class="choices-section">
        <button
          v-for="(choice, index) in currentQuestion.choices"
          :key="index"
          @click="selectAnswer(choice)"
          class="choice-button"
          :class="{
            'correct': isChoiceSelected(choice) && showResult && isCorrect,
            'incorrect': isChoiceSelected(choice) && showResult && !isCorrect,
            'disabled': showResult
          }"
          :disabled="showResult"
        >
          <!-- Show image for object questions -->
          <div v-if="currentQuestion.type === 'object' && choice.image" class="choice-image">
            <img :src="choice.image" :alt="getChoiceText(choice)" />
          </div>
          <!-- Show character image for letter/number questions -->
          <div v-else class="choice-character-image">
            <img :src="`/img/characters/${choice}.svg`" :alt="choice" />
          </div>
          <span class="choice-text">{{ getChoiceText(choice) }}</span>
        </button>
      </div>

      <!-- Score Display -->
      <div class="score-section">
        <div class="score-item">
          <em class="fas fa-check-circle"></em>
          <span>{{ score }}</span>
        </div>
        <div class="score-item">
          <em class="fas fa-list"></em>
          <span>{{ currentQuestionIndex + 1 }} / {{ totalQuestions }}</span>
        </div>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-else class="loading-container">
      <div class="loading-spinner">
        <em class="fas fa-spinner fa-spin fa-3x"></em>
      </div>
      <p>Loading quiz questions...</p>
    </div>
    
  </Game>
</template>

<script>
import Game from "../Game.vue";
import ImageContainer from "../ImageContainer.vue";
import { SoundUtils } from "../utils/SoundUtils";
import translationMixin from "@/mixins/translationMixin";
import errorLogger from "@/utils/ErrorLogger";

export default {
  name: "QuizGame",
  components: { Game, ImageContainer },
  mixins: [translationMixin],
  data() {
    return {
      currentQuestionIndex: 0,
      selectedAnswer: null,
      isCorrect: false,
      showResult: false,
      score: 0,
      questions: [],
      totalQuestions: 10,
      languageUnsubscribe: null
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex] || {};
    }
  },
  mounted() {
    // Play explanation sound
    SoundUtils.playExplanation('quiz');
    
    // Generate questions immediately
    this.generateQuestions();
    
    // Subscribe to language changes and regenerate questions
    this.languageUnsubscribe = this.subscribe(() => {
      this.restart();
    });
  },
  beforeUnmount() {
    if (this.languageUnsubscribe) {
      this.languageUnsubscribe();
    }
  },
  methods: {
    generateQuestions() {
      this.questions = [];
      
      // Simple equal distribution without BKT complexity
      const perType = Math.floor(this.totalQuestions / 3);
      const remainder = this.totalQuestions % 3;
      
      // Generate questions for each type
      for (let i = 0; i < perType; i++) {
        this.questions.push(this.createQuestion('object'));
        this.questions.push(this.createQuestion('letter'));
        this.questions.push(this.createQuestion('number'));
      }
      
      // Add remaining questions
      for (let i = 0; i < remainder; i++) {
        const types = ['object', 'letter', 'number'];
        this.questions.push(this.createQuestion(types[i]));
      }
      
      // Shuffle questions
      this.questions = this.shuffleArray(this.questions);
      this.totalQuestions = this.questions.length;
      
      // Play the first question sound after a delay
      setTimeout(() => {
        this.playQuestionSound();
      }, 1000);
    },
    
    playQuestionSound() {
      if (this.currentQuestion && this.currentQuestion.sound) {
        const lang = SoundUtils.getLanguagePath();
        SoundUtils.play(`${lang}/${this.currentQuestion.sound}`);
      }
    },
    
    createQuestion(type) {
      if (type === 'object') {
        return this.createObjectQuestion();
      } else if (type === 'letter') {
        return this.createLetterQuestion();
      } else {
        return this.createNumberQuestion();
      }
    },
    
    createObjectQuestion() {
      const lang = this.getCurrentLanguage();
      
      // Multilingual object names
      const objectTranslations = {
        cat: { en: 'cat', tl: 'pusa', de: 'Katze' },
        dog: { en: 'dog', tl: 'aso', de: 'Hund' },
        bird: { en: 'bird', tl: 'ibon', de: 'Vogel' },
        fish: { en: 'fish', tl: 'isda', de: 'Fisch' },
        butterfly: { en: 'butterfly', tl: 'paru-paro', de: 'Schmetterling' },
        frog: { en: 'frog', tl: 'palaka', de: 'Frosch' },
        car: { en: 'car', tl: 'kotse', de: 'Auto' },
        tree: { en: 'tree', tl: 'puno', de: 'Baum' },
        dragon: { en: 'dragon', tl: 'dragon', de: 'Drache' },
        unicorn: { en: 'unicorn', tl: 'unikornyo', de: 'Einhorn' },
        penguin: { en: 'penguin', tl: 'penguin', de: 'Pinguin' },
        chicken: { en: 'chicken', tl: 'manok', de: 'Huhn' },
        goat: { en: 'goat', tl: 'kambing', de: 'Ziege' },
        dino: { en: 'dinosaur', tl: 'dinosaur', de: 'Dinosaurier' },
        rabbit: { en: 'rabbit', tl: 'kuneho', de: 'Hase' },
        snail: { en: 'snail', tl: 'suso', de: 'Schnecke' }
      };
      
      const objects = [
        { key: 'cat', image: '/img/cat1.png', sound: 'words/cat' },
        { key: 'dog', image: '/img/dog1.svg', sound: 'words/dog' },
        { key: 'bird', image: '/img/bird1.svg', sound: 'words/bird' },
        { key: 'fish', image: '/img/fish1.svg', sound: 'words/fish' },
        { key: 'butterfly', image: '/img/butterfly.svg', sound: 'words/butterfly' },
        { key: 'frog', image: '/img/frog1.svg', sound: 'words/frog' },
        { key: 'car', image: '/img/car1.svg', sound: 'words/car' },
        { key: 'tree', image: '/img/tree1.svg', sound: 'words/tree' },
        { key: 'dragon', image: '/img/dragon1.svg', sound: 'words/dragon' },
        { key: 'unicorn', image: '/img/unicorn1.svg', sound: 'words/unicorn' },
        { key: 'penguin', image: '/img/penguin1.svg', sound: 'words/penguin' },
        { key: 'chicken', image: '/img/chicken1.svg', sound: 'words/chicken' },
        { key: 'goat', image: '/img/goat1.svg', sound: 'words/goat' },
        { key: 'dino', image: '/img/dino1.svg', sound: 'words/dino' },
        { key: 'rabbit', image: '/img/rabbit1.svg', sound: 'words/rabbit' },
        { key: 'snail', image: '/img/snail1.svg', sound: 'words/snail' }
      ];
      
      const correct = objects[Math.floor(Math.random() * objects.length)];
      const correctName = objectTranslations[correct.key][lang === 'tl' ? 'tl' : lang === 'de' ? 'de' : 'en'];
      
      const wrongObjects = objects
        .filter(obj => obj.key !== correct.key)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      const allChoiceObjects = [correct, ...wrongObjects];
      const choices = this.shuffleArray(allChoiceObjects.map(obj => ({
        name: objectTranslations[obj.key][lang === 'tl' ? 'tl' : lang === 'de' ? 'de' : 'en'],
        image: obj.image,
        key: obj.key
      })));
      
      return {
        type: 'object',
        image: correct.image,
        correctAnswer: correctName,
        choices: choices,
        sound: correct.sound
      };
    },
    
    createLetterQuestion() {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      const correct = letters[Math.floor(Math.random() * letters.length)];
      const wrongChoices = letters
        .filter(l => l !== correct)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      const choices = this.shuffleArray([correct, ...wrongChoices]);
      
      return {
        type: 'letter',
        display: correct,
        correctAnswer: correct,
        choices: choices,
        sound: `letters-numbers/${correct.toLowerCase()}`
      };
    },
    
    createNumberQuestion() {
      const numbers = Array.from({ length: 10 }, (_, i) => i + 1); // 1-10 instead of 0-9
      const correct = numbers[Math.floor(Math.random() * numbers.length)];
      const wrongChoices = numbers
        .filter(n => n !== correct)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      const choices = this.shuffleArray([correct, ...wrongChoices]);
      
      return {
        type: 'number',
        display: correct.toString(),
        correctAnswer: correct.toString(),
        choices: choices.map(n => n.toString()),
        sound: `letters-numbers/${correct}`
      };
    },
    
    getQuestionText() {
      const lang = this.getCurrentLanguage();
      const type = this.currentQuestion.type;
      
      const texts = {
        en: {
          object: 'Find the',
          letter: 'What letter is this?',
          number: 'What number is this?'
        },
        tl: {
          object: 'Hanapin ang',
          letter: 'Anong letra ito?',
          number: 'Anong numero ito?'
        },
        de: {
          object: 'Finde das',
          letter: 'Welcher Buchstabe ist das?',
          number: 'Welche Zahl ist das?'
        }
      };
      
      let text = texts[lang]?.[type] || texts.en[type];
      
      if (type === 'object') {
        text += ` "${this.currentQuestion.correctAnswer}"`;
      }
      
      return text;
    },
    
    getChoiceIcon() {
      const type = this.currentQuestion.type;
      if (type === 'object') return '🖼️';
      if (type === 'letter') return '🔤';
      if (type === 'number') return '🔢';
      return '❓';
    },
    
    getChoiceText(choice) {
      // For object questions, choice is an object with name property
      if (typeof choice === 'object' && choice.name) {
        return choice.name;
      }
      // For letter/number questions, choice is a string
      return choice;
    },
    
    isChoiceSelected(choice) {
      if (typeof choice === 'object' && choice.name) {
        return this.selectedAnswer?.name === choice.name;
      }
      return this.selectedAnswer === choice;
    },
    
    selectAnswer(choice) {
      if (this.selectedAnswer !== null) return;
      
      this.selectedAnswer = choice;
      this.showResult = true;
      const answerText = this.getChoiceText(choice);
      this.isCorrect = answerText === this.currentQuestion.correctAnswer;
      
      if (this.isCorrect) {
        this.score++;
        SoundUtils.playSuccess();
        this.emitter.emit("showReward", 1);
      } else {
        SoundUtils.playError();
      }
      
      // Play the sound for the correct answer after a short delay
      setTimeout(() => {
        this.playQuestionSound();
      }, 500);
      
      // Auto advance after delay (like color identification game)
      setTimeout(() => {
        if (this.currentQuestionIndex < this.totalQuestions - 1) {
          this.nextQuestion();
        } else {
          this.gameComplete();
        }
      }, 2000);
      
      errorLogger.logInfo('Quiz answer selected', {
        question: this.currentQuestionIndex,
        type: this.currentQuestion.type,
        correct: this.isCorrect
      });
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
    
    nextQuestion() {
      if (this.currentQuestionIndex < this.totalQuestions - 1) {
        this.currentQuestionIndex++;
        this.selectedAnswer = null;
        this.showResult = false;
        this.isCorrect = false;
        
        // Play the new question sound after a short delay
        setTimeout(() => {
          this.playQuestionSound();
        }, 500);
      }
    },
    
    previousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
        this.selectedAnswer = null;
        this.showResult = false;
        this.isCorrect = false;
        
        // Play the question sound
        setTimeout(() => {
          this.playQuestionSound();
        }, 500);
      }
    },
    
    restart() {
      this.currentQuestionIndex = 0;
      this.selectedAnswer = null;
      this.showResult = false;
      this.isCorrect = false;
      this.score = 0;
      this.generateQuestions();
    },
    
    shuffleArray(array) {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    }
  }
};
</script>

<style scoped lang="scss">
.quiz-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
  height: auto;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: calc(100vh - 120px);
  
  @media (max-width: 768px) {
    gap: 20px;
    padding: 15px;
    max-height: calc(100vh - 100px);
  }
}

.question-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 30px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    padding: 20px;
  }
}

.question-prompt {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  color: #ffffff;
  
  em {
    font-size: 2rem;
    color: #fbbf24;
  }
  
  h2 {
    font-size: 1.8rem;
    margin: 0;
    font-weight: 600;
    
    @media (max-width: 768px) {
      font-size: 1.4rem;
    }
  }
}

.question-image {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 280px;
  padding: 15px;
  margin-bottom: 20px;
  
  ::v-deep .quiz-image {
    width: 100%;
    max-width: 400px;
    height: 280px;
    
    .wrapper {
      width: 100% !important;
      height: 100% !important;
      min-height: 280px !important;
      max-width: 400px !important;
      background-color: transparent !important;
    }
    
    img {
      position: relative !important;
      width: auto !important;
      height: 100% !important;
      max-width: 100% !important;
      max-height: 100% !important;
      object-fit: contain !important;
    }
    
    @media (max-width: 768px) {
      max-width: 300px;
      height: 220px;
      
      .wrapper {
        min-height: 220px !important;
        max-width: 300px !important;
      }
    }
  }
}

.question-text {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  
  .display-character {
    font-size: 8rem;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    
    @media (max-width: 768px) {
      font-size: 5rem;
    }
  }
  
  .display-character-image {
    width: 280px;
    height: 280px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
    }
    
    @media (max-width: 768px) {
      width: 200px;
      height: 200px;
    }
  }
}

.choices-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

.choice-button {
  padding: 20px 25px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  min-height: 120px;
  
  .choice-image {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }
  
  .choice-character-image {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }
  
  .choice-icon {
    font-size: 1.8rem;
  }
  
  .choice-text {
    text-align: center;
    font-size: 1.1rem;
  }
  
  &:hover:not(.disabled) {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.6);
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.5) 0%, rgba(118, 75, 162, 0.5) 100%);
  }
  
  &:active:not(.disabled) {
    transform: translateY(-1px);
  }
  
  &.correct {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border-color: #34d399;
    animation: correctPulse 0.5s ease;
  }
  
  &.incorrect {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    border-color: #f87171;
    animation: shake 0.5s ease;
  }
  
  &.disabled {
    opacity: 0.6;
    cursor: default;
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    padding: 18px 20px;
    font-size: 1.1rem;
    
    .choice-icon {
      font-size: 1.5rem;
    }
    
    .choice-character-image {
      width: 50px;
      height: 50px;
    }
  }
}

@keyframes correctPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.score-section {
  display: flex;
  justify-content: center;
  gap: 40px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  
  @media (max-width: 768px) {
    gap: 25px;
    padding: 15px;
  }
}

.score-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  
  em {
    font-size: 1.8rem;
    color: #fbbf24;
  }
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    
    em {
      font-size: 1.5rem;
    }
  }
}
</style>
