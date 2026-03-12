# 🧠 BKT Implementation Guide

## Overview

The quiz game now uses **Bayesian Knowledge Tracing (BKT)** to adapt to each student's learning needs and track skill mastery!

## ✨ What is BKT?

**Bayesian Knowledge Tracing** is an algorithm that:
- **Models student knowledge** as a probability (0-100%)
- **Updates beliefs** based on correct/incorrect answers
- **Adapts difficulty** to optimal challenge level
- **Predicts performance** for future questions
- **Tracks mastery** across multiple skills

## 🎯 How It Works

### Four Key Parameters

1. **P(L₀) - Initial Knowledge** (30%)
   - Starting probability that student knows the skill
   - Set conservatively to allow learning

2. **P(T) - Learning Rate** (15%)
   - Probability of learning after each correct answer
   - Higher = faster mastery progression

3. **P(S) - Slip Rate** (10%)
   - Probability of mistake even when skill is known
   - Accounts for careless errors

4. **P(G) - Guess Rate** (25%)
   - Probability of correct guess when skill unknown
   - Based on 4 multiple choice options (25%)

### Update Process

```
Student answers question → BKT updates knowledge probability

If CORRECT:
  P(L|correct) = P(L) × (1 - P(S)) / [P(L) × (1 - P(S)) + (1 - P(L)) × P(G)]
  Then: P(L_new) = P(L) + (1 - P(L)) × P(T)

If WRONG:
  P(L|wrong) = P(L) × P(S) / [P(L) × P(S) + (1 - P(L)) × (1 - P(G))]
  Then: P(L_new) = P(L) + (1 - P(L)) × P(T)
```

## 📊 Three Skills Tracked

### 1. Letters (🔤)
- Alphabet recognition (A-Z)
- Letter identification
- Visual discrimination

### 2. Numbers (🔢)
- Number recognition (0-20)
- Counting skills
- Numerical literacy

### 3. Objects (🖼️)
- Object identification
- Vocabulary building
- Visual recognition

## 🎮 Adaptive Features

### 1. Dynamic Question Distribution

**Before BKT** (Fixed):
- 5 object questions
- 3 letter questions
- 2 number questions

**With BKT** (Adaptive):
- More questions for skills with lower mastery
- Fewer questions for mastered skills
- Optimal practice distribution

**Example**:
```
Letters: 30% mastery → 5 questions
Numbers: 60% mastery → 3 questions
Objects: 80% mastery → 2 questions
```

### 2. Difficulty Levels

| Mastery | Difficulty | Description |
|---------|-----------|-------------|
| 0-40% | Easy | Basic practice needed |
| 40-70% | Medium | Building confidence |
| 70-90% | Hard | Challenge for mastery |
| 90-100% | Expert | Maintain mastery |

### 3. Mastery Threshold

- **Mastered**: ≥ 80% probability
- **In Progress**: 40-80% probability
- **Needs Practice**: < 40% probability

## 📱 User Interface

### Mastery Panel

**Access**: Click the chart icon (📊) in score section

**Displays**:
- Real-time mastery percentage for each skill
- Progress bars with color gradients
- Accuracy statistics
- Number of attempts
- Current difficulty level
- Mastery badges (✓ Mastered)

**Features**:
- Slide-up animation
- Color-coded difficulty levels
- Reset progress button
- Responsive design

### Visual Indicators

**Progress Bar Colors**:
- 🟣 Purple (0-50%): Learning
- 🔵 Blue (50-80%): Progressing
- 🟢 Green (80-100%): Mastered

**Difficulty Badges**:
- 🟢 Easy: Green
- 🟡 Medium: Yellow
- 🔴 Hard: Red
- 🟣 Expert: Purple

## 💾 Data Persistence

### localStorage Storage

**Keys**:
- `bkt_skills`: Skill parameters and statistics
- `bkt_history`: Recent answer history (last 100)

**Data Structure**:
```javascript
{
  letters: {
    pL: 0.65,           // Current mastery
    pT: 0.15,           // Learning rate
    pS: 0.1,            // Slip rate
    pG: 0.25,           // Guess rate
    attempts: 15,       // Total attempts
    correct: 12,        // Correct answers
    lastUpdated: 1234567890
  },
  // ... numbers, objects
}
```

### History Tracking

```javascript
[
  {
    skill: 'letters',
    isCorrect: true,
    oldPL: 0.60,
    newPL: 0.65,
    timestamp: 1234567890
  },
  // ... up to 100 recent entries
]
```

## 🔧 API Reference

### BKTModel Class

#### Methods

**updateKnowledge(skill, isCorrect)**
- Updates knowledge probability based on answer
- Parameters:
  - `skill`: 'letters', 'numbers', or 'objects'
  - `isCorrect`: boolean
- Returns: void

**getMastery(skill)**
- Get current mastery probability (0-1)
- Returns: number

**getMasteryPercent(skill)**
- Get mastery as percentage (0-100)
- Returns: number

**getDifficulty(skill)**
- Get recommended difficulty level
- Returns: 'easy' | 'medium' | 'hard' | 'expert'

**isMastered(skill)**
- Check if skill is mastered (≥80%)
- Returns: boolean

