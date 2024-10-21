const gifts = Array.from({ length: 14 }, (_, i) => ({
  name: `${i}`,
  picture: `assets/images/gift-box/${i}.png`,
}));

let availableGifts = [...gifts]; // Copy of the gifts array to track remaining gifts

function getRandomGift() {
  // If all gifts have been selected, reshuffle the availableGifts
  if (availableGifts.length === 0) {
    availableGifts = [...gifts];
  }

  // Randomly pick an index from the availableGifts
  const randomIndex = Math.floor(Math.random() * availableGifts.length);

  // Get the selected gift
  const selectedGift = availableGifts[randomIndex];

  // Remove the selected gift from the availableGifts
  availableGifts.splice(randomIndex, 1);

  // Return the selected gift
  return selectedGift;
}

function getGift(index) {
  if (index == 14) index = 0;
  return {
    name: index,
    picture: `assets/images/gift-box/${index}.png`,
  };
}
