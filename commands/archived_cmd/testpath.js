/* ================================================== testPath.js ======================================================

Target: Used to solve karuta date maps. 
Current Functionality: uncomment line to check meters. 
Priority: lowest

Tasks: 
[0] Clean up, read current code
[1] Read date map
[2] solve date map for path that yields the highest meters: food, drink, entertainment, ring. make sure gas > 0. 
[3] be able to pick the ring option
[4] find formula for how much AP the date yields

Notes: 
- be able to set ring importance with a ring meter: None, Mid (get only if not reject), High (get at all costs)
  - if ring importance is HIGH / MED
    - set ring meter to 0/1000 initially
    - if total meter sum < 1000 at end of run
      - if importance HIGH, search for shortest path to get ring successfully. Alert user that date will fail. 
      - MID: tell user ring cannot be obtained this run.
  - NONE: set ring meter to 1000/1000
    
===================================================================================================================== */

"use strict";

/* =====================================================================================================================
Requires
===================================================================================================================== */

const { loadImage, createCanvas, Image } = require('canvas');
const Discord = require('discord.js');
const { MessageAttachment } = require('discord.js');
const getFieldIfFound = require('../general_cmd/tools/field').getFieldIfFound;
const removeFlagIfFound = require('../general_cmd/tools/flag').removeFlagIfFound;

var moveDictionary = {
  '8': ["🔼", "Up"],
  '4': ["◀️", "Left"],
  '5': ["🔽", "Down"],
  '6': ["▶️", "Right"],
  'g': ["⛽", "Gas"],
  's': ["🥪", "Sandwich"],
  't': ["🌮", "Taco"],
  'p': ["🍝", "Pasta"],
  'j': ["🧃", "Juice"],
  'c': ["☕", "Coffee"],
  'w': ["🎡", "Wheel"],
  'f': ["🌻", "Flower"],
  'm': ["🤿", "Masks"],
  'n': ["🍹", "Nightclub"],
  'b': ["💃", "Ballroom"],
  'a': ["✈️", "Airplane"],
  'h': ["🏠", "House"],
  'l': ["🛍️", "shopping maLL"],
  'r': ["💍", "Ring"]
}

module.exports = { 
  name: 'testpath',
  alias: 'tp',
  description: '8456 as ↑←↓→, (j)uice (c)offee (n)ightclub (b)allroom etc. ',
  args: 1,
  usage: "testpath <gameboard image link> <movement string>",
  // directly callable by user. 
  // test the karuta date path given, and send an embed based on whether it works / fails + the path taken. 
  execute: async function(msg, args = []) {
    return msg.channel.send(testPath(args[0]))
    const hasRingFlag = removeFlagIfFound(args, 'r');
    let path = getFieldIfFound(args, 'p');

    // TODO: if hasRingFlag and valid path does not contain ring, go to ring
    let img = args[0];

    // TODO: if hasPathField, skip finding best path. 
    if (!path) {
      path = findBestPath(hasRingFlag);
    }

    await embedPathInfo(msg, img, path).then(toSend => {
      console.log("tosend: " + toSend); msg.channel.send (toSend)
    });
  }
}

/* =====================================================================================================================
Helper Functions
===================================================================================================================== */

// returns the best path found. 
function findBestPath(map, hasRingFlag) {
  // TODO
  return 'b';
}

// returns an embed containing all the relevant path information
async function embedPathInfo(msg, img, path) {
  // TODO
  let mapImage;
  await drawPath(msg, img, path).then(value => mapImage = value);

  console.log("mapImage in line 78: " + mapImage)

  return new Discord.MessageEmbed()
  .setColor('#0099ff') // TODO change colour based on whether date is successful
  .setTitle(`Karuta Date Path`)
  .setAuthor('a gift from your dumb bot', msg.client.user.displayAvatarURL({dynamic: true}))
  .setDescription(`Path: ${path}`)
  .setThumbnail(`${msg.author.displayAvatarURL({dynamic: true})}`)
  .addField(`Requested by ${msg.author}`)
  .addField('\u200b', '\u200b')
  .addFields(
    { name: 'Regular field title', value: 'Some value here' },
    { name: '\u200B', value: '\u200B' },
    { name: 'Inline field title', value: 'Some value here', inline: true },
    { name: 'Inline field title', value: 'Some value here', inline: true },
  )
  .addField('Inline field title', 'Some value here', true)
  // .setImage(drawPath(img, path))
  .setImage(mapImage)
  .setTimestamp()
  .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');
}

