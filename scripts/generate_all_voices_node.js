#!/usr/bin/env node
const gtts = require('node-gtts')('en');
const fs = require('fs');
const path = require('path');

// Numbers in English and Filipino
const NUMBERS = {
  '0': { en: 'zero', tl: 'sero' },
  '1': { en: 'one', tl: 'isa' },
  '2': { en: 'two', tl: 'dalawa' },
  '3': { en: 'three', tl: 'tatlo' },
  '4': { en: 'four', tl: 'apat' },
  '5': { en: 'five', tl: 'lima' },
  '6': { en: 'six', tl: 'anim' },
  '7': { en: 'seven', tl: 'pito' },
  '8': { en: 'eight', tl: 'walo' },
  '9': { en: 'nine', tl: 'siyam' },
  '10': { en: 'ten', tl: 'sampu' },
  '11': { en: 'eleven', tl: 'labing-isa' },
  '12': { en: 'twelve', tl: 'labindalawa' },
  '13': { en: 'thirteen', tl: 'labintatlo' },
  '14': { en: 'fourteen', tl: 'labing-apat' },
  '15': { en: 'fifteen', tl: 'labinlima' },
  '16': { en: 'sixteen', tl: 'labing-anim' },
  '17': { en: 'seventeen', tl: 'labimpito' },
  '18': { en: 'eighteen', tl: 'labing-walo' },
  '19': { en: 'nineteen', tl: 'labinsiyam' },
  '20': { en: 'twenty', tl: 'dalawampu' }
};

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

