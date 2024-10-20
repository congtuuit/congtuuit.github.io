import React, { Fragment, useReducer, useState } from "react";
import box from "../../images/box.png";
import boxLid from "../../images/box-lid.png";
import kuku from "../../images/jump-character.png";
import Confetti from "../../confetti/Confetti";
import "./gift-box.style.css";

const init_state = {
  move: "move",
  jump: "",
  rotated: "",
  rotating: "",
};
function GiftBoxAnimation(props) {
  const { className } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useReducer(
    (state, new_state) => ({
      ...state,
      ...new_state,
    }),
    init_state
  );

  const { move, rotating, rotated, jump } = state;

  function handleOpenBox() {
    let isDone = rotated === "rotated" ? true : false;

    if (!isDone) {
      setIsOpen(true);

      setState({ rotating: "rotating" });
      setTimeout(() => {
        setState({ jump: "jump" });
      }, 300);
      setTimeout(() => {
        setState({ rotated: "rotated" });
      }, 1000);
    } else {
      setState(init_state);
      setIsOpen(false);
    }
    let moving = move === "move" ? "" : "move";
    setState({ move: moving });
  }

  return (
    <Fragment>
      {isOpen && <div className="overlay"></div>}

      <div className={className}>
        <Confetti open={jump === "jump"} />
        <div className="img-container">
          <img className={`kuku ${isOpen && "jump_up"}`} src={kuku} alt="kuku" />
          <button className="box" onClick={handleOpenBox}>
            <img src={box} alt="box" />
          </button>
          <img className={`lid ${move} ${rotating} ${rotated}`} src={boxLid} alt="box-lid" />
        </div>
      </div>
    </Fragment>
  );
}

export default GiftBoxAnimation;
