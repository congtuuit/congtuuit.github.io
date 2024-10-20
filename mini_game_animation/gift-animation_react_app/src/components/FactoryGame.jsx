import React, { useEffect, useState } from "react";
import factory_mini from "../images/factory_mini.png";
import "./FactoryGame.style.css";
import GiftBoxAnimation from "./GiftBox/GiftBoxAnimation";

const gifts = ["Teddy Bear", "Toy Car", "Chocolate Box", "Gift Card", "Puzzle Game"];

function FactoryGame() {
  const [isRunning, setIsRunning] = useState(false);
  const [isDisplayGiftBox, setIsDisplayGiftBox] = useState(false);
  const [gift, setGift] = useState("");
  const [buttonTitle, setButtonTitle] = useState("Start");
  const animationFrames = {};

  const handleStartButton = () => {
    if (isRunning) return;
    setIsRunning(true);
    factoryRunning();
  };

  const handleGiftBox = () => {
    setIsDisplayGiftBox(true);
    const randomGift = gifts[Math.floor(Math.random() * gifts.length)];

    console.log("randomGift ", randomGift);
    setGift(`You received: ${randomGift}`);
  };

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
    setIsRunning(false);
    setIsDisplayGiftBox(true);
  }

  function createSmoke() {
    const smokeStacks = document.getElementsByClassName("smoke-stack");
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

  function animateDiv(element, startX, startY, endX, endY) {
    let duration = 2000;
    let startTime = performance.now();

    function move(timestamp) {
      let elapsed = timestamp - startTime;
      let progress = Math.min(elapsed / duration, 1);
      let newX = startX + (endX - startX) * progress;
      let newY = startY + (endY - startY) * progress;
      element.style.left = `${newX}px`;
      element.style.top = `${newY}px`;
      if (progress < 1) {
        requestAnimationFrame(move);
      } else {
        animationFrames[element.id] = null;
        animateDiv(element, startX, startY, endX, endY);
      }
    }

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

  function stopAllAnimations() {
    const movingDivs = document.getElementsByClassName("moving-div");
    for (let i = 0; i < movingDivs.length; i++) {
      const div = movingDivs[i];
      if (div) {
        div.remove();
      }
      const frameId = animationFrames[div.id];
      if (frameId) {
        cancelAnimationFrame(frameId);
        animationFrames[div.id] = null;
      }
    }
  }

  function stopScrool() {
    stopAllAnimations();
    stopAllAnimations();
    stopAllAnimations();
    stopAllAnimations();
  }

  useEffect(() => {}, []);

  useEffect(() => {
    if (isRunning) {
      setIsDisplayGiftBox(false);
      setButtonTitle("Factory Running...");
      setTimeout(() => {
        factoryStop();
      }, 5000);
    } else {
      setButtonTitle("Start");
    }
  }, [isRunning, factoryStop]);

  return (
    <div className="factory-container">
      <div className={`smoke-stack stack-1`}></div>
      <div className={`smoke-stack stack-2`}></div>
      <div className={`smoke-stack stack-3`}></div>

      <img src={factory_mini} alt="Factory Background" className="background-image" />

      <button id="startButton" className="start-button" onClick={handleStartButton} disabled={isRunning}>
        {buttonTitle}
      </button>

      <GiftBoxAnimation className={`${isDisplayGiftBox ? "" : "hidden"} gift-box`} />
      <div id="giftMessage" className={`${isDisplayGiftBox ? "" : "hidden"} gift-message`}>
        {gift}
      </div>
    </div>
  );
}

export default FactoryGame;
