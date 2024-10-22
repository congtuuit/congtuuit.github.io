const gifts = [
  {
    name: "bebe.png",
  },
  {
    name: "binh-nuoc.png",
  },
  {
    name: "but-chi-chuot.png",
  },
  {
    name: "but-chi-gom.png",
  },
  {
    name: "but-mau.png",
  },
  {
    name: "but-may.png",
  },
  {
    name: "hop-but.png",
  },
  {
    name: "so-tay.png",
  },
  {
    name: "thuoc.png",
  },
];

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
  return {
    name: selectedGift.name,
    picture: `assets/images/gifts/${selectedGift.name}`,
  };
}

function getGift(index) {
  if (index == 14) index = 0;
  return {
    name: index,
    picture: `assets/images/gift-box/${index}.png`,
  };
}