function testPath(path) {

  // gas food drink happiness
  let meters = [100, 50, 50, 75];
  let time = 100;

  function updateMeter(meterNum, change) {
    meters[meterNum] = Math.min(100, meters[meterNum] + change);
  }
  
  function parseString(str) {
    let ret = "";
    for (var i = 0; i < str.length; i++) {
      let out = "";

      // first reduce all meters and time
      updateMeter(1, -4);
      updateMeter(2, -6);
      updateMeter(3, -8);
      time = time - 4;

      // then add/subtract meters as necessary 
      const target = str.charAt(i);
      try {
        out += moveDictionary[target][1];
      } catch (e) {
        console.error(e);
      }
      switch (target) {
        case '8': // road
        case '4':
        case '5':
        case '6':
          updateMeter(0, -10);
          break;
        case 'g': // gas
          updateMeter(0, 100);
          break;
        case 's': // sandwich
          updateMeter(1, 40);
          updateMeter(2, 20);
          break;
        case 't': // taco
        case 'p': // pasta
          updateMeter(1, 60);
          break;
        case 'j': // juice
        case 'c': // coffee
          updateMeter(2, 60);
          break;
        case 'w': // ferris wheel
          updateMeter(1, 20);
          updateMeter(2, 20);
          updateMeter(3, 40);
          break;
        case 'f': // flower
          updateMeter(3, 100);
          break;
        case 'm': // masks
          updateMeter(3, 60);
          break;
        case 'n': // nightclub
          updateMeter(2, 40);
          updateMeter(3, 40);
          break;
        case 'b': // ballroom
          updateMeter(1, -10);
          updateMeter(2, -15);
          updateMeter(3, 100);
          break;
        case 'a': // airport 
          updateMeter(3, -10);
          return `${ret}\nReached airplane on move ${i}, with ${meters[0]} gas, ${meters[1]} food, ${meters[2]} drink, and ${meters[3]} entertainment.`;
        case 'h': // house
          return `${ret}\nWIN: returned to house on move ${i}`;
        case 'l': // shopping mall
        case 'r': // ring
          out += " U big sac"
          break;
        default:
          return `${ret}\nERROR in position ${i}: ${target} is not defined. `
          
      }

      ret += `${i + 1} | ${meters} | ${out}\n`;

      for (let n = 0; n < meters.length; n++) {
        if (meters[n] <= 0) return `${ret}\nFAIL: ${['gas', 'food', 'drink', 'entertainment'][n]} meter <= 0 on turn ${i + 1}`;
      }

      if (time <= 0) return `${ret}\nSuccess!`;
    }
    return `${ret}\nFAIL: There is still ${time} time left. Meters are ${meters}`
  }

  return "```" + parseString(path) + "```";
}

// draws the user's path on the image, returns that image.
async function drawPath(msg, img, path) {
  // return img;
  const canvas = createCanvas(800, 600);
  let background;
  await loadImage(img).then(loaded => {
    console.log(`Successfully loaded ${loaded}!`);
    background = loaded;
  });

    

  // context setup
  const context = canvas.getContext("2d");
  context.font = '30px Impact';
	context.fillStyle = '#ffffff';

  // // From a local file path:
  // background = new Image()
  // background.onload = () => context.drawImage(background, 0, 0)
  // background.onerror = err => { throw err }
  // background.src = "C:/Users/chann/Desktop/Coding/Discord Bots/Botpourri/JS Botpourri/musicbpri/data/images/icecreamoldman.png"

  console.log("background on line 220: " + background)

  // stretch map to fit canvas
  context.drawImage(background, 0, 0, canvas.width, canvas.height);

  // put a bunch of numbers on the map
  placeNumber(1, 50, 50);

  // finally return attachment
  const attachment = new MessageAttachment(canvas.toBuffer());
  console.log("attachment: " + attachment.url)
  msg.channel.send("get this!", attachment)
  return attachment.url;

  // places the designated number on the canvas
  function placeNumber(num, x, y) {
    // TODO later draw a circle on background of text
    // TODO be able to take in a coord instead of an xy position
    context.fillText(`${num}`, x, y);
  }
}

function translateEmoji(toTranslate) {
  return moveDictionary[toTranslate][0];
}


// console.log(testPath("p886j6t8f8884g5m")) // 24 | 40,34,76,64 | Ring U big sac

/* How i evaluate whether a path is good: 
 * give each road an affinity: the sum of ???
 * anchor end point at farthest essential attraction, and then stretch the path to it as long as possible. 
 * when needed to minus an attraction to get to somewhere, first subtract the one that boosts me past 100. if nonexistent, well subtract the one that I won't die without. 
*/

/* About roads
 * 0-indexed grid; (0, 0) bottom left; (10, 14) top right
 * 
 * none of the double-even-coordinate spots are accesible (they're intersections)
 * double-odd-coordinate spots are attractions/trees
 * one-odd-one-even-coordinate spots are roads.
 * > if x is odd, we're on a horizontal road. 
 * > if y is odd, we're on a vertical road. 
 * 
 * need function to construct a map. 
 * > roads: check all double-even-coordinate spots to see where the intersections point. 
 * 
 * need function to translate point on actual map to coord. 
*/

/*
 * Past dates: 
 > Hatsune 2021.07.23 15.32 // 25 | 30,44,78,84 | Coffee // 35 AP
 > Hatsune 2021.07.24 05.48 // 25 | 20,30,100,55 | Juice // 31 AP
 > Bot     2021.07.24 06.02 // 25 | 30,96,40,96 | Flower // 39 AP
 > Culumon 2021.07.24 08.04 // 25 | 30,80,20,76 | shopping maLL U big sac // 30AP
 > Ayane   2021.07.24 12.02 // 25 | 20,80,54,56 | Pasta // 32 AP
 > Yamato  2021.07.04 12.28 // 25 | 10,30,60,92 | Wheel // 32 AP
 > Bot     2021.07.24 16.44 // 25 | 20,100,60,44 | Sandwich // 34 AP
 > Culumon 2021.07.24 20.30 // 13 | 60,18,84,51 | Wheel // 13 AP
 > Culumon 2021.06.57 06.57 // 25 | 30,100,80,100 | Wheel // 47 AP
 > Gomamon 2021.08.01 14.55 // 25 | 30,30,70,100 | Masks // 34 AP
*/