class GiftBox {
  constructor(boxId) {
    this.id = boxId;
    this.element = `.box-${boxId}`;
    this.activeColor = "var(--button-bg-active)";
    this.inActiveColor = "var(--gift-box)";
    this.sound = new Audio("assets/sounds/step-effect.mp3");

    this.setup(this.element, boxId);
  }

  setup(element, boxId) {
    const imgPath = `assets/images/gift-box/${boxId}.png`;
    $('<style>' + element + ' .box::before { background: url("' + imgPath + '") no-repeat center center  }</style>').appendTo('head');
  }

  setActive(isActive) {
    // Play sound only when activating
    if (isActive) {
      this.playSound();
    }

    // Update the background color based on the active state
    this.updateBackgroundColor(isActive);
  }

  playSound() {
    // Attempt to play sound with error handling
    this.sound.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  }

  updateBackgroundColor(isActive) {
    if (isActive) {
      $(this.element).addClass("active");
    } else {
      $(this.element).removeClass("active");
    }
  }
}

class GiftRandomGame {
  constructor(totalBox = 14, intervalTime = 199) {
    this.isRunning = false;
    this.isStopping = false;
    this.totalBox = totalBox;
    this.previousBox = null;
    this.currentPosition = 0;
    this.intervalTime = intervalTime;
    this.elements = this._createElements();
    this.resultCallback = null;
    this.previousResults = new Set();

    this.bgSound = document.getElementById("bgSound");

    this.confettiSound = new Audio("assets/sounds/gift-open.mp3");

    // play background sound
    this._playStartSound();
  }

  _createElements() {
    return Array.from({ length: this.totalBox }, (_, i) => new GiftBox(i));
  }

  _updateBoxState(position) {
    const currentBox = this.elements[position];
    currentBox.setActive(true);

    if (this.previousBox) {
      this.previousBox.setActive(false);
    }

    this.previousBox = currentBox;
  }

  _playOpenGiftSound() {
    // Attempt to play sound with error handling
    this.confettiSound.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  }

  _playStartSound() {
    this.bgSound.pause();
    this.bgSound.currentTime = 0;
    this.bgSound.play();
  }

  _stopStartSound() {
    this.bgSound.pause(); // Pauses the audio
    this.bgSound.currentTime = 0; // Resets the playback to the start
  }

  run(startPosition = 0, intervalTime = this.intervalTime) {
    if (startPosition >= this.totalBox) startPosition = 0;

    this._updateBoxState(startPosition);

    // run lower and stop
    if (this.isStopping) {
      intervalTime += 35;

      if (
        intervalTime >= 520 &&
        !this.previousResults.has(this.currentPosition)
      ) {
        this.isRunning = false;
        this.isStopping = false;
        this.previousResults.add(this.currentPosition);
        if (this.resultCallback) {
          this._stopStartSound();
          this.resultCallback({ index: this.currentPosition });
          this._playOpenGiftSound();
        }
        return;
      }

      if (this.previousResults.has(this.currentPosition)) {
        intervalTime = intervalTime - 30;
      }
    } else if (intervalTime > 20) {
      intervalTime -= 10;
    }

    setTimeout(() => {
      this.currentPosition = startPosition + 1;
      this.run(this.currentPosition, intervalTime);
    }, intervalTime);
  }

  start() {
    this.isStopping = false;
    this.run(this.currentPosition);
    this.isRunning = true;
    if (this.bgSound.paused) {
      this._playStartSound();
    }
  }

  stop(callback) {
    this.isStopping = true;
    this.resultCallback = callback;
    if (this.previousResults.size > 4) {
      const firstElement = this.previousResults.values().next().value;
      this.previousResults.delete(firstElement);
    }
  }

  resetHistory() {
    this.previousResults.clear();
  }
}

function displayProcessbar() {
  const progressBar = document.getElementById("progress");
  const loadingContainer = document.getElementById("loading-container");
  const startStopButton = document.getElementById("startStopButton");
  const giftBoxes = document.getElementById("giftBoxes");

  // Simulate a loading process with a timeout
  let progress = 0;
  let loadingInterval = setInterval(() => {
    progress += 0.5;
    //progress += 50;
    progressBar.style.width = progress + "%";

    // When progress reaches 100%, show the game container
    if (progress >= 110) {
      clearInterval(loadingInterval);
      loadingContainer.style.display = "none"; // Hide the loading screen
      startStopButton.style.opacity = "1"; // Show the game container
      giftBoxes.style.opacity = "1"; // Show the game container
    }
  }, 10); // Adjust the interval speed to control loading duration
}

$(document).ready(() => {
  const game = new GiftRandomGame();
  const startStopButton = $("#startStopButton");
  const modal = $("#resultModal");
  const closeModal = $(".close");

  displayProcessbar();

  startStopButton.click(() => {
    if (game.isRunning) {
      // set the gift
      const selectedGift = getRandomGift();
      $("#giftResult")
        .attr("src", selectedGift.picture)
        .attr("alt", selectedGift.name);

      startStopButton.attr("disabled", true);
      game.stop(({ index }) => {
        console.log("Game stopped at position:", index);
        //startStopButton.html("Start");

        // Set start button
        startStopButton.attr("disabled", false);
        startStopButton.css("background-color", "var(--button-bg-color)");
        startStopButton.css(
          "background-image",
          "url('assets/images/start.png')"
        );

        // Show the result in the popup
        modal.css("display", "flex").hide(); // Set display to flex and hide initially
        modal.fadeIn(300); // Fade in animation
        openGiftBox();
      });
    } else {
      // Set stop button
      startStopButton.css("background-color", "var(--button-bg-active)");
      startStopButton.css("background-image", "url('assets/images/stop.png')");

      //startStopButton.html("Stop");
      game.start();
    }
  });

  function openGiftBox() {
    $(".box-body").addClass("hover");

    // start confetti animation
    startAnimation();
  }

  function destroyGiftBox() {
    game._playStartSound();
    $(".box-body").removeClass("hover");
  }

  // Close the modal
  closeModal.click(() => {
    destroyGiftBox();
    modal.fadeOut(100, () => modal.hide()); // Fade out animation
  });

  // Close the modal when clicking outside the modal-content
  $(window).click((event) => {
    if ($(event.target).is(modal)) {
      destroyGiftBox();
      modal.fadeOut(100, () => modal.hide()); // Fade out animation
    }
  });

  $("#drawing_canvas").click((event) => {
    destroyGiftBox();
    modal.fadeOut(100, () => modal.hide()); // Fade out animation
  });
});
