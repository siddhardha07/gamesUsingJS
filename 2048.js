//--------------------- Global Declartion ---------------------

const SPACE = " ";
const ALL_SPACE = "        ";
const TOP_LEFT = "┏";
const BOTTOM_LEFT = "┗";
const TOP_RIGTH = "┓";
const BOTTOM_RIGHT = "┛"
const VERTICAL_BAR = "┃";
const HORIZONTAL_BAR = "━";
const LEFT_CONNECT = "┣";
const TOP_CONNECT = "┳";
const BOTTOM_CONNECT = "┻";
const RIGHT_CONEECT = "┫";
const CENTER_CONNECT = "╋";
const VALID_MOVES = "WASDwasd";
const START_INDEX = 77;
const NEW_LINE_LENGTH = 152;
const LENGTH = 9;
const SPACE_IN_BOX = 7;
const LAST_INDEX = 560;

// ----------------------- slice & replace ---------------------

function slice(start, end, text) {
  if (start > end) {
    return "";
  }

  return text[start] + slice(start + 1, end, text)
}

function getReplacedText(text, target, replacement, index) {
  if (index > text.length - 1) {
    return "";
  }

  if (index === target) {
    return replacement + getReplacedText(text, target, replacement, index + LENGTH - 1);
  }

  return text[index] + getReplacedText(text, target, replacement, index + 1);
}

function replace(text, target, replacement) {
  if (text === "") {
    return text;
  }

  return getReplacedText(text, target, replacement, 0);
}

// -------------------------- Creation of Board --------------------------

function arrange(start, middle, corner, noOfTimes) {
  let string = start;

  for (let i = 0; i < LENGTH - 1; i++) {
    string = string + middle;
  }

  if (noOfTimes === 0) {
    return string;
  }

  string += corner;
  return arrange(string, middle, corner, noOfTimes - 1)
}

function repeat(string, noOfTimes) {
  if (noOfTimes === 0) {
    return "";
  }

  return string + repeat(string, noOfTimes - 1);
}

function getBoard(noOfBoxes) {
  const topOfBoard = arrange(TOP_LEFT, HORIZONTAL_BAR, TOP_CONNECT, noOfBoxes) + TOP_RIGTH;
  const spacesRow = arrange(VERTICAL_BAR, SPACE, VERTICAL_BAR, noOfBoxes) + VERTICAL_BAR;
  const middleRow = arrange(LEFT_CONNECT, HORIZONTAL_BAR, CENTER_CONNECT, noOfBoxes) + RIGHT_CONEECT;
  const middleOfBoard = repeat(spacesRow + "\n", noOfBoxes) + middleRow;
  const bottomOfBoard = arrange(BOTTOM_LEFT, HORIZONTAL_BAR, BOTTOM_CONNECT, noOfBoxes) + BOTTOM_RIGHT;

  return topOfBoard + "\n" + repeat(middleOfBoard + "\n", noOfBoxes) + repeat(spacesRow + "\n", noOfBoxes) + bottomOfBoard;
}

// ------------------------ Add numbers to the board --------------------

function putNumInMiddleOfBox(number) {
  if (number < 1) {
    return ALL_SPACE;
  }

  let value = "" + number;
  const noOfDigits = value.length;

  for (let noOfLetters = noOfDigits; noOfLetters < SPACE_IN_BOX; noOfLetters += 2) {
    value = SPACE + value + SPACE;
  }

  return value.length < LENGTH - 1 ? SPACE + value : value;
}

function arrangeBoard(num, index, toSpaceIndex, board) {
  const value = putNumInMiddleOfBox(num);
  const updatedBoard = replace(board, index, value);

  return replace(updatedBoard, toSpaceIndex, ALL_SPACE);
}

