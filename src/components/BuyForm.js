import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

function BuyForm({ ethBalance, tokenBalance, buyTokens }) {
  const [state, setState] = useState({
    input: "0",
    output: "0",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState({
      [name]: value,
      output: value * 100,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let etherAmount = window.web3.utils.toWei(state.input, "Ether");
    buyTokens(etherAmount);
  };

  const classes = useStyles();
  
  return (
    <div style={{ alignItems: "center", justifyContent: "center" }}>
        <h1>Buy Tokens</h1>
      <form className={classes.root} onSubmit={handleSubmit}>
        <TextField
          onChange={handleChange}
          value={state.input}
          name="input"
          style={{ border: "1px solid", borderRadius: "5px" }}
          id="outlined-basic"
          label="Input"
        />
        <span>Balance: {window.web3.utils.fromWei(ethBalance, "Ether")}</span>
        <br />
        <TextField
          onChange={handleChange}
          value={state.output}
          name="output"
          style={{ border: "1px solid", borderRadius: "5px" }}
          disabled
          id="standard-disabled"
          label="Output"
        />
        <span>Balance: {window.web3.utils.fromWei(tokenBalance, "Ether")}</span>
        <br />
        <p>Exchange rate 1ETH=100DApp</p>
        <Button type="submit" variant="contained" color="primary">
          Buy DApp tokens
        </Button>
      </form>
    </div>
  );
}

export default BuyForm;
