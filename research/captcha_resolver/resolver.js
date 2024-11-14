const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const Jimp = require('jimp');

async function loadModel() {
  const model = await tf.loadGraphModel('tfjs_model/model.json');
  return model;
}

async function preprocessImage(imagePath) {
  const image = await Jimp.read(imagePath);
  image.resize(100, 50).grayscale();
  const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
  const tensor = tf.node.decodeImage(buffer, 1);
  return tensor.expandDims(0).div(255.0);
}

async function solveCaptcha(imagePath) {
  const model = await loadModel();
  const inputTensor = await preprocessImage(imagePath);
  const predictions = model.predict(inputTensor);
  const output = predictions.argMax(-1).dataSync();
  console.log('Captcha solved:', String.fromCharCode(...output));
}

// Đường dẫn đến file captcha cần giải
solveCaptcha('path/to/captcha.jpg');
