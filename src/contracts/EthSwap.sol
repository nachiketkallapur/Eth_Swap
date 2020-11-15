pragma solidity ^0.5.0;

import "./Token.sol";

contract EthSwap{
    string public name="EthSwap instant exchange"; 
    Token public token;
    uint public rate=100;

    event TokenPurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );

    event TokenSold(
        address account,
        address token,
        uint amount,
        uint rate
    );

    constructor(Token _token) public{
        token = _token;
    }

    function buyTokens() payable public {
        uint tokenAmount = msg.value*rate;

        //Minimum token requirement for EthSwap
        require(token.balanceOf(address(this)) >= tokenAmount);

        token.transfer(msg.sender, tokenAmount);

        //Emit an event
        emit TokenPurchased(msg.sender,address(token),tokenAmount,rate);
    }

    function sellTokens(uint _amount) public {
        //User can't send more tokens than he/she has
        require(token.balanceOf(msg.sender) >= _amount);
        uint etherAmount = _amount/rate;

        //check if EthSwap has enough ether
        require(address(this).balance >= etherAmount);
        token.transferFrom(msg.sender,address(this),_amount);
        msg.sender.transfer(etherAmount);

        //emit event
        emit TokenSold(msg.sender,address(token),_amount,rate);

    }
}  