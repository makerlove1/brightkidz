<template>
  <Game
    :is-highlight-animation-running="isGameComplete"
    nav-back-path="/misc"
    :explanation="explanation"
    @restart="restart"
    :current-level="selectedLevel"
    @previous="previousLevel"
    @next="nextLevel"
  >
    <div class="matching-container">
      <!-- Instructions -->
      <div class="instructions">
        <h2>{{ t('games.matching.find_pairs') }}</h2>
        <p>{{ t('games.matching.click_two_cards') }}</p>
      </div>

      <!-- Game Stats -->
      <div class="game-stats">
        <div class="stat-item">
          <em class="fas fa-trophy"></em>
          <span>{{ t('games.matching.pairs') }}: {{ matchedPairs }}/{{ totalPairs }}</span>
        </div>
        <div class="stat-item">
          <em class="fas fa-eye"></em>
          <span>{{ t('games.matching.moves') }}: {{ moves }}</span>
        </div>
        <div class="stat-item">
          <em class="fas fa-clock"></em>
          <span>{{ formatTime(gameTime) }}</span>
        </div>
      </div>

      <!-- Game Board -->
      <div class="game-board" :class="`level-${selectedLevel}`">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="card"
          :class="{
            'flipped': card.isFlipped,
            'matched': card.isMatched,
            'disabled': isProcessing
          }"
          @click="flipCard(index)"
        >
          <div class="card-inner">
            <div class="card-front">
              <em class="fas fa-question"></em>
            </div>
            <div class="card-back">
              <img :src="card.image" :alt="card.name" />
              <span class="card-name">{{ card.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Level Selection -->
      <div class="level-info">
        <h3>{{ t('games.matching.level') }} {{ selectedLevel + 1 }}</h3>
        <p>{{ getLevelDescription() }}</p>
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
  name: "MatchingGame",
  components: { Game, ErrorAnimation },
  mixins: [translationMixin],
  data() {
    return {
      selectedLevel: 0,
      levels: [
        { pairs: 6, gridCols: 4, name: 'Easy' },
        { pairs: 8, gridCols: 4, name: 'Medium' },
        { pairs: 10, gridCols: 5, name: 'Hard' }
      ],
      explanation: "matching",
      cards: [],
      flippedCards: [],
      matchedPairs: 0,
      totalPairs: 0,
      moves: 0,
      isProcessing: false,
      gameTime: 0,
      gameTimer: null,
      isGameComplete: false,
      
      // Available images for matching
      availableItems: [
        { name: 'Bird', images: ['/img/bird1.svg', '/img/bird2.svg'], sound: 'words/bird' },
        { name: 'Car', images: ['/img/car1.svg', '/img/car2.svg'], sound: 'words/car' },
        { name: 'Christmas Tree', images: ['/img/christmas_tree1.svg', '/img/christmas_tree2.svg'], sound: 'words/tree' },
        { name: 'Dino', images: ['/img/dino1.svg', '/img/dino2.svg'], sound: 'words/dino' },
        { name: 'Dragon', images: ['/img/dragon1.svg', '/img/dragon2.svg'], sound: 'words/dragon' },
        { name: 'Fire Truck', images: ['/img/fire_truck1.svg', '/img/fire_truck2.svg'], sound: 'words/fire-truck' },
        { name: 'Fish', images: ['/img/fish1.svg', '/img/fish2.svg'], sound: 'words/fish' },
        { name: 'Frog', images: ['/img/frog1.svg', '/img/frog2.svg'], sound: 'words/frog' },
        { name: 'Goat', images: ['/img/goat1.svg', '/img/goat2.svg'], sound: 'words/goat' },
        { name: 'Penguin', images: ['/img/penguin1.svg', '/img/penguin2.svg'], sound: 'words/penguin' },
        { name: 'Snail', images: ['/img/snail1.svg', '/img/snail2.svg'], sound: 'words/snail' },
        { name: 'Star', images: ['/img/star1.svg', '/img/star2.svg'], sound: 'words/star' },
        { name: 'Tractor', images: ['/img/tractor1.svg', '/img/tractor2.svg'], sound: 'words/tractor' },
        { name: 'Unicorn', images: ['/img/unicorn1.svg', '/img/unicorn2.svg'], sound: 'words/unicorn' }
      ]
    };
  },
  created() {
    SoundUtils.playExplanation(this.explanation);
    this.initializeGame();
  },
  mounted() {
    this.startTimer();
  },
  unmounted() {
    this.stopTimer();
    SoundUtils.stopAll();
  },
  methods: {
    initializeGame() {
      const level = this.levels[this.selectedLevel];
      this.totalPairs = level.pairs;
      this.matchedPairs = 0;
      this.moves = 0;
      this.flippedCards = [];
      this.isProcessing = false;
      this.isGameComplete = false;
      this.gameTime = 0;
      
      // Select random items for this level
      const selectedItems = this.shuffleArray([...this.availableItems]).slice(0, level.pairs);
      
      // Create card pairs
      this.cards = [];
      selectedItems.forEach((item, index) => {
        // Add first card of the pair
        this.cards.push({
          id: `${index}_1`,
          pairId: index,
          image: item.images[0],
          name: item.name,
          sound: item.sound,
          isFlipped: false,
          isMatched: false
        });
        
        // Add second card of the pair
        this.cards.push({
          id: `${index}_2`,
          pairId: index,
          image: item.images[1],
          name: item.name,
          sound: item.sound,
          isFlipped: false,
          isMatched: false
        });
      });
      
      // Shuffle the cards
      this.cards = this.shuffleArray(this.cards);
      
      this.startTimer();
    },
    
    flipCard(index) {
      if (this.isProcessing || this.cards[index].isFlipped || this.cards[index].isMatched) {
        return;
      }
      
      // Flip the card
      this.cards[index].isFlipped = true;
      this.flippedCards.push(index);
      
      // Play card flip sound
      SoundUtils.play('helpers/click');
      
      // If two cards are flipped, check for match
      if (this.flippedCards.length === 2) {
        this.moves++;
        this.isProcessing = true;
        
        setTimeout(() => {
          this.checkMatch();
        }, 1000);
      }
    },
    
    checkMatch() {
      const [firstIndex, secondIndex] = this.flippedCards;
      const firstCard = this.cards[firstIndex];
      const secondCard = this.cards[secondIndex];
      
      if (firstCard.pairId === secondCard.pairId) {
        // Match found!
        firstCard.isMatched = true;
        secondCard.isMatched = true;
        this.matchedPairs++;
        
        // Play success sound and the item sound
        SoundUtils.playSuccess();
        setTimeout(() => {
          const lang = SoundUtils.getLanguagePath();
          SoundUtils.play(`${lang}/${firstCard.sound}`);
        }, 500);
        
        // Check if game is complete
        if (this.matchedPairs === this.totalPairs) {
          this.completeGame();
        }
      } else {
        // No match, flip cards back
        firstCard.isFlipped = false;
        secondCard.isFlipped = false;
        SoundUtils.playError();
        this.$refs.errorAnimation.show();
      }
      
      this.flippedCards = [];
      this.isProcessing = false;
    },
    
    completeGame() {
      this.isGameComplete = true;
      this.stopTimer();
      
      // Play completion sound
      setTimeout(() => {
        SoundUtils.playBigSuccess();
        this.emitter.emit("showReward", [this.selectedLevel + 1]);
      }, 1000);
      
      // Show completion message
      setTimeout(() => {
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = this.gameTime % 60;
        alert(`${this.t('games.matching.completed')}!\n${this.t('games.matching.time')}: ${minutes}:${seconds.toString().padStart(2, '0')}\n${this.t('games.matching.moves')}: ${this.moves}`);
      }, 2000);
    },
    
    previousLevel() {
      if (this.selectedLevel > 0) {
        this.selectedLevel--;
        this.restart();
      }
    },
    
    nextLevel() {
      if (this.selectedLevel < this.levels.length - 1) {
        this.selectedLevel++;
        this.restart();
      }
    },
    
    restart() {
      this.stopTimer();
      this.initializeGame();
    },
    
    startTimer() {
      this.stopTimer();
      this.gameTimer = setInterval(() => {
        this.gameTime++;
      }, 1000);
    },
    
    stopTimer() {
      if (this.gameTimer) {
        clearInterval(this.gameTimer);
        this.gameTimer = null;
      }
    },
    
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },
    
    getLevelDescription() {
      const level = this.levels[this.selectedLevel];
      return `${level.pairs} ${this.t('games.matching.pairs_to_find')} - ${level.name}`;
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
.matching-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 15px;
    gap: 15px;
  }
}

.instructions {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  backdrop-filter: blur(10px);
  
  h2 {
    color: white;
    margin: 0 0 10px 0;
    font-size: 1.5rem;
    
    @media (max-width: 768px) {
      font-size: 1.3rem;
    }
  }
  
  p {
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
    font-size: 1.1rem;
    
    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
}

.game-stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 15px;
  backdrop-filter: blur(10px);
  
  @media (max-width: 768px) {
    gap: 20px;
    flex-wrap: wrap;
  }
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  
  em {
    color: #fbbf24;
    font-size: 1.2rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
}

.game-board {
  display: grid;
  gap: 15px;
  justify-content: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  
  &.level-0 {
    grid-template-columns: repeat(4, 1fr);
    max-width: 600px;
    margin: 0 auto;
  }
  
  &.level-1 {
    grid-template-columns: repeat(4, 1fr);
    max-width: 600px;
    margin: 0 auto;
  }
  
  &.level-2 {
    grid-template-columns: repeat(5, 1fr);
    max-width: 750px;
    margin: 0 auto;
  }
  
  @media (max-width: 768px) {
    gap: 10px;
    padding: 15px;
    
    &.level-0, &.level-1 {
      grid-template-columns: repeat(3, 1fr);
    }
    
    &.level-2 {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  
  @media (max-width: 480px) {
    &.level-0, &.level-1, &.level-2 {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}

.card {
  aspect-ratio: 1;
  perspective: 1000px;
  cursor: pointer;
  
  &.disabled {
    cursor: not-allowed;
  }
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  
  .card.flipped & {
    transform: rotateY(180deg);
  }
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.card-front {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  
  em {
    font-size: 2rem;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
}

.card-back {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  transform: rotateY(180deg);
  padding: 10px;
  
  img {
    width: 60%;
    height: 60%;
    object-fit: contain;
    margin-bottom: 8px;
  }
  
  .card-name {
    font-size: 0.9rem;
    font-weight: 600;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    
    @media (max-width: 768px) {
      font-size: 0.8rem;
    }
  }
}

.card.matched {
  .card-inner {
    transform: rotateY(180deg);
  }
  
  .card-back {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border-color: #34d399;
    animation: matchPulse 0.5s ease;
  }
}

@keyframes matchPulse {
  0%, 100% { transform: rotateY(180deg) scale(1); }
  50% { transform: rotateY(180deg) scale(1.05); }
}

.level-info {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 15px;
  backdrop-filter: blur(10px);
  
  h3 {
    color: white;
    margin: 0 0 8px 0;
    font-size: 1.3rem;
  }
  
  p {
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
    font-size: 1rem;
  }
}
</style>