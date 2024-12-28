const WHITE_PIECES = ["♟ ", "♛ ", "♚ ", "♝ ", "♞ ", "♜ "];
const BLACK_PIECES = ["♙ ", "♕ ", "♔ ", "♗ ", "♘ ", "♖ "];
const notations = ["", "a", "b", "c", "d", "e", "f", "g", "h"];
const SPACES = ["🟫", "⬜️"];
const SPACE = " ";


const horizBar = function (times) {
  return "━".repeat(times);
};

function isEven(num) {
  return (num & 1) === 0;
}

// --------------------------- range ---------------------------

function isGreaterThan(from, to) {
  return from > to;
}

function toLessThan(from, to) {
  return from < to;
}

function range(from, to, step) {
  const numbers = [];
  const predicate = from > to ? isGreaterThan : toLessThan;

  for (let index = from; predicate(index, to); index += step) {
    numbers.push(index);
  }

  return numbers;
}

// ---------------------------- board creation ---------------------------

function get8x8(array, index) {
  if (isEven(index)) {
    array.push(array[0]);
    return array;
  }

  array.push(array[1]);
  return array;
}

function create8x8() {
  const oddLine = SPACE + SPACES.join("").repeat(4);
  const evenLine = SPACE + SPACES.reverse().join("").repeat(4);

  return range(0, 6, 1).reduce(get8x8, [evenLine, oddLine]);
}

function createBoard() {
  const squares8x8 = create8x8();
  const whiteLeft = WHITE_PIECES.slice(3, 6).reverse().join("");
  const whiteRight = WHITE_PIECES.slice(1, 6).join("");
  const blackLeft = BLACK_PIECES.slice(3, 6).reverse().join("");
  const blackRight = BLACK_PIECES.slice(1, 6).join("");
  
  squares8x8[0] = SPACE + whiteLeft + whiteRight;
  squares8x8[1] = (SPACE + WHITE_PIECES[0][0]).repeat(8) + SPACE;
  squares8x8[6] = (SPACE + BLACK_PIECES[0][0]).repeat(8) + SPACE;
  squares8x8[7] = SPACE + blackLeft + blackRight;
  squares8x8.unshift(notations.join(" "));

  return squares8x8;
}

// ------------------------------------------------------------------

function joinWithNewLine(string, element, index) {
  if (index === 0) {
    return (string = SPACE + element + "\n" + string);
  }

  return (string = index + element + "\n" + string);
}

function boardToString(board) {
  return board.reduce(joinWithNewLine, "");
}

// -------------------------- Move Validation -----------------------

function isPlayerMoveValid(playerMove) {
  const col = notations.includes(playerMove.slice(0, 1));
  const row = range(1, 9, 1).includes(+playerMove.slice(1, 2));

  return col && row;
}

function getPiece(playerMove, board) {
  const col = +playerMove.slice(0, 1);
  const num = +playerMove.slice(1, 2);
  const row = board[num];

  return row[col * 2 - 1] + row[col * 2];
}

function getPlayerMove(board, currentPlayer, point) {
  console.clear();
  console.log("\n" + horizBar(20) + " ♔ CHESS ♚ " + horizBar(20) + "\n");
  console.log(boardToString(board));

  return getPlayerMoveTo(currentPlayer, point);
}

const getPlayerMoveTo = function (currentPlayer, point) {
  let playerMove = prompt("\n" + currentPlayer + "'s Move " + point + ":");

  while (!isPlayerMoveValid(playerMove)) {
    playerMove = prompt("\n" + currentPlayer + " Please Enter Valid Move :");
  }

  return notations.indexOf(playerMove.slice(0, 1)) + playerMove.slice(1, 2);
};

// ------------------------- moves for pawn ------------------------

const areSpacesInMiddle = function (moves, board) {
  return moves
    .map(function (notation) {
      const piece = getPiece("" + notation, board);
      return SPACES.includes(piece);
    })
    .every(function (boolean) {
      return boolean;
    });
};

const isStraightValid = function (frontMoves, moveTo, board) {
  const piece = getPiece(moveTo, board);

  return areSpacesInMiddle(frontMoves, board) && SPACES.includes(piece);
};

const isCrossValid = function (moveTo, board, pieces) {
  const piece = getPiece(moveTo, board);
  return pieces.includes(piece);
};

// -------------------------- rock -----------------------------------

const rockMoves = function (moveFrom) {
  const from = moveFrom + "";
  const col = from.slice(0, 1);

  const upMoves = range(moveFrom, +(col + "9"), 1);
  const downMoves = range(moveFrom, +(col + "0"), -1);
  const leftMoves = range(moveFrom, 10, -10);
  const rightMoves = range(moveFrom, 89, 10);

  return [upMoves, downMoves, leftMoves, rightMoves];
};

// ------------------------- knight ----------------------------------