**getAllMastery()**
- Get complete mastery data for all skills
- Returns: object with all skill data

**getRecommendedQuestionCount(totalQuestions)**
- Calculate optimal question distribution
- Returns: { letters, numbers, objects }

**getWeakestSkill()**
- Find skill needing most practice
- Returns: skill name

**getStrongestSkill()**
- Find most mastered skill
- Returns: skill name

**resetSkill(skill)**
- Reset specific skill to defaults
- Returns: void

**resetAll()**
- Reset all skills and history
- Returns: void

**exportData()**
- Export all data for analysis
- Returns: complete data object

### Usage Example

```javascript
import bktModel from '@/utils/BKTModel';

// Update after answer
bktModel.updateKnowledge('letters', true);

// Check mastery
const mastery = bktModel.getMasteryPercent('letters');
console.log(`Letters mastery: ${mastery}%`);

// Get difficulty
const difficulty = bktModel.getDifficulty('numbers');
console.log(`Recommended difficulty: ${difficulty}`);

// Check if mastered
if (bktModel.isMastered('objects')) {
  console.log('Objects skill mastered!');
}

// Get question distribution
const counts = bktModel.getRecommendedQuestionCount(10);
// { letters: 4, numbers: 3, objects: 3 }
```

## 📈 Learning Analytics

### Metrics Tracked

1. **Mastery Probability** (0-100%)
   - Real-time knowledge state
   - Updated after each answer

2. **Accuracy** (0-100%)
   - Correct / Total attempts
   - Simple performance metric

3. **Attempts Count**
   - Total questions answered
   - Practice volume indicator

4. **Difficulty Level**
   - Current challenge level
   - Adaptive recommendation

5. **Mastery Status**
   - Boolean mastered flag
   - Achievement indicator

### Example Analytics

```javascript
const analytics = bktModel.getAllMastery();

/*
{
  letters: {
    mastery: 65,        // 65% probability
    difficulty: 'medium',
    isMastered: false,
    attempts: 15,
    accuracy: 80        // 80% correct
  },
  numbers: {
    mastery: 85,
    difficulty: 'hard',
    isMastered: true,
    attempts: 20,
    accuracy: 90
  },
  objects: {
    mastery: 45,
    difficulty: 'easy',
    isMastered: false,
    attempts: 10,
    accuracy: 60
  }
}
*/
```

## 🎯 Educational Benefits

### For Students

✅ **Personalized Learning**
- Questions adapt to skill level
- Optimal challenge zone
- Faster mastery

✅ **Clear Progress**
- Visual mastery indicators
- Achievement badges
- Motivating feedback

✅ **Efficient Practice**
- Focus on weak areas
- Less repetition of mastered skills
- Better time use

### For Teachers/Parents

✅ **Track Progress**
- Real-time mastery data
- Skill-by-skill breakdown
- Historical trends

✅ **Identify Gaps**
- See which skills need work
- Accuracy vs mastery comparison
- Targeted intervention

✅ **Measure Effectiveness**
- Objective mastery metrics
- Learning rate tracking
- Data-driven decisions

## 🔬 Research Basis

### BKT Origins

- **Developed**: Carnegie Mellon University
- **Used in**: Intelligent Tutoring Systems
- **Proven**: Decades of research
- **Applications**: Khan Academy, ASSISTments, etc.

### Key Papers

1. Corbett & Anderson (1995) - "Knowledge Tracing: Modeling the Acquisition of Procedural Knowledge"
2. Pardos & Heffernan (2010) - "Modeling Individualization in a Bayesian Networks Implementation of Knowledge Tracing"

## 🚀 Future Enhancements

### Possible Additions

1. **Item-Level Tracking**
   - Track individual questions
   - More granular mastery

2. **Multi-Skill Questions**
   - Questions requiring multiple skills
   - Complex knowledge modeling

3. **Temporal Factors**
   - Forgetting curves
   - Spaced repetition

4. **Contextual Factors**
   - Time of day
   - Session length
   - Fatigue modeling

5. **Collaborative Filtering**
   - Learn from other students
   - Better parameter estimation

6. **Visualization**
   - Learning curves over time
   - Skill relationship graphs
   - Progress reports

## 🐛 Troubleshooting

### Reset Not Working?
- Check browser console for errors
- Verify localStorage is enabled
- Try hard refresh (Ctrl+Shift+R)

### Mastery Not Updating?
- Ensure questions are being answered
- Check console for BKT update logs
- Verify localStorage has space

### Panel Not Showing?
- Click the chart icon (📊)
- Check if panel is hidden behind content
- Try different screen size

## 📊 Performance Impact

### Storage
- **Per Skill**: ~200 bytes
- **History**: ~10 KB (100 entries)
- **Total**: < 15 KB

### Computation
- **Per Update**: < 1ms
- **Question Generation**: < 5ms
- **Negligible Impact**: On app performance

## ✨ Summary

**BKT Implementation Adds**:
- ✅ Adaptive question selection
- ✅ Real-time mastery tracking
- ✅ Personalized learning paths
- ✅ Visual progress indicators
- ✅ Data-driven difficulty
- ✅ Educational effectiveness

**Result**: A smarter, more effective learning experience that adapts to each student's needs! 🎓🧠✨