function addCommonNumbers(board, index, nextNumIndex, sideNumLength) {
  let updatedBoard = board;
  let aboveNumIndex = index;

  for (let index = 0; index < 4; index++) {
    const aboveNumber = +slice(aboveNumIndex, aboveNumIndex + SPACE_IN_BOX, updatedBoard);
    const belowNumIndex = aboveNumIndex + nextNumIndex;
    const belowNumber = +slice(belowNumIndex, belowNumIndex + SPACE_IN_BOX, updatedBoard);

    if (aboveNumber === belowNumber || aboveNumber === 0) {
      const resultantNum = aboveNumber + belowNumber;
      updatedBoard = arrangeBoard(resultantNum, aboveNumIndex, belowNumIndex, updatedBoard);
    }

    aboveNumIndex = aboveNumIndex + sideNumLength;
  }

  return updatedBoard;
}

function arrangeAccordingToMove(board, numberIndex, difference, sideNumLength, toCheck) {
  let updatedBoard = board;

  if (toCheck === 0) {
    return updatedBoard;
  }

  const updatedTopRow = addCommonNumbers(updatedBoard, numberIndex, difference, sideNumLength);//towords up
  const updatedSecondRow = addCommonNumbers(updatedTopRow, numberIndex + difference, difference, sideNumLength);
  const updatedThirdRow = addCommonNumbers(updatedSecondRow, numberIndex + difference * 2, difference, sideNumLength);
  const updatedLastRow = addCommonNumbers(updatedThirdRow, numberIndex, difference, sideNumLength);

  return arrangeAccordingToMove(updatedLastRow, numberIndex, difference, sideNumLength, toCheck - 1);
}

// ----------------------------- Move Validation -----------------------------

function userDecision(board, userMove) {
  switch (userMove) {
    case "w":
    case "W":
      return arrangeAccordingToMove(board, START_INDEX, NEW_LINE_LENGTH, LENGTH, 2);
    case "S":
    case "s":
      return arrangeAccordingToMove(board, LAST_INDEX, -NEW_LINE_LENGTH, -LENGTH, 2);
    case "A":
    case "a":
      return arrangeAccordingToMove(board, START_INDEX, LENGTH, NEW_LINE_LENGTH, 2);
    case "D":
    case "d":
      return arrangeAccordingToMove(board, LAST_INDEX, -LENGTH, -NEW_LINE_LENGTH, 2);
  }
}

function includes(text, char) {
  for (let index = 0; index < text.length; index++) {
    if (text[index] === char) {
      return true;
    }
  }

  return false;
}

function takePlayerInput() {
  let playerMove = prompt("Enter here : ");

  while (!includes(VALID_MOVES, playerMove)) {
    playerMove = prompt("Invalid Move Try Again : ");
  }

  return playerMove;
}

// -------------- Space validation & Number allocation ---------------------

function getLeastInRow(board, startingIndex) {
  let leastInRow = 2048;
  let updatedBoard = board;
  let numberIndex = startingIndex

  for (let index = 0; index < 4; index++) {
    const least = +slice(numberIndex, numberIndex + SPACE_IN_BOX, updatedBoard);

    if (leastInRow > least && least !== 0) {
      leastInRow = least;
    }

    numberIndex += LENGTH;
  }

  return leastInRow;
}

function getLeastInBoard(board, startingIndex) {
  let leastInBoard = 2048;
  let numberIndex = startingIndex

  for (let index = 0; index < 4; index++) {
    const leastInRow = getLeastInRow(board, numberIndex);
    if (leastInBoard > leastInRow && leastInRow !== 0) {
      leastInBoard = leastInRow;
    }
    numberIndex += NEW_LINE_LENGTH;
  }

  return leastInBoard === 2048 ? 2 : leastInBoard;
}

function getRandomNum(from, to) {
  return from + Math.ceil(Math.random() * (to - from));
}

function generateNum(board, index) {
  const randomNum = getRandomNum(0, 100);

  if (randomNum % 2 === 0) {
    const leastInBoard = getLeastInBoard(board, START_INDEX);
    const value = putNumInMiddleOfBox(leastInBoard);

    return replace(board, index, value);
  }

  return board;
}

function fillEmptyRows(board, startingIndex) {
  let updatedBoard = board;
  let numberIndex = startingIndex;

  for (let index = 0; index < 4; index++) {
    if (+slice(numberIndex, numberIndex + SPACE_IN_BOX, updatedBoard) === 0) {
      updatedBoard = generateNum(updatedBoard, numberIndex);
    }

    numberIndex += LENGTH;
  }

  return updatedBoard;
}

