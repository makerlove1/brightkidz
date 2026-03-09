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
            'correct': isChoiceSelected(choice) && isCorrect,
            'incorrect': isChoiceSelected(choice) && !isCorrect && selectedAnswer !== null,
            'disabled': selectedAnswer !== null
          }"
          :disabled="selectedAnswer !== null"
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
        <button @click="showMasteryPanel = !showMasteryPanel" class="mastery-toggle">
          <em class="fas fa-chart-line"></em>
        </button>
      </div>

      <!-- BKT Mastery Panel -->
      <transition name="slide-up">
        <div v-if="showMasteryPanel" class="mastery-panel">
          <div class="mastery-header">
            <h3><em class="fas fa-brain"></em> Skill Mastery (BKT)</h3>
            <button @click="showMasteryPanel = false" class="close-btn">
              <em class="fas fa-times"></em>
            </button>
          </div>
          
          <div class="mastery-skills">
            <div v-for="(data, skill) in bkt.getAllMastery()" :key="skill" class="skill-card">
              <div class="skill-header">
                <span class="skill-icon">
                  {{ skill === 'letters' ? '🔤' : skill === 'numbers' ? '🔢' : '🖼️' }}
                </span>
                <span class="skill-name">{{ skill.charAt(0).toUpperCase() + skill.slice(1) }}</span>
                <span v-if="data.isMastered" class="mastered-badge">✓ Mastered</span>
              </div>
              
              <div class="mastery-bar">
                <div class="mastery-fill" :style="{ width: data.mastery + '%' }"></div>
                <span class="mastery-text">{{ data.mastery }}%</span>
              </div>
              
              <div class="skill-stats">
                <span class="stat">
                  <em class="fas fa-bullseye"></em> {{ data.accuracy }}% accuracy
                </span>
                <span class="stat">
                  <em class="fas fa-tasks"></em> {{ data.attempts }} attempts
                </span>
                <span class="stat difficulty" :class="data.difficulty">
                  <em class="fas fa-signal"></em> {{ data.difficulty }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="mastery-actions">
            <button @click="resetBKT" class="reset-btn">
              <em class="fas fa-redo"></em> Reset Progress
            </button>
          </div>
        </div>
      </transition>
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
import { SoundLib } from "../utils/SoundUtils";
import languageManager from "@/utils/LanguageManager";
import errorLogger from "@/utils/ErrorLogger";
import bktModel from "@/utils/BKTModel";

export default {
  name: "QuizGame",
  components: { Game, ImageContainer },
  data() {
    return {
      currentQuestionIndex: 0,
      selectedAnswer: null,
      isCorrect: false,
      score: 0,
      questions: [],
      totalQuestions: 10,
      languageUnsubscribe: null,
      bkt: bktModel,
      showMasteryPanel: false
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex] || {};
    }
  },
  mounted() {
    // Generate questions immediately (BKT model initializes itself)
    this.generateQuestions();
    
    // Subscribe to language changes and regenerate questions
    this.languageUnsubscribe = languageManager.subscribe(() => {
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
      
      try {
        // Use BKT to determine question distribution
        const recommendedCounts = this.bkt.getRecommendedQuestionCount(this.totalQuestions);
        
        const questionTypes = [
          { type: 'object', count: recommendedCounts.objects },
          { type: 'letter', count: recommendedCounts.letters },
          { type: 'number', count: recommendedCounts.numbers }
        ];
        
        errorLogger.logInfo('BKT Question Distribution', recommendedCounts);
        
        questionTypes.forEach(({ type, count }) => {
          for (let i = 0; i < count; i++) {
            this.questions.push(this.createQuestion(type));
          }
        });
      } catch (error) {
        // Fallback: equal distribution if BKT fails
        errorLogger.logError('BKT question distribution failed, using fallback', error);
        const perType = Math.floor(this.totalQuestions / 3);
        for (let i = 0; i < perType; i++) {
          this.questions.push(this.createQuestion('object'));
          this.questions.push(this.createQuestion('letter'));
          this.questions.push(this.createQuestion('number'));
        }
      }
      
      // Shuffle questions
      this.questions = this.shuffleArray(this.questions);
      this.totalQuestions = this.questions.length;
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
      const lang = languageManager.getLanguage();
      
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
        snail: { en: 'snail', tl: 'suso', de: 'Schnecke' },
        ambulance: { en: 'ambulance', tl: 'ambulansya', de: 'Krankenwagen' },
        fireTruck: { en: 'fire truck', tl: 'trak ng bumbero', de: 'Feuerwehrauto' },
        policeCar: { en: 'police car', tl: 'kotse ng pulis', de: 'Polizeiauto' },
        tractor: { en: 'tractor', tl: 'traktor', de: 'Traktor' }
      };
      
      const objects = [
        { key: 'cat', image: '/img/cat1.png', sound: SoundLib.cat },
        { key: 'dog', image: '/img/dog1.svg', sound: SoundLib.dog },
        { key: 'bird', image: '/img/bird1.svg', sound: SoundLib.bird },
        { key: 'fish', image: '/img/fish1.svg', sound: SoundLib.fish },
        { key: 'butterfly', image: '/img/butterfly.svg', sound: SoundLib.butterfly },
        { key: 'frog', image: '/img/frog1.svg', sound: SoundLib.frog },
        { key: 'car', image: '/img/car1.svg', sound: SoundLib.car },
        { key: 'tree', image: '/img/tree1.svg', sound: SoundLib.tree },
        { key: 'dragon', image: '/img/dragon1.svg', sound: SoundLib.dragon },
        { key: 'unicorn', image: '/img/unicorn1.svg', sound: SoundLib.unicorn },
        { key: 'penguin', image: '/img/penguin1.svg', sound: SoundLib.penguin },
        { key: 'chicken', image: '/img/chicken1.svg', sound: SoundLib.chicken },
        { key: 'goat', image: '/img/goat1.svg', sound: SoundLib.goat },
        { key: 'dino', image: '/img/dino1.svg', sound: SoundLib.dino },
        { key: 'rabbit', image: '/img/rabbit1.svg', sound: SoundLib.bunny },
        { key: 'snail', image: '/img/snail1.svg', sound: SoundLib.snail },
        { key: 'ambulance', image: '/img/ambulance1.svg', sound: SoundLib.ambulance },
        { key: 'fireTruck', image: '/img/fire_truck1.svg', sound: SoundLib.fireEngine },
        { key: 'policeCar', image: '/img/police_car.svg', sound: SoundLib.police },
        { key: 'tractor', image: '/img/tractor1.svg', sound: SoundLib.tractor }
      ];
      
      const correct = objects[Math.floor(Math.random() * objects.length)];
      const correctName = objectTranslations[correct.key][lang];
      
      const wrongObjects = objects
        .filter(obj => obj.key !== correct.key)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      const allChoiceObjects = [correct, ...wrongObjects];
      const choices = this.shuffleArray(allChoiceObjects.map(obj => ({
        name: objectTranslations[obj.key][lang],
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
        sound: SoundLib[correct.toLowerCase()]
      };
    },
    
    createNumberQuestion() {
      const numbers = Array.from({ length: 10 }, (_, i) => i);
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
        sound: SoundLib[correct]
      };
    },
    
    getQuestionText() {
      const lang = languageManager.getLanguage();
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
      const answerText = this.getChoiceText(choice);
      this.isCorrect = answerText === this.currentQuestion.correctAnswer;
      
      // Update BKT model with the answer
      const skillType = this.currentQuestion.type === 'object' ? 'objects' : 
                       this.currentQuestion.type === 'letter' ? 'letters' : 'numbers';
      this.bkt.updateKnowledge(skillType, this.isCorrect);
      
      if (this.isCorrect) {
        this.score++;
        SoundLib.success1.play();
        this.emitter.emit("showReward", 1);
        
        // Play the sound for the correct answer
        if (this.currentQuestion.sound) {
          setTimeout(() => {
            this.currentQuestion.sound.play();
          }, 500);
        }
        
        // Auto advance after 2 seconds
        setTimeout(() => {
          if (this.currentQuestionIndex < this.totalQuestions - 1) {
            this.nextQuestion();
          } else {
            // Show mastery summary at end
            this.showMasteryPanel = true;
          }
        }, 2000);
      } else {
        SoundLib.error1.play();
      }
      
      errorLogger.logInfo('Quiz answer selected', {
        question: this.currentQuestionIndex,
        type: this.currentQuestion.type,
        correct: this.isCorrect,
        mastery: this.bkt.getMasteryPercent(skillType) + '%'
      });
    },
    
    nextQuestion() {
      if (this.currentQuestionIndex < this.totalQuestions - 1) {
        this.currentQuestionIndex++;
        this.selectedAnswer = null;
        this.isCorrect = false;
      }
    },
    
    previousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
        this.selectedAnswer = null;
        this.isCorrect = false;
      }
    },
    
    restart() {
      this.currentQuestionIndex = 0;
      this.selectedAnswer = null;
      this.isCorrect = false;
      this.score = 0;
      this.showMasteryPanel = false;
      this.generateQuestions();
    },
    
    resetBKT() {
      if (confirm('Reset all learning progress? This will clear your mastery data.')) {
        this.bkt.resetAll();
        this.restart();
        errorLogger.logInfo('BKT progress reset by user');
      }
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
    cursor: not-allowed;
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


.mastery-toggle {
  padding: 10px 15px;
  background: rgba(102, 126, 234, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  
  &:hover {
    background: rgba(102, 126, 234, 0.5);
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 1rem;
  }
}

.mastery-panel {
  background: linear-gradient(135deg, rgba(30, 30, 50, 0.98) 0%, rgba(20, 20, 40, 0.98) 100%);
  border: 2px solid rgba(102, 126, 234, 0.4);
  border-radius: 20px;
  padding: 25px;
  margin-top: 20px;
  backdrop-filter: blur(20px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  
  @media (max-width: 768px) {
    padding: 20px;
    margin-top: 15px;
  }
}

.mastery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(102, 126, 234, 0.3);
  
  h3 {
    color: #ffffff;
    font-size: 1.4rem;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    
    em {
      color: #fbbf24;
    }
    
    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }
  
  .close-btn {
    background: rgba(239, 68, 68, 0.2);
    border: 2px solid rgba(239, 68, 68, 0.4);
    border-radius: 8px;
    color: #ffffff;
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1.2rem;
    
    &:hover {
      background: rgba(239, 68, 68, 0.4);
      transform: scale(1.1);
    }
  }
}

.mastery-skills {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.skill-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 15px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(102, 126, 234, 0.4);
  }
}

.skill-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  
  .skill-icon {
    font-size: 1.5rem;
  }
  
  .skill-name {
    color: #ffffff;
    font-size: 1.1rem;
    font-weight: 600;
    flex: 1;
  }
  
  .mastered-badge {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: #ffffff;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 600;
  }
}

.mastery-bar {
  position: relative;
  height: 30px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 12px;
  
  .mastery-fill {
    height: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #10b981 100%);
    transition: width 0.5s ease;
    border-radius: 15px;
  }
  
  .mastery-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #ffffff;
    font-weight: 700;
    font-size: 0.9rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }
}

.skill-stats {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  
  .stat {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 5px;
    
    em {
      color: #fbbf24;
    }
    
    &.difficulty {
      padding: 4px 10px;
      border-radius: 8px;
      font-weight: 600;
      
      &.easy {
        background: rgba(34, 197, 94, 0.2);
        border: 1px solid rgba(34, 197, 94, 0.4);
        color: #4ade80;
      }
      
      &.medium {
        background: rgba(251, 191, 36, 0.2);
        border: 1px solid rgba(251, 191, 36, 0.4);
        color: #fbbf24;
      }
      
      &.hard {
        background: rgba(239, 68, 68, 0.2);
        border: 1px solid rgba(239, 68, 68, 0.4);
        color: #f87171;
      }
      
      &.expert {
        background: rgba(168, 85, 247, 0.2);
        border: 1px solid rgba(168, 85, 247, 0.4);
        color: #c084fc;
      }
    }
  }
  
  @media (max-width: 768px) {
    gap: 10px;
    
    .stat {
      font-size: 0.85rem;
    }
  }
}

.mastery-actions {
  display: flex;
  justify-content: center;
  padding-top: 15px;
  border-top: 2px solid rgba(102, 126, 234, 0.3);
  
  .reset-btn {
    padding: 12px 24px;
    background: rgba(239, 68, 68, 0.2);
    border: 2px solid rgba(239, 68, 68, 0.4);
    border-radius: 12px;
    color: #ffffff;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    
    &:hover {
      background: rgba(239, 68, 68, 0.4);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
}

// Slide up animation
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
