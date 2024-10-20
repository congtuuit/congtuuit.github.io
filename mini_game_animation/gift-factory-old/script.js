// List of gifts
const gifts = [
  "Teddy Bear",
  "Toy Car",
  "Chocolate Box",
  "Gift Card",
  "Puzzle Game",
];

// Elements
const startButton = document.getElementById("startButton");
const giftBox = document.getElementById("giftBox");
const giftMessage = document.getElementById("giftMessage");

// Start the factory process
startButton.addEventListener("click", () => {
  factoryRunning();

  // remove gift
  giftMessage.classList.add("hidden");
  giftBox.classList.add("hidden");

  startButton.disabled = true;
  startButton.textContent = "Factory Running...";

  // Simulate factory running (2 seconds delay)
  setTimeout(() => {
    giftBox.classList.remove("hidden");
    startButton.textContent = "Start Factory";
    startButton.disabled = false;

    factoryStop();
  }, 5000); // Delay simulating factory operation
});

// Open the gift
giftBox.addEventListener("click", () => {
  const randomGift = gifts[Math.floor(Math.random() * gifts.length)];
  giftMessage.textContent = `You received: ${randomGift}`;
  giftBox.classList.add("hidden");
  giftMessage.classList.remove("hidden");
});

const smokeStacks = document.getElementsByClassName("smoke-stack");
function createSmoke() {
  var smokes = [];
  for (var i = 0; i < smokeStacks.length; i++) {
    const smokeStack = smokeStacks[i];

    // Randomize delay for each smoke stack
    const delay = Math.random() * 800; // Random delay between 0 and 1000 milliseconds

    setTimeout(() => {
      const smoke = document.createElement("div");
      smoke.className = "smoke";
      smokeStack.appendChild(smoke);
      smokes.push(smoke);

      // Remove the smoke after animation completes
      setTimeout(() => {
        smoke.remove();
      }, 3000);
    }, delay);
  }
}

function factoryRunning() {
  window.smokeInterval = setInterval(createSmoke, 800);

  setTimeout(() => {
    runScroll();
  }, 500);
}

function factoryStop() {
  if (window.smokeInterval) {
    clearInterval(window.smokeInterval);
  }

  stopScrool();
}

//
const animationFrames = {}; // Object to store animation frame IDs

function animateDiv(element, startX, startY, endX, endY) {
  let duration = 2000;
  let startTime = performance.now();
  let animationFrameId; // Variable to hold the frame ID for the current animation

  function move(timestamp) {
    let elapsed = timestamp - startTime;

    // Calculate progress (0 to 1)
    let progress = Math.min(elapsed / duration, 1);

    // Calculate new position
    let newX = startX + (endX - startX) * progress;
    let newY = startY + (endY - startY) * progress;

    // Update the div position
    element.style.left = `${newX}px`;
    element.style.top = `${newY}px`;

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(move);
    } else {
      // Store the frame ID so we can cancel it if needed
      animationFrames[element.id] = null; // Clear the ID
      // Restart the animation when it finishes
      animateDiv(element, startX, startY, endX, endY);
    }
  }

  // Store the frame ID
  animationFrames[element.id] = requestAnimationFrame(move);
}

function runScroll() {
  const totalDivs = 6; // Total number of moving divs
  const startX = 386; // Starting X position
  const startY = 489; // Starting Y position
  const endX = 250; // Ending X position
  const endY = 540; // Ending Y position
  const delayIncrement = 350; // Delay increment for each subsequent div
  const container = document.querySelector(".factory-container"); // Select the parent container

  for (let i = 1; i <= totalDivs; i++) {
    const movingDiv = document.createElement("div"); // Create a new div element
    movingDiv.id = `movingDiv_${i}`; // Set the id attribute
    movingDiv.className = "moving-div"; // Set the class attribute
    container.appendChild(movingDiv); // Append the new div to the container
    const delay = (i - 1) * delayIncrement; // Calculate delay for each div
    setTimeout(() => {
      animateDiv(movingDiv, startX, startY, endX, endY);
    }, delay);
  }
}

// Function to stop animations for all movingDivs
function stopAllAnimations() {
  const movingDivs = document.getElementsByClassName("moving-div");
  for (let i = 0; i < movingDivs.length; i++) {
    const div = movingDivs[i];
    if (div) {
      div.remove();
    }
    const frameId = animationFrames[div.id];
    if (frameId) {
      cancelAnimationFrame(frameId); // Cancel the ongoing animation
      animationFrames[div.id] = null; // Clear the ID
    }
  }
}

function stopScrool() {
  stopAllAnimations(); // Stops all animations for elements with class "moving-div"
  stopAllAnimations(); // Stops all animations for elements with class "moving-div"
  stopAllAnimations(); // Stops all animations for elements with class "moving-div"
  stopAllAnimations(); // Stops all animations for elements with class "moving-div"
}
