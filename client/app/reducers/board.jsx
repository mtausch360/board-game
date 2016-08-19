import Immutable from 'immutable';
export default (state = initializeState(), action) => {

  switch (action.type) {
  case "SELECT_PIECE":
    return selectPiece(state, action);
  case "SELECT_TILE":
    return selectTile(state, action);
  default:
    return state;
  }
}

function initializeState() {
  let board = initializeBoard();
  return {
    board,
    pieces: initializePieces(board),
    selectedPiece: 'none',
    selectedTile: 'none',
    availableMoves: {},
    currentTurn: 'red'
  };
}

/**
 * [initializeBoard description]
 * @return {[type]} [description]
 */
function initializeBoard() {
  const board = [];
  for (let row = 0; row < 8; row++) {
    board[row] = [];
    for (let column = 0; column < 8; column++) {
      let color = (column + row) % 2 === 0 ? 'white' : 'black';
      board[row][column] = {
        color,
        column,
        row,
        id: 't-' + row + '-' + column,
      };
    }
  }
  return board;
}

/**
 * [initializePieces description]
 * @param  {[type]} board [description]
 * @return {[type]}       [description]
 */
function initializePieces(board) {
  let pieces = {};
  traverseBoard(board, (tile, row, col) => {
    let piece = null;
    if (tile.color === 'white' && (row < 3 || row >= 8 - 3)) {
      piece = {}
      piece.color = row < 3 ? 'black' : 'red';
      piece.id = 'p-' + row + '-' + col;
      piece.row = row;
      piece.column = col;
      piece.tileId = tile.id;
      piece.king = false;
    }
    if (piece) {
      pieces[tile.id] = piece;
    }
  });
  return pieces;
}
/**
 * Selects piece, figures out available moves if any
 * @param  {[type]} state  [description]
 * @param  {[type]} action [description]
 * @return {[type]}        [description]
 */
function selectPiece(state, action) {
  //calculate available moves (any diagonal tile that does not have a piece)
  let piece = getPieceById(state.pieces, action.id);
  if (piece.color !== state.currentTurn) {
    return state;
  }
  let availableMoves= findAvailableMoves(piece, state.pieces);


  return Object.assign({}, state, { selectedPiece: action.id, availableMoves });
}

/**
 * [findAvailableMoves description]
 * @param  {[type]} piece  [description]
 * @param  {[type]} pieces [description]
 * @return {[type]}        [description]
 */
function findAvailableMoves(state, piece, availableMoves={}, kills=[]) {
  let { row, column } = piece;
  //find which directions piece can traverse
  let rowInc = -1;
  let rowDir = 2;

  if (piece.king) {
    //we good
  } else if (piece.color === 'black') {
    //black goes down
    rowInc = 1;
  } else {
    //red looks up
    rowDir = -2;
  }
  //need to find when path ends
  for (; rowInc <= 1 && rowInc >= -1; rowInc += rowDir) {
    for (let colInc = -1; colInc <= 1; colInc += 2) {
      let rowIdx = rowInc + row;
      let colIdx = colInc + column;


      //if a valid spot
      if (isValidLocation(rowIdx, colIdx)) {
        //found a piece
        if (isPieceAtLocation(state.pieces  , rowIdx, colIdx)) {
          //is that piece of the same team?
          if (state.pieces  [getTileId(rowIdx, colIdx)].color !== piece.color) {
            //check for jump
            if (isValidLocation(rowIdx + rowInc, colIdx + colInc) && !isPieceAtLocation(state.pieces  , rowIdx + rowInc, colIdx + colInc)) {
              //found jump
              availableMoves[getTileId(rowIdx + rowInc, colIdx + colInc)] = [getTileId(rowIdx, colIdx)];
            }
          }

        } else {
          //found a path
          //otherwise spot is open, single move, no jumps
          availableMoves[getTileId(rowIdx, colIdx)] = [];
        }
      }
    }
  }
  return availableMoves;
}

/**
 * Handles select Tile actions, moves piece if valid move
 * @param  {[type]} state  [description]
 * @param  {[type]} action [description]
 * @return {[type]}        [description]
 */
function selectTile(state, action) {
  //move piece to tile
  if (state.selectedPiece) {
    //want to move selected Piece to action Id which is tile id
    if (state.availableMoves[action.id]) {

      let pieceToMove = getPieceById(state.pieces, state.selectedPiece);
      let tileToMoveTo = action.id;
      let tileToMoveFrom = pieceToMove.tileId;

      let [row, column] = getTileById(action.id);

      if (pieceToMove.color === 'red' && row === 0 || pieceToMove.color === 'black' && row === 7)
        pieceToMove.king = true;

      let newPiece = Object.assign({}, pieceToMove, { row, column, tileId: action.id });
      //remove piece from old location, add new piece to new location
      let pieceChanges = {
        [action.id]: newPiece, [tileToMoveFrom]: null };
      //remove pieces from jump
      state.availableMoves[action.id].forEach((tileId) => pieceChanges[tileId] = null);
      let newPieces = Object.assign({}, state.pieces, pieceChanges);
      //change turn
      let currentTurn = state.currentTurn == 'black' ? 'red' : 'black';

      return Object.assign({}, state, { selectedTile: 'none', pieces: newPieces, selectedPiece: 'none', availableMoves: {}, currentTurn });

    }
  }

  return state;
}


/**
 * general helper function which executes a cb with all the tiles of the board
 * @param  {[type]}   board [description]
 * @param  {Function} cb    [description]
 * @return {[type]}         [description]
 */
function traverseBoard(board, cb) {
  board.forEach((row, rowIdx) => {
    row.forEach((tile, colIdx) => {
      cb(tile, rowIdx, colIdx);
    });
  });
}

/**
 * given the pieces and an id, find the piece with the matching id
 * 
 * @param  {[type]} board [description]
 * @param  {[type]} id    [description]
 * @return {[type]}       [description]
 */
function getPieceById(pieces, pieceId) {
  let keys = Object.keys(pieces);
  let result = null;
  keys.forEach((tileId) => {
    if (pieces[tileId] && pieces[tileId].id === pieceId)
      result = pieces[tileId];
  })
  return result;
}

/**
 * [getTileById description]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
function getTileById(id) {
  return [Number(id[2]), Number(id[4])];
}

function getTileId(row, column) {
  return 't-' + row + '-' + column;
}

/**
 * [isPieceAtLocation description]
 * @param  {[type]}  board [description]
 * @param  {[type]}  row   [description]
 * @param  {[type]}  col   [description]
 * @return {Boolean}       [description]
 */
function isPieceAtLocation(pieces, row, col) {
  return !!pieces['t-' + row + '-' + col];

}

/**
 * [isValidLocation description]
 * @param  {[type]}  row [description]
 * @param  {[type]}  col [description]
 * @return {Boolean}     [description]
 */
function isValidLocation(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}