function fillEmptyBox(board, rowIndex) {
  let updatedBoard = board;

  if (rowIndex > board.length) {
    return updatedBoard;
  }

  updatedBoard = fillEmptyRows(updatedBoard, rowIndex);

  return fillEmptyBox(updatedBoard, rowIndex + NEW_LINE_LENGTH);
}

function isEmptySpacesLeft(board, startingIndex, noOfRows) {
  let updatedBoard = board;
  let numberIndex = startingIndex;

  for (let index = 0; index < 4; index++) {
    if (+slice(numberIndex, numberIndex + SPACE_IN_BOX, updatedBoard) === 0) {
      return true;
    }

    numberIndex += LENGTH;
  }

  if (noOfRows === 0) {
    return false;
  }

  return isEmptySpacesLeft(board, startingIndex + NEW_LINE_LENGTH, noOfRows - 1);
}

// ------------------------- Instructions & Messages --------------------------

function getInstructions() {
  const toMoveup = "\n 🔺 'Enter 'W' or 'w' ⬆️ "
  const toMoveDown = "\n 🔻 'Enter 's' or 's' ⬇️";
  const toMoveLeft = "\n 👈 'Enter 'A' or 'a' ⬅️"
  const toMoveRigth = "\n 👉 'Enter 'D' or 'd' ➡️ \n";

  return toMoveup + toMoveDown + toMoveLeft + toMoveRigth;
}

function gameOverMsg(playerName, playerScore) {
  if (playerScore > 2400) {
    let winnerMsg = "\n🏅 Winners never quit, and quitters never win. 🏆\n";
    winnerMsg = winnerMsg + playerName + "\n You Are The True Winner 🫂\n";
    return winnerMsg + "\n Your Score : " + playerScore;
  }

  if (playerScore > 800) {
    let gameOver = "\n Well Done  " + playerName + "\n";
    gameOver = gameOver + "\n Your Score : " + playerScore + "\n";
    return gameOver + "\n😊 I am Proud Of The Effort You Put In. 🥹";
  }


  return "\n😊 Well Done " + playerName + "\n\nYour Score : " + playerScore;
}

function gameName() {
  const name = ("\n-------------* 2️⃣ 0️⃣ 4️⃣ 8️⃣  *-------------\n");

  return name + "A Single-Player Sliding Block Puzzle Game\n";
}

function gameRules() {
  let rules = "\n👉🏿 The objective of the game is to slide numbered tiles on a grid"
  rules += "\n👉🏿 To combine them to create a tile with the number 2048\n"
  rules += "👉🏿 However one can continue to play the game after reaching the goal";

  return rules + "\n👉🏿 Creating tiles with larger numbers."
}

// --------------------------- Game Interface ------------------------------

function gameInterface(board, playerName, playerScore) {
  console.clear();
  console.log(gameName());

  const generatedBoard = fillEmptyBox(board, START_INDEX);

  console.log(generatedBoard);
  console.log("\n" + playerName + "'s Score : " + playerScore + "\n");
  console.log(getInstructions());

  const userMove = takePlayerInput();
  const updatedBoard = userDecision(generatedBoard, userMove);

  if (board === updatedBoard && !isEmptySpacesLeft(updatedBoard, START_INDEX, 4)) {
    return playerScore;
  }

  return gameInterface(updatedBoard, playerName, playerScore + 10);
}

function gameMechanics() {
  console.clear();

  const board = getBoard(3);

  console.log(gameName());
  console.log(gameRules());

  const playerName = prompt("\nEnter Your Name To Continue : ")
  const playerScore = gameInterface(board, playerName, 0);

  console.log(gameOverMsg(playerName, playerScore));

  if (confirm("\n 🥹 Do You Want To Play Again 🥹")) {
    gameMechanics();
  } else {
    console.log("\n      😔 'Goodbye' 🖐🏼     \n");
  }
}

gameMechanics();