const WORDS = {
  ambulance: { en: 'ambulance', tl: 'ambulansya' },
  ape: { en: 'ape', tl: 'unggoy' },
  au: { en: 'ouch', tl: 'aray' },
  bird: { en: 'bird', tl: 'ibon' },
  black: { en: 'black', tl: 'itim' },
  blue_whale: { en: 'blue whale', tl: 'asul na balyena' },
  blue: { en: 'blue', tl: 'asul' },
  brown: { en: 'brown', tl: 'kayumanggi' },
  bunny: { en: 'bunny', tl: 'kuneho' },
  butt: { en: 'butt', tl: 'puwit' },
  butterfly: { en: 'butterfly', tl: 'paru-paro' },
  car: { en: 'car', tl: 'kotse' },
  cat: { en: 'cat', tl: 'pusa' },
  chicken: { en: 'chicken', tl: 'manok' },
  christmas_tree: { en: 'christmas tree', tl: 'puno ng pasko' },
  dad: { en: 'dad', tl: 'tatay' },
  damian: { en: 'Damian', tl: 'Damian' },
  dino: { en: 'dinosaur', tl: 'dinosaur' },
  dog: { en: 'dog', tl: 'aso' },
  dragon: { en: 'dragon', tl: 'dragon' },
  elephant: { en: 'elephant', tl: 'elepante' },
  fire_department: { en: 'fire department', tl: 'bumbero' },
  fire_engine: { en: 'fire engine', tl: 'trak ng bumbero' },
  fish: { en: 'fish', tl: 'isda' },
  fox: { en: 'fox', tl: 'soro' },
  frog: { en: 'frog', tl: 'palaka' },
  giraffe: { en: 'giraffe', tl: 'hiraphe' },
  goat: { en: 'goat', tl: 'kambing' },
  gorilla: { en: 'gorilla', tl: 'gorila' },
  grandma: { en: 'grandma', tl: 'lola' },
  grandpa: { en: 'grandpa', tl: 'lolo' },
  green: { en: 'green', tl: 'berde' },
  grey: { en: 'grey', tl: 'kulay-abo' },
  gudrun: { en: 'Gudrun', tl: 'Gudrun' },
  he: { en: 'he', tl: 'siya' },
  hi: { en: 'hi', tl: 'kumusta' },
  horse: { en: 'horse', tl: 'kabayo' },
  howmuch_is: { en: 'how much is', tl: 'magkano ang' },
  human: { en: 'human', tl: 'tao' },
  ice: { en: 'ice', tl: 'yelo' },
  is: { en: 'is', tl: 'ay' },
  it: { en: 'it', tl: 'ito' },
  katrin: { en: 'Katrin', tl: 'Katrin' },
  laugh1: { en: 'haha', tl: 'haha' },
  laugh2: { en: 'hehe', tl: 'hehe' },
  laugh3: { en: 'hoho', tl: 'hoho' },
  light_blue: { en: 'light blue', tl: 'mapusyaw na asul' },
  mama: { en: 'mama', tl: 'nanay' },
  man: { en: 'man', tl: 'lalaki' },
  milina: { en: 'Milina', tl: 'Milina' },
  milinia: { en: 'Milinia', tl: 'Milinia' },
  minus: { en: 'minus', tl: 'minus' },
  ninja: { en: 'ninja', tl: 'ninja' },
  no: { en: 'no', tl: 'hindi' },
  orange: { en: 'orange', tl: 'kahel' },
  owl: { en: 'owl', tl: 'kuwago' },
  panda: { en: 'panda', tl: 'panda' },
  penguin: { en: 'penguin', tl: 'penguin' },
  plus: { en: 'plus', tl: 'plus' },
  police: { en: 'police', tl: 'pulis' },
  purple: { en: 'purple', tl: 'lila' },
  quatsch1: { en: 'nonsense', tl: 'kalokohan' },
  rainbow_fish: { en: 'rainbow fish', tl: 'bahaghari na isda' },
  rainbow: { en: 'rainbow', tl: 'bahaghari' },
  red: { en: 'red', tl: 'pula' },
  rhino: { en: 'rhino', tl: 'rinoseronte' },
  rosy: { en: 'rosy', tl: 'rosas' },
  rudi: { en: 'Rudi', tl: 'Rudi' },
  santa: { en: 'santa', tl: 'santa' },
  snail: { en: 'snail', tl: 'suso' },
  snowman: { en: 'snowman', tl: 'taong niyebe' },
  the_das: { en: 'the', tl: 'ang' },
  the_der: { en: 'the', tl: 'ang' },
  the_die: { en: 'the', tl: 'ang' },
  tiger: { en: 'tiger', tl: 'tigre' },
  tim: { en: 'Tim', tl: 'Tim' },
  tractor: { en: 'tractor', tl: 'traktor' },
  tree: { en: 'tree', tl: 'puno' },
  unicorn: { en: 'unicorn', tl: 'unikornyo' },
  what: { en: 'what', tl: 'ano' },
  white: { en: 'white', tl: 'puti' },
  why: { en: 'why', tl: 'bakit' },
  wie: { en: 'how', tl: 'paano' },
  yan: { en: 'Yan', tl: 'Yan' },
  yellow: { en: 'yellow', tl: 'dilaw' },
  yes: { en: 'yes', tl: 'oo' },
  you: { en: 'you', tl: 'ikaw' },
  zoo: { en: 'zoo', tl: 'zoo' },
  affe: { en: 'monkey', tl: 'unggoy' },
  blauwal: { en: 'blue whale', tl: 'asul na balyena' },
  da: { en: 'there', tl: 'doon' },
  drache: { en: 'dragon', tl: 'dragon' },
  du: { en: 'you', tl: 'ikaw' },
  ei: { en: 'egg', tl: 'itlog' },
  elefant: { en: 'elephant', tl: 'elepante' },
  er: { en: 'he', tl: 'siya' },
  es: { en: 'it', tl: 'ito' },
  fisch: { en: 'fish', tl: 'isda' },
  fuchs: { en: 'fox', tl: 'soro' },
  hamster: { en: 'hamster', tl: 'hamster' },
  huhn: { en: 'chicken', tl: 'manok' },
  ist: { en: 'is', tl: 'ay' },
  istgleich: { en: 'equals', tl: 'katumbas' },
  ja: { en: 'yes', tl: 'oo' },
  nashorn: { en: 'rhino', tl: 'rinoseronte' },
  oma: { en: 'grandma', tl: 'lola' },
  opa: { en: 'grandpa', tl: 'lolo' },
  papa: { en: 'dad', tl: 'tatay' },
  pferd: { en: 'horse', tl: 'kabayo' },
  pinguin: { en: 'penguin', tl: 'penguin' },
  po: { en: 'butt', tl: 'puwit' },
  super: { en: 'super', tl: 'super' },
  vogel: { en: 'bird', tl: 'ibon' },
  zu: { en: 'to', tl: 'sa' }
};

