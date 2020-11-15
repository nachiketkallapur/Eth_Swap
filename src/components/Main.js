import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import BuyForm from "./BuyForm";
import SellForm from "./SellForm";

function Main({ ethBalance, tokenBalance, buyTokens, sellTokens }) {
  const [state, setState] = useState({
    currentForm: "buy",
  });
  let content;
  if (state.currentForm === "buy") {
    content = <BuyForm
      ethBalance={ethBalance}
      tokenBalance={tokenBalance}
      buyTokens={buyTokens}
    />;
  } else {
    content = <SellForm
      ethBalance={ethBalance}
      tokenBalance={tokenBalance}
      sellTokens={sellTokens}
    />;
  }
  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-light"
          onClick={(event) => {
            setState({ currentForm: "buy" })
          }}
        >
          Buy
        </button>
        <span className="text-muted">&lt; &nbsp; &gt;</span>
        <button
          className="btn btn-light"
          onClick={(event) => {
            setState({ currentForm: "sell" })
          }}
        >
          Sell
        </button>
      </div>
      {content}
    </div>
  );
}

export default Main;
