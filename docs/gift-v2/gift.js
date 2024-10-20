const gifts = [
  {
    name: "Gift Box",
    picture: "https://via.placeholder.com/150x150.png?text=Gift+Box",
  },
  {
    name: "Toy",
    picture: "https://via.placeholder.com/150x150.png?text=Toy",
  },
  {
    name: "Watch",
    picture: "https://via.placeholder.com/150x150.png?text=Watch",
  },
  {
    name: "Book",
    picture: "https://via.placeholder.com/150x150.png?text=Book",
  },
  {
    name: "Camera",
    picture: "https://via.placeholder.com/150x150.png?text=Camera",
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
  return selectedGift;
}
