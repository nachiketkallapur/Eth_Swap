const { assert } = require("chai");

const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

require("chai")
  .use(require("chai-as-promised"))
  .should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("EthSwap", ([deployer, investor]) => {
  let ethSwap, token;
  before(async () => {
    token = await Token.new();
    ethSwap = await EthSwap.new(token.address);
    //Tranfer all tokens to EthSwap
    await token.transfer(ethSwap.address, tokens("1000000"));
  });

  describe("EthSwap deployment", async () => {
    it("Contract has a name", async () => {
      const name = await ethSwap.name();

      assert.equal(name, "EthSwap instant exchange");
    });

    it("Contract has tokens", async () => {
      let balance = await token.balanceOf(ethSwap.address);
      assert.equal(balance.toString(), tokens("1000000"));
    });
  });

  describe("Token deployment", async () => {
    it("Contract has a name", async () => {
      const token = await Token.new();
      const name = await token.name();

      assert.equal(name, "DApp Token");
    });
  });

  describe("buyTokens()", async () => {
    let result;
    before(async () => {
      result = await ethSwap.buyTokens({ from: investor, value: tokens("1") });
    });

    it("allows user to instantly purchase tokens for a fixed price", async () => {
      //Check investor balance
      let investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens('100'));

      //Check EthSwap balance after purchase
      let ethSwapBalance = await token.balanceOf(ethSwap.address);
      assert.equal(ethSwapBalance.toString(),tokens('999900'));

      let etherBalance = await web3.eth.getBalance(ethSwap.address)
      assert.equal(etherBalance.toString(),web3.utils.toWei('1','ether'));

      const event = result.logs[0].args;

      assert.equal(event.account,investor);
      assert.equal(event.token,token.address);
      assert.equal(event.amount.toString(),tokens('100').toString());
      assert.equal(event.rate.toString(),'100');

    });
  });

  describe("sellTokens()", async () => {
    let result;
    before(async () => {
      //investor must approve the purchase
      await token.approve(ethSwap.address, tokens('100'),{ from:investor})
      //investor sells tokens
      result = await ethSwap.sellTokens(tokens('100'),{from:investor});
    });

    it("allows user to instantly sell tokens to EthSwap for a fixed price", async () => {
      let investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(),tokens('0'));

      //check EthSwap balance after purchase

      let ethSwapBalance = await token.balanceOf(ethSwap.address);
      assert.equal(ethSwapBalance.toString(),tokens('1000000'));
      ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), web3.utils.toWei('0','ether'))

      //check logs to ensure event was emitted with correct data
      const event = result.logs[0].args;

      assert.equal(event.account,investor);
      assert.equal(event.token,token.address);
      assert.equal(event.amount.toString(),tokens('100').toString());
      assert.equal(event.rate.toString(),'100');

      //FAILURE: investor can't sell more tokens than he has
      await ethSwap.sellTokens(tokens('500'),{from:investor}).should.be.rejected;
    });
  });
});
