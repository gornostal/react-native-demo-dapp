pragma solidity ^0.4.19;

contract Splitter {

  address public owner;

  event LogPay(address addr, uint amount);

  function Splitter() public {
    owner = msg.sender;
  }

  function pay(address addr1, address addr2) public payable {
    require(msg.sender != addr1 && addr1 != addr2 && msg.sender != addr2);
    require(msg.value > 2);
    uint amountToTransfer = msg.value / 2;
    addr1.transfer(amountToTransfer);
    LogPay(addr1, amountToTransfer);
    addr2.transfer(amountToTransfer);
    LogPay(addr2, amountToTransfer);
  }

}
