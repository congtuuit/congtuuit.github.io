class GiftBox {
  constructor(boxId) {
    this.id = boxId;
    this.element = `.box-${boxId}`;
    this.activeColor = "var(--button-bg-active)";
    this.inActiveColor = "var(--gift-box)";
    this.sound = new Audio("step-effect.mp3");
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
    $(this.element).css(
      "background-color",
      isActive ? this.activeColor : this.inActiveColor
    );
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
    this.confettiSound = new Audio("confetti-petard-gun-sound-effect.m4a");
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

  _playSound() {
    // Attempt to play sound with error handling
    this.confettiSound.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  }

  run(startPosition = 0, intervalTime = this.intervalTime) {
    if (startPosition >= this.totalBox) startPosition = 0;

    this._updateBoxState(startPosition);

    // run lower and stop
    if (this.isStopping) {
      intervalTime += 30;

      if (
        intervalTime >= 800 &&
        !this.previousResults.has(this.currentPosition)
      ) {
        this.isRunning = false;
        this.isStopping = false;
        this.previousResults.add(this.currentPosition);
        if (this.resultCallback) {
          this.resultCallback({ index: this.currentPosition });
        }
        return;
      }

      if (this.previousResults.has(this.currentPosition)) {
        intervalTime = intervalTime - 30;
      }
    } else if (intervalTime > 40) {
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

$(document).ready(() => {
  const game = new GiftRandomGame();
  const startStopButton = $("#startStopButton");

  const modal = $("#resultModal");
  const closeModal = $(".close");

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
        startStopButton.html("Start");
        startStopButton.attr("disabled", false);
        startStopButton.css("background-color", "var(--button-bg-color)");

        // Show the result in the popup
        modal.css("display", "flex").hide(); // Set display to flex and hide initially
        modal.fadeIn(300); // Fade in animation
        openGiftBox();
        game._playSound();
      });
    } else {
      startStopButton.css("background-color", "var(--button-bg-active)");
      startStopButton.html("Stop");
      game.start();
    }
  });

  function openGiftBox() {
    $(".box-body").addClass("hover");

    // start confetti animation
    startAnimation();
  }

  function destroyGiftBox() {
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
