// Tipos e interfaces
type CellValue = number | null;
type Board = CellValue[][];

export interface SudokuGame {
  initialBoard: Board;
  solution: Board;
  userBoard: Board;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Constantes
const EMPTY_CELL = null;
const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const DIFFICULTY_LEVELS = {
  easy: { min: 36, max: 46 },
  medium: { min: 27, max: 35 },
  hard: { min: 17, max: 26 }
};

// Função principal para gerar um novo jogo
export function generateSudoku(difficulty: 'easy' | 'medium' | 'hard' = 'easy'): SudokuGame {
  // Gerar solução completa
  const solution = generateCompleteBoard();
  
  // Criar tabuleiro inicial removendo números
  const initialBoard = removeNumbers(solution, difficulty);
  
  return {
    initialBoard,
    solution,
    userBoard: deepCopyBoard(initialBoard),
    difficulty
  };
}

// Gera um tabuleiro completo válido usando backtracking
function generateCompleteBoard(): Board {
  const board = createEmptyBoard();
  fillDiagonalBoxes(board);
  solveSudoku(board);
  return board;
}

// Preenche os quadrantes diagonais (independentes entre si)
function fillDiagonalBoxes(board: Board): void {
  for (let box = 0; box < 9; box += 3) {
    fillBox(board, box, box);
  }
}

// Preenche um quadrante 3x3 com números aleatórios
function fillBox(board: Board, startRow: number, startCol: number): void {
  const nums = shuffleArray([...NUMBERS]);
  let index = 0;
  
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      board[startRow + row][startCol + col] = nums[index++];
    }
  }
}

// Resolve o Sudoku usando backtracking
function solveSudoku(board: Board): boolean {
  const emptyCell = findEmptyCell(board);
  if (!emptyCell) return true; // Tabuleiro completo
  
  const [row, col] = emptyCell;
  const nums = shuffleArray([...NUMBERS]);
  
  for (const num of nums) {
    if (isValidPlacement(board, row, col, num)) {
      board[row][col] = num;
      
      if (solveSudoku(board)) {
        return true;
      }
      
      board[row][col] = EMPTY_CELL; // Backtrack
    }
  }
  
  return false;
}

// Remove números do tabuleiro baseado na dificuldade
function removeNumbers(board: Board, difficulty: 'easy' | 'medium' | 'hard'): Board {
  const { min, max } = DIFFICULTY_LEVELS[difficulty];
  const cellsToRemove = Math.floor(Math.random() * (max - min + 1)) + min;
  const newBoard = deepCopyBoard(board);
  
  let removed = 0;
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    
    if (newBoard[row][col] !== EMPTY_CELL) {
      newBoard[row][col] = EMPTY_CELL;
      removed++;
    }
  }
  
  return newBoard;
}

// Verifica se um movimento é válido
export function isValidMove(board: Board, row: number, col: number, value: number): boolean {
  // Verificar linha
  if (board[row].includes(value)) return false;
  
  // Verificar coluna
  if (board.some(r => r[col] === value)) return false;
  
  // Verificar quadrante 3x3
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxRow + i][boxCol + j] === value) return false;
    }
  }
  
  return true;
}

// Verifica se o tabuleiro está completo e válido
export function isBoardComplete(board: Board): boolean {
  // Verificar se todas as células estão preenchidas
  if (board.some(row => row.some(cell => cell === EMPTY_CELL))) {
    return false;
  }
  
  // Verificar se todas as linhas, colunas e quadrantes são válidos
  for (let i = 0; i < 9; i++) {
    const row = board[i];
    const col = board.map(r => r[i]);
    
    if (new Set(row).size !== 9 || new Set(col).size !== 9) {
      return false;
    }
  }
  
  for (let boxRow = 0; boxRow < 9; boxRow += 3) {
    for (let boxCol = 0; boxCol < 9; boxCol += 3) {
      const boxValues = [];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          boxValues.push(board[boxRow + i][boxCol + j]);
        }
      }
      if (new Set(boxValues).size !== 9) {
        return false;
      }
    }
  }
  
  return true;
}

// Retorna dicas para o usuário
export function getHints(board: Board, solution: Board): {row: number, col: number, value: number}[] {
  const emptyCells = [];
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === EMPTY_CELL && solution[row][col] !== null) {
        emptyCells.push({ row, col, value: solution[row][col] as number });
      }
    }
  }
  
  // Retorna 1-3 dicas aleatórias
  return shuffleArray(emptyCells).slice(0, Math.floor(Math.random() * 3) + 1);
}

// Funções utilitárias
function createEmptyBoard(): Board {
  return Array(9).fill(null).map(() => Array(9).fill(EMPTY_CELL));
}

function deepCopyBoard(board: Board): Board {
  return board.map(row => [...row]);
}

function findEmptyCell(board: Board): [number, number] | null {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === EMPTY_CELL) {
        return [row, col];
      }
    }
  }
  return null;
}

function isValidPlacement(board: Board, row: number, col: number, num: number): boolean {
  // Verificar linha
  if (board[row].includes(num)) return false;
  
  // Verificar coluna
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false;
  }
  
  // Verificar quadrante 3x3
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxRow + i][boxCol + j] === num) return false;
    }
  }
  
  return true;
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