const knightMoves = function (moveFrom) {
  const top = [moveFrom + 2 + 10, moveFrom + 2 - 10];
  const midUp = [moveFrom + 1 + 20, moveFrom + 1 - 20];
  const midDown = [moveFrom - 1 + 20, moveFrom - 1 - 20];
  const bottom = [moveFrom - 2 + 10, moveFrom - 2 - 10];

  return [top, midUp, midDown, bottom];
};

// -------------------------- bishop --------------------------------

const bishopMoves = function (moveFrom) {
  const rightUp = range(moveFrom, 89, 11);
  const rightDown = range(moveFrom, 88, 9);
  const leftDown = range(moveFrom, 10, -11);
  const leftUp = range(moveFrom, 10, -9);

  return [rightUp, rightDown, leftUp, leftDown];
};

// -------------------------- king -----------------------------------

const kingMoves = function (moveFrom) {
  const upDown = [moveFrom + 1, moveFrom - 1];
  const leftRight = [moveFrom + 10, moveFrom - 10];
  const rightUpDown = [moveFrom + 11, moveFrom + 9];
  const leftUpDown = [moveFrom - 9, moveFrom - 11];

  return [upDown, leftRight, rightUpDown, leftUpDown];
};

// ------------------------- Queen -----------------------------------

const queenMoves = function (moveFrom) {
  return [rockMoves(moveFrom), bishopMoves(moveFrom)];
};

// -------------------------- pawn -----------------------------------

const wPawnMoves = function (moveFrom) {
  const possibleMoves = [moveFrom + 11, moveFrom - 9, moveFrom + 1];

  if (moveFrom % 10 === 2) {
    possibleMoves.push(moveFrom + 2);
  }

  return possibleMoves;
};

const bPawnMoves = function (moveFrom) {
  const possibleMoves = [moveFrom - 11, moveFrom + 9, moveFrom - 1];

  if (moveFrom % 10 === 7) {
    possibleMoves.push(moveFrom - 2);
  }

  return possibleMoves;
};

// --------------------------- Pawn move Validation ---------------------------

const isPawnMovesValid = function (possibleMoves, moveTo, board, decider) {
  if (!possibleMoves.includes(+moveTo)) {
    return false;
  }

  const frontMoves = possibleMoves.slice(2, possibleMoves.length);
  const upTo = frontMoves.indexOf(+moveTo);
  const piece = getPiece(moveTo, board);
  const pieces = isEven(decider) ? BLACK_PIECES : WHITE_PIECES;

  const isMoveCorrect = frontMoves.includes(+moveTo)
    ? isStraightValid(frontMoves.slice(0, upTo - 1), moveTo, board)
    : pieces.includes(piece) && !SPACES.includes(piece);

  return isMoveCorrect;
};

// --------------------------- rock validation --------------------------------

const isRockMoveValid = function (possibleMoves, moveTo, board, decider) {
  if (!possibleMoves.flat(5).includes(+moveTo)) {
    return false;
  }

  const piece = getPiece(moveTo, board);
  const pieces = isEven(decider) ? WHITE_PIECES : BLACK_PIECES;
  const [moves] = possibleMoves.filter((moves) => moves.includes(+moveTo));
  const movesUpTo = moves.slice(1, moves.indexOf(+moveTo));

  return areSpacesInMiddle(movesUpTo, board) && !pieces.includes(piece);
};

// ----------------------- knight move validation -----------------------------

const isKnightMoveValid = function (possibleMoves, moveTo, board, decider) {
  if (!possibleMoves.flat(5).includes(+moveTo)) {
    return false;
  }

  const piece = getPiece(moveTo, board);
  const pieces = isEven(decider) ? WHITE_PIECES : BLACK_PIECES;

  return !pieces.includes(piece);
};

// -------------------------- bishop move validation --------------------------

const isBishopMoveValid = function (possibleMoves, moveTo, board, decider) {
  if (!possibleMoves.flat(10).includes(+moveTo)) {
    return false;
  }

  const piece = getPiece(moveTo, board);
  const pieces = isEven(decider) ? WHITE_PIECES : BLACK_PIECES;
  const [moves] = possibleMoves.filter((moves) => moves.includes(+moveTo));
  const movesUpTo = moves.slice(1, moves.indexOf(+moveTo));

  return areSpacesInMiddle(movesUpTo, board) && !pieces.includes(piece);
};

// ----------------------- Queen move Validation ------------------------------

const isQueenMoveValid = function (possibleMoves, moveTo, board, decider) {
  if (!possibleMoves.flat(10).includes(+moveTo)) {
    return false;
  }

  const piece = getPiece(moveTo, board);
  const pieces = isEven(decider) ? WHITE_PIECES : BLACK_PIECES;
  const [moves] = possibleMoves
    .flat(1)
    .filter((moves) => moves.includes(+moveTo));
  const movesUpTo = moves.slice(1, moves.indexOf(+moveTo));

  return areSpacesInMiddle(movesUpTo, board) && !pieces.includes(piece);
};

