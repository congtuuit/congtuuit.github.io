function moveLeft() {
  player.pos[0] -= 6;
  //police.pos[0] = player.pos[0];
}

function moveRight() {
  player.pos[0] += 6;
  //police.pos[0] = player.pos[0];
}

function jumpingUp() {
  if (player.pos[1] < -4) {
    player.pos[1] = -4;
  }
  jumping = true;
  ducking = false;
  player.speedy = 0.3;
}

function moveDown() {
  if (player.fly_boost == false) {
    if (player.pos[1] != -4) {
      player.pos[1] = -4;
    }
    ducking = true;
    jumping = false;
    player.speedy = 0.2;
  }
}

// Request full-screen and orientation
function requestOrientation() {
  if (window.DeviceOrientationEvent) {
    // If the device is in portrait, prompt the user
    if (window.innerHeight > window.innerWidth) {
      alert(
        "Please rotate your device to landscape mode for the best experience."
      );
    }
  } else {
    console.log("Device Orientation API is not supported.");
  }
}
requestOrientation();

// Function to resize the canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw(); // Call a draw function if needed
}

const swipeArea = document.getElementById("glcanvas");

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Start touch
swipeArea.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].screenX;
  touchStartY = event.changedTouches[0].screenY;
});

// End touch
swipeArea.addEventListener("touchend", (event) => {
  touchEndX = event.changedTouches[0].screenX;
  touchEndY = event.changedTouches[0].screenY;
  handleSwipeGesture();
});

// Handle the swipe gesture
function handleSwipeGesture() {
  const swipeDistanceX = touchEndX - touchStartX;
  const swipeDistanceY = touchEndY - touchStartY;

  if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY)) {
    // Swipe left or right
    if (swipeDistanceX > 50) {
      moveRight();
      // action for swipe right
    } else if (swipeDistanceX < -50) {
      moveLeft(0);
      // action for swipe left
    }
  } else {
    // Swipe up or down
    if (swipeDistanceY > 50) {
      //alert("Swiped down!");
      console.log("down");
      // action for swipe down
    } else if (swipeDistanceY < -50) {
      jumpingUp();
      // action for swipe up
    }
  }
}
document.addEventListener(
  "keydown",
  (event) => {
    key = event.keyCode;
    console.log("key ", key);
    if (key == 39) {
      moveRight();
    }
    if (key == 37) {
      moveLeft();
    }
    if (key == 38) {
      jumpingUp();
    }
    if (key == 40) {
      moveDown();
    }

    if (key == 49) {
      theme = 1;
      theme_flag = 1;
    }
    if (key == 50) {
      theme = 2;
      theme_flag = 1;
    }

    if (key == 70) {
      if (flashing == false) {
        flashing = true;
        greyScale = false;
        d = new Date();
        flash_start_time = d.getTime() * 0.001;
      } else flashing = false;
    }
    if (key == 71) {
      if (greyScale == false) {
        greyScale = true;
        flashing = false;
      } else greyScale = false;
    }
  },
  false
);
