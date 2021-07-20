"use strict";

/* =====================================================================================================================
Requires
===================================================================================================================== */
const { createCanvas, loadImage } = require('canvas');
const Discord = require('discord.js');
const { MessageAttachment } = require('discord.js');
const getFieldIfFound = require('../general_cmd/tools/field').getFieldIfFound;
const removeFlagIfFound = require('../general_cmd/tools/flag').removeFlagIfFound;

module.exports = { 
  name: 'testpath',
  alias: 'tp',
  description: 'wasd to move. (j)uice (f)air',
  args: 2,
  usage: "testpath <gameboard image link> <movement string>",
  // directly callable by user. 
  // test the karuta date path given, and send an embed based on whether it works / fails + the path taken. 
  execute: async function(msg, args = []) {
    const hasRingFlag = removeFlagIfFound(args, 'r');
    let path = getFieldIfFound(args, 'p');

    // TODO: if hasRingFlag and valid path does not contain ring, go to ring
    let img = args[0];

    // TODO: if hasPathField, skip finding best path. 
    if (!path) {
      path = findBestPath(hasRingFlag);
    }

    const m = await embedPathInfo(msg, img, path).then(toSend => {
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
  await drawPath(img, path).then(value => mapImage = value);

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
    for (var i = 0; i < str.length; i++) {
      let out = "";

      // first reduce all meters and time
      updateMeter(1, -4);
      updateMeter(2, -6);
      updateMeter(3, -8);
      time = time - 4;

      // then add/subtract meters as necessary 
      const target = str.charAt(i);
      switch (target) {
        case '8': // road
        case '4':
        case '5':
        case '6':
          out += "Move";
          updateMeter(0, -10);
          break;
        case 'g': // gas
          out += "Gas";
          updateMeter(0, 100);
          break;
        case 's': // sandwich
          out += "Sandwich";
          updateMeter(1, 40);
          updateMeter(2, 20);
          break;
        case 't': // taco
        case 'p': // pasta
          out += "60 Food";
          updateMeter(1, 60);
          break;
        case 'j': // juice
        case 'c': // coffee
          out += "60 Drink";
          updateMeter(2, 60);
          break;
        case 'w': // ferris wheel
          out += "ferris Wheel";
          updateMeter(1, 20);
          updateMeter(2, 20);
          updateMeter(3, 40);
          break;
        case 'f': // flower
          out += "Flower";
          updateMeter(3, 100);
          break;
        case 'm': // masks
          out += "Masks";
          updateMeter(3, 60);
          break;
        case 'n': // nightclub
          out += "Nightclub";
          updateMeter(2, 40);
          updateMeter(3, 40);
          break;
        case 'b': // ballroom
          out += "Ballroom";
          updateMeter(1, -10);
          updateMeter(2, -15);
          updateMeter(3, 100);
          break;
        case 'a': // airport 
          updateMeter(3, -10);
          return `Reached airplane on move ${i}, with ${meters[0]} gas, ${meters[1]} food, ${meters[2]} drink, and ${meters[3]} entertainment.`;
        case 'h': // house
          return `WIN: returned to house on move ${i}`;
        case 'l': // shopping mall
        case 'r': // ring
          out += "U big sac"
          break;
        default:
          return `ERROR in position ${i}: ${target} is not defined. `
          
      }

      console.log(`${i} | ${meters} | ${out}`);

      for (let n = 0; n < meters.length; n++) {
        if (meters[n] <= 0) return `FAIL: ${['gas', 'food', 'drink', 'entertainment'][n]} meter <= 0 on turn ${i + 1}`;
      }

      if (time <= 0) return "Success!";
    }
    return `FAIL: There is still ${time} time left. Meters are ${meters}`
  }

  console.log(parseString(path))
}

// draws the user's path on the image, returns that image.
async function drawPath(img, path) {
  return img;
  const canvas = createCanvas(600, 800);
  const map = await loadImage(img);

  // context setup
  const context = canvas.getContext("2d");
  context.font = '30px Impact';

  // put a bunch of numbers on the map
  placeNumber(1, 50, 50);

  // stretch map to fit canvas
  context.drawImage(map, 0, 0, canvas.width, canvas.height);

  // finally return attachment
  const attachment = new MessageAttachment(canvas.toBuffer(), "karuta-date-map.png");
  return attachment;

  // places the designated number on the canvas
  function placeNumber(num, x, y) {
    // TODO later draw a circle on background of text
    // TODO be able to take in a coord instead of an xy position
    context.fillText(`${num}`, x, y);
  }
}

function translateEmoji(toTranslate) {
  var emojiDictionary = {
    // 8456gstpjcwfmnbahlr
    '8': "🔼",
    '4': "◀️",
    '5': "🔽",
    '6': "▶️",
    'g': "⛽",
    's': "🥪",
    't': "🌮",
    'p': "🍝",
    'j': "🧃",
    'c': "☕",
    'w': "🎡",
    'f': "🌻",
    'm': "🤿",
    'n': "🍹",
    'd': "💃",
    'a': "✈️",
    'h': "🏠",
    'l': "🛍️",
    'r': "💍"
  }
  return emojiDictionary[toTranslate];
}