const EXPLANATIONS = {
  calculation0To18: { en: 'Calculation from 0 to 18', tl: 'Pagkalkula mula 0 hanggang 18' },
  dragdrop_buildwords: { en: 'Drag and drop to build words', tl: 'I-drag at i-drop upang bumuo ng mga salita' },
  dragdrop_characters: { en: 'Drag and drop the characters', tl: 'I-drag at i-drop ang mga karakter' },
  memory: { en: 'Memory game', tl: 'Larong memorya' },
  quiz: { en: 'Quiz Game - Identify objects, letters and numbers', tl: 'Laro ng Pagsusulit - Kilalanin ang mga bagay, titik at numero' },
  t2s: { en: 'Text to speech', tl: 'Teksto sa pananalita' }
};

const HELPERS = {
  aber_wir_brauchen_ein: { en: 'But we need a', tl: 'Ngunit kailangan natin ng' },
  das_ist_eine: { en: 'This is a', tl: 'Ito ay isang' },
  du_hast_ein: { en: 'You have a', tl: 'Mayroon kang' },
  next_level: { en: 'Next level', tl: 'Susunod na antas' },
  nicht_ganz_richtig: { en: 'Not quite right', tl: 'Hindi tama' },
  super_und_jetzt_ein: { en: 'Great! And now a', tl: 'Magaling! At ngayon ang' },
  und_eine: { en: 'And a', tl: 'At ang' },
  wir_schreiben_das_wort: { en: 'We write the word', tl: 'Isusulat natin ang salita' }
};

function generateAudio(text, lang, outputPath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const tts = require('node-gtts')(lang);
    tts.save(outputPath, text, (err) => {
      if (err) {
        console.log(`✗ ${path.basename(outputPath)}`);
        reject(err);
      } else {
        console.log(`✓ ${path.basename(outputPath)}`);
        resolve();
      }
    });
  });
}

async function main() {
  const basePath = path.join(__dirname, '..', 'public', 'sounds');
  let success = 0;
  let errors = 0;

  console.log('🎙️  AI Voice Translation Generator');
  console.log('='.repeat(60));

  try {
    // 1. Letters & Numbers
    console.log('\n📝 Generating Letters & Numbers...');
    for (const letter of LETTERS) {
      try {
        await generateAudio(letter, 'en', path.join(basePath, 'english', 'letters-numbers', `${letter}.mp3`));
        success++;
      } catch (e) { errors++; }
      
      try {
        await generateAudio(letter, 'tl', path.join(basePath, 'filipino', 'letters-numbers', `${letter}.mp3`));
        success++;
      } catch (e) { errors++; }
    }

    for (const [num, trans] of Object.entries(NUMBERS)) {
      try {
        await generateAudio(trans.en, 'en', path.join(basePath, 'english', 'letters-numbers', `${num}.mp3`));
        success++;
      } catch (e) { errors++; }
      
      try {
        await generateAudio(trans.tl, 'tl', path.join(basePath, 'filipino', 'letters-numbers', `${num}.mp3`));
        success++;
      } catch (e) { errors++; }
    }

    // 2. Explanations
    console.log('\n📚 Generating Explanations...');
    for (const [filename, trans] of Object.entries(EXPLANATIONS)) {
      try {
        await generateAudio(trans.en, 'en', path.join(basePath, 'english', 'explanation', `${filename}.mp3`));
        success++;
      } catch (e) { errors++; }
      
      try {
        await generateAudio(trans.tl, 'tl', path.join(basePath, 'filipino', 'explanation', `${filename}.mp3`));
        success++;
      } catch (e) { errors++; }
    }

    // 3. Helpers
    console.log('\n🤝 Generating Helpers...');
    for (const [filename, trans] of Object.entries(HELPERS)) {
      try {
        await generateAudio(trans.en, 'en', path.join(basePath, 'english', 'helpers', `${filename}.mp3`));
        success++;
      } catch (e) { errors++; }
      
      try {
        await generateAudio(trans.tl, 'tl', path.join(basePath, 'filipino', 'helpers', `${filename}.mp3`));
        success++;
      } catch (e) { errors++; }
    }

    // 4. Words
    console.log('\n📖 Generating Words...');
    for (const [filename, trans] of Object.entries(WORDS)) {
      try {
        await generateAudio(trans.en, 'en', path.join(basePath, 'english', 'words', `${filename}.mp3`));
        success++;
      } catch (e) { errors++; }
      
      try {
        await generateAudio(trans.tl, 'tl', path.join(basePath, 'filipino', 'words', `${filename}.mp3`));
        success++;
      } catch (e) { errors++; }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Success: ${success} files`);
    if (errors > 0) {
      console.log(`❌ Errors: ${errors} files`);
    }
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
