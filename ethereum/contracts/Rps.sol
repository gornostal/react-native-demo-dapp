pragma solidity ^0.4.19;

contract Rps {

  enum GameStatus {
    notStarted,
    choosing,
    revealing,
    player1Won,
    player2Won,
    tie
  }

  enum Shape {
    rock,
    paper,
    scissors,
    invalidHash
  }

  struct Game {
    uint bet;
    address player1;
    address player2;
    Shape player1Shape;
    bytes32 player1Hash;
    bytes32 player1Secret;
    Shape player2Shape;
    bytes32 player2Hash;
    bytes32 player2Secret;
    bool player1Rewarded;
    bool player2Rewarded;
  }

  address public owner;
  mapping (bytes32 => Game) games;

  event LogPay(address addr, uint amount);

  function Rps() public {
    owner = msg.sender;
  }

  function startGame(bytes32 gameName, bytes32 hash) public payable {
    // check if game with this name doesn't exist
    require(games[gameName].bet == 0);
    require(msg.value > 0);

    games[gameName].bet = msg.value;
    games[gameName].player1 = msg.sender;
    games[gameName].player1Hash = hash;
  }

  function joinGame(bytes32 gameName, bytes32 hash) public payable {
    // check if game exists
    require(games[gameName].player1 != 0);
    // check if game is not played yet
    require(games[gameName].player2 == 0);
    require(games[gameName].player1 != msg.sender);
    require(games[gameName].bet == msg.value);

    games[gameName].player2 = msg.sender;
    games[gameName].player2Hash = hash;
  }

  function getBetValue(bytes32 gameName) public view returns(uint) {
    return games[gameName].bet;
  }

  function getGameStatus(bytes32 gameName) public view returns(GameStatus) {
    Game memory game = games[gameName];

    if (game.player1 == 0 && game.player2 == 0) {
      return GameStatus.notStarted;
    }
    if (game.player1Hash == 0 || game.player2Hash == 0) {
      return GameStatus.choosing;
    }
    if (game.player1Secret == 0 || game.player2Secret == 0) {
      return GameStatus.revealing;
    }

    Shape player1Shape = game.player1Shape;
    if (keccak256(game.player1Shape, game.player1Secret) != game.player1Hash) {
        player1Shape = Shape.invalidHash;
    }

    Shape player2Shape = game.player2Shape;
    if (keccak256(game.player2Shape, game.player2Secret) != game.player2Hash) {
        player2Shape = Shape.invalidHash;
    }

    if (player1Shape == player2Shape) {
        return GameStatus.tie;
    }
    if (player1Shape == Shape.invalidHash) {
        return GameStatus.player2Won;
    }
    if (player2Shape == Shape.invalidHash) {
        return GameStatus.player1Won;
    }

    if (player1Shape == Shape.rock) {
        return player2Shape == Shape.scissors ? GameStatus.player1Won : GameStatus.player2Won;
    }
    if (player1Shape == Shape.paper) {
        return player2Shape == Shape.rock ? GameStatus.player1Won : GameStatus.player2Won;
    }
    if (player1Shape == Shape.scissors) {
        return player2Shape == Shape.paper ? GameStatus.player1Won : GameStatus.player2Won;
    }
    revert();
  }

  function getWinnerAddress(bytes32 gameName) public view returns(address) {
    GameStatus status = getGameStatus(gameName);
    if (status == GameStatus.tie) {
      return address(0);
    }

    return status == GameStatus.player1Won ? games[gameName].player1 : games[gameName].player2;
  }

  function revealSecret(bytes32 gameName, Shape shape, bytes32 secret) public {
    require(getGameStatus(gameName) == GameStatus.revealing);

    if (games[gameName].player1 == msg.sender) {
      games[gameName].player1Secret = secret;
      games[gameName].player1Shape = shape;
    } else if (games[gameName].player2 == msg.sender) {
      games[gameName].player2Secret = secret;
      games[gameName].player2Shape = shape;
    } else {
      revert();
    }
  }

  function getReward(bytes32 gameName) public {
    address player1 = games[gameName].player1;
    address player2 = games[gameName].player2;
    uint bet = games[gameName].bet;

    require(msg.sender == player1 || msg.sender == player2);

    GameStatus status = getGameStatus(gameName);
    require(status == GameStatus.player1Won ||
            status == GameStatus.player2Won ||
            status == GameStatus.tie);

    uint amount;
    if (msg.sender == player1) {
        if (games[gameName].player1Rewarded) {
          revert();
        } else {
          amount = status == GameStatus.player1Won ? bet * 2 : bet;
          msg.sender.transfer(amount);
          LogPay(msg.sender, amount);
          games[gameName].player1Rewarded = true;
          return;
        }
    }

    if (msg.sender == player2) {
        if (games[gameName].player2Rewarded) {
          revert();
        } else {
          amount = status == GameStatus.player2Won ? bet * 2 : bet;
          msg.sender.transfer(amount);
          games[gameName].player2Rewarded = true;
          LogPay(msg.sender, amount);
          return;
        }
    }

    revert();
  }

}
