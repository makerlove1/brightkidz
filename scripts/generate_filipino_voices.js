#!/usr/bin/env node
const gtts = require('google-tts-api');
const fs = require('fs');
const path = require('path');
const https = require('https');

const NUMBERS = {
  '0': 'sero', '1': 'isa', '2': 'dalawa', '3': 'tatlo', '4': 'apat',
  '5': 'lima', '6': 'anim', '7': 'pito', '8': 'walo', '9': 'siyam',
  '10': 'sampu', '11': 'labing-isa', '12': 'labindalawa', '13': 'labintatlo',
  '14': 'labing-apat', '15': 'labinlima', '16': 'labing-anim', '17': 'labimpito',
  '18': 'labing-walo', '19': 'labinsiyam', '20': 'dalawampu'
};

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

const WORDS = {
  ambulance: 'ambulansya', ape: 'unggoy', au: 'aray', bird: 'ibon', black: 'itim',
  blue_whale: 'asul na balyena', blue: 'asul', brown: 'kayumanggi', bunny: 'kuneho',
  butt: 'puwit', butterfly: 'paru-paro', car: 'kotse', cat: 'pusa', chicken: 'manok',
  christmas_tree: 'puno ng pasko', dad: 'tatay', damian: 'Damian', dino: 'dinosaur',
  dog: 'aso', dragon: 'dragon', elephant: 'elepante', fire_department: 'bumbero',
  fire_engine: 'trak ng bumbero', fish: 'isda', fox: 'soro', frog: 'palaka',
  giraffe: 'hiraphe', goat: 'kambing', gorilla: 'gorila', grandma: 'lola',
  grandpa: 'lolo', green: 'berde', grey: 'kulay-abo', gudrun: 'Gudrun', he: 'siya',
  hi: 'kumusta', horse: 'kabayo', howmuch_is: 'magkano ang', human: 'tao', ice: 'yelo',
  is: 'ay', it: 'ito', katrin: 'Katrin', laugh1: 'haha', laugh2: 'hehe', laugh3: 'hoho',
  light_blue: 'mapusyaw na asul', mama: 'nanay', man: 'lalaki', milina: 'Milina',
  milinia: 'Milinia', minus: 'minus', ninja: 'ninja', no: 'hindi', orange: 'kahel',
  owl: 'kuwago', panda: 'panda', penguin: 'penguin', plus: 'plus', police: 'pulis',
  purple: 'lila', quatsch1: 'kalokohan', rainbow_fish: 'bahaghari na isda',
  rainbow: 'bahaghari', red: 'pula', rhino: 'rinoseronte', rosy: 'rosas', rudi: 'Rudi',
  santa: 'santa', snail: 'suso', snowman: 'taong niyebe', the_das: 'ang', the_der: 'ang',
  the_die: 'ang', tiger: 'tigre', tim: 'Tim', tractor: 'traktor', tree: 'puno',
  unicorn: 'unikornyo', what: 'ano', white: 'puti', why: 'bakit', wie: 'paano',
  yan: 'Yan', yellow: 'dilaw', yes: 'oo', you: 'ikaw', zoo: 'zoo',
  affe: 'unggoy', blauwal: 'asul na balyena', da: 'doon', drache: 'dragon', du: 'ikaw',
  ei: 'itlog', elefant: 'elepante', er: 'siya', es: 'ito', fisch: 'isda', fuchs: 'soro',
  hamster: 'hamster', huhn: 'manok', ist: 'ay', istgleich: 'katumbas', ja: 'oo',
  nashorn: 'rinoseronte', oma: 'lola', opa: 'lolo', papa: 'tatay', pferd: 'kabayo',
  pinguin: 'penguin', po: 'puwit', super: 'super', vogel: 'ibon', zu: 'sa'
};

const EXPLANATIONS = {
  calculation0To18: 'Pagkalkula mula 0 hanggang 18',
  dragdrop_buildwords: 'I-drag at i-drop upang bumuo ng mga salita',
  dragdrop_characters: 'I-drag at i-drop ang mga karakter',
  memory: 'Larong memorya',
  quiz: 'Laro ng Pagsusulit - Kilalanin ang mga bagay, titik at numero',
  t2s: 'Teksto sa pananalita'
};

const HELPERS = {
  aber_wir_brauchen_ein: 'Ngunit kailangan natin ng',
  das_ist_eine: 'Ito ay isang',
  du_hast_ein: 'Mayroon kang',
  next_level: 'Susunod na antas',
  nicht_ganz_richtig: 'Hindi tama',
  super_und_jetzt_ein: 'Magaling! At ngayon ang',
  und_eine: 'At ang',
  wir_schreiben_das_wort: 'Isusulat natin ang salita'
};

function downloadAudio(url, outputPath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(outputPath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✓ ${path.basename(outputPath)}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      console.log(`✗ ${path.basename(outputPath)}`);
      reject(err);
    });
  });
}

async function generateAudio(text, outputPath) {
  try {
    const url = gtts.getAudioUrl(text, {
      lang: 'tl',
      slow: false,
      host: 'https://translate.google.com',
    });
    await downloadAudio(url, outputPath);
    return true;
  } catch (error) {
    console.log(`✗ ${path.basename(outputPath)}: ${error.message}`);
    return false;
  }
}

async function main() {
  const basePath = path.join(__dirname, '..', 'public', 'sounds', 'filipino');
  let success = 0;
  let errors = 0;

  console.log('🎙️  Filipino Voice Generator');
  console.log('='.repeat(60));

  try {
    // 1. Letters & Numbers
    console.log('\n📝 Generating Letters & Numbers...');
    for (const letter of LETTERS) {
      if (await generateAudio(letter, path.join(basePath, 'letters-numbers', `${letter}.mp3`))) {
        success++;
      } else {
        errors++;
      }
      await new Promise(resolve => setTimeout(resolve, 200)); // Rate limit
    }

    for (const [num, text] of Object.entries(NUMBERS)) {
      if (await generateAudio(text, path.join(basePath, 'letters-numbers', `${num}.mp3`))) {
        success++;
      } else {
        errors++;
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // 2. Explanations
    console.log('\n📚 Generating Explanations...');
    for (const [filename, text] of Object.entries(EXPLANATIONS)) {
      if (await generateAudio(text, path.join(basePath, 'explanation', `${filename}.mp3`))) {
        success++;
      } else {
        errors++;
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // 3. Helpers
    console.log('\n🤝 Generating Helpers...');
    for (const [filename, text] of Object.entries(HELPERS)) {
      if (await generateAudio(text, path.join(basePath, 'helpers', `${filename}.mp3`))) {
        success++;
      } else {
        errors++;
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // 4. Words
    console.log('\n📖 Generating Words...');
    for (const [filename, text] of Object.entries(WORDS)) {
      if (await generateAudio(text, path.join(basePath, 'words', `${filename}.mp3`))) {
        success++;
      } else {
        errors++;
      }
      await new Promise(resolve => setTimeout(resolve, 200));
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