// ----------------------- King Move Validation -------------------------------

const isKingMoveValid = function (possibleMoves, moveTo, board, decider) {
  if (!possibleMoves.flat(10).includes(+moveTo)) {
    return false;
  }

  const piece = getPiece(moveTo, board);
  const pieces = isEven(decider) ? WHITE_PIECES : BLACK_PIECES;

  return !pieces.includes(piece);
};

// ----------------------- valid Moves For piece ------------------------------

function getValidMoves(moveFrom, moveTo, board, decider) {
  const validMoves = [
    isPawnMovesValid,
    isQueenMoveValid,
    isKingMoveValid,
    isRockMoveValid,
    isKnightMoveValid,
    isRockMoveValid,
  ];
  const playerPossibleMoves = [
    wPawnMoves,
    queenMoves,
    kingMoves,
    bishopMoves,
    knightMoves,
    rockMoves,
    [100],
  ];

  const piece = getPiece(moveFrom, board);
  const pieces = isEven(decider) ? WHITE_PIECES : BLACK_PIECES;
  const pieceIndex = pieces.indexOf(piece);
  const index = pieceIndex < 0 ? playerPossibleMoves.length - 1 : pieceIndex;
  const possibleMoves = playerPossibleMoves[index](+moveFrom);

  if (piece === BLACK_PIECES[0]) {
    return isPawnMovesValid(bPawnMoves(+moveFrom), moveTo, board, decider);
  }

  return validMoves[index](possibleMoves, moveTo, board, decider);
}

// ----------------------- notation validation ---------------------

function isFromValid(playerMove, board, pieces) {
  const piece = getPiece(playerMove, board);
  return !SPACES.includes(piece) && !pieces.includes(piece);
}

function isToValid(playerMove, board, pieces) {
  const piece = getPiece(playerMove, board);
  return pieces.includes(piece) || SPACES.includes(piece);
}

function verifyMove(moveFrom, moveTo, board, decider, player1, player2) {
  const pieces = isEven(decider) ? BLACK_PIECES : WHITE_PIECES;

  if (!isFromValid(moveFrom, board, pieces) || !isToValid(moveTo, board, pieces)) {
    return continueGame(board, decider, player1, player2);
  }

  const hasValidMoves = getValidMoves(moveFrom, moveTo, board, decider);
  return !hasValidMoves ? continueGame(board, decider, player1, player2) : true;
}

// ------------------------ replace ---------------------------------

const replace = function (start, end, index, target, text) {
  if (start >= end) {
    return "";
  }

  if (start === index) {
    return target + replace(start + 2, end, index, target, text);
  }

  return (
    text[start] + text[start + 1] + replace(start + 2, end, index, target, text)
  );
};

// ----------------------- move piece --------------------------------

const replaceFrom = function (moveFrom, board) {
  const rowIndex = +moveFrom.slice(1, 2);
  const col = +moveFrom.slice(0, 1);
  const row = board[rowIndex];
  const piece = isEven(col) === isEven(rowIndex) ? SPACES[0] : SPACES[1];
  const moved = replace(1, row.length, col * 2 - 1, piece, row);

  return (board[rowIndex] = SPACE + moved);
};

const movePiece = function (moveFrom, moveTo, board) {
  const piece = getPiece(moveFrom, board);
  const col = +moveTo.slice(0, 1);
  const rowIndex = +moveTo.slice(1, 2);
  const row = board[rowIndex];
  const moved = replace(1, row.length, col * 2 - 1, piece, row);

  board[rowIndex] = SPACE + moved;

  return replaceFrom(moveFrom, board);
};

// ----------------------- main functions ----------------------------

//TODO: check;
//TODO: checkMate;
//TODO: castle;
//TODO: pawnPromotion;

function continueGame(board, decider, player1, player2) { 
  const currentPlayer = isEven(decider) ? player1 : player2;
  const moveFrom = getPlayerMove(board, currentPlayer, "From");
  const moveTo = getPlayerMoveTo(currentPlayer, "To");

  verifyMove(moveFrom, moveTo, board, decider, player1, player2);
  movePiece(moveFrom, moveTo, board);

  return continueGame(board, decider + 1, player1, player2);
}

function main() {
  console.clear();

  const decider = 0;
  const CHESS_BOARD = createBoard();
  const player1 = prompt("\nEnter Player 1 Name : ");
  const player2 = prompt("Enter Player 2 Name : ");

  continueGame(CHESS_BOARD, decider, player1 + " 🤴🏻 ", player2 + " 🤴🏾 ");
}

const CHESS_BOARD = createBoard();

main();

