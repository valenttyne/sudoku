'use client';

import React, { useState } from 'react';
import { generateSudoku, isValidMove, isBoardComplete, getHints } from '../lib/sudoku';
import type { SudokuGame } from '../lib/sudoku';
import SudokuCell from './SudokuCell';
import SudokuControls from './SudokuControls';
import toast from 'react-hot-toast';

export default function SudokuBoard() {
  const [game, setGame] = useState<SudokuGame | null>(null);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [showRules, setShowRules] = useState(false);

  // Gera o board apenas no client
  React.useEffect(() => {
    if (!game) {
      setGame(generateSudoku('easy'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Captura input do teclado para digitação rápida
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return;
      if (e.key >= '1' && e.key <= '9') {
        handleNumberInput(Number(e.key));
      }
      if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        handleNumberInput(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedCell, game]);

  if (!game) {
    return <div className="text-center py-16">Carregando Sudoku...</div>;
  }

  if (showRules) {
    return (
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Regras do Sudoku</h2>
        <ol className="list-decimal ml-6 mb-4">
          <li>Todas as colunas devem ter todos os números de 1 a 9, sem repetição.</li>
          <li>Todas as linhas devem ter todos os números de 1 a 9, sem repetição.</li>
          <li>Cada quadrante 3x3 deve ter todos os números de 1 a 9, sem repetição.</li>
        </ol>
        <p>Preencha todas as posições vazias seguindo as regras acima.</p>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setShowRules(false)}>Voltar ao Jogo</button>
      </div>
    );
  }

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (value: number | null) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    if (game.initialBoard[row][col] !== null) {
      toast.error('Esta célula é fixa!');
      return;
    }
    const newUserBoard = game.userBoard.map(r => [...r]);
    if (value === null) {
      newUserBoard[row][col] = null;
      setGame({ ...game, userBoard: newUserBoard });
      return;
    }
    if (!isValidMove(game.userBoard, row, col, value)) {
      toast.error('Movimento inválido!');
      return;
    }
    newUserBoard[row][col] = value;
    setGame({ ...game, userBoard: newUserBoard });
    if (isBoardComplete(newUserBoard)) {
      toast.success('Parabéns! Você completou o Sudoku!');
    }
  };

  const handleNewGame = () => {
    setGame(generateSudoku(game.difficulty));
    setSelectedCell(null);
    toast.success('Novo jogo iniciado!');
  };

  const handleGetHints = () => {
    const hints = getHints(game.userBoard, game.solution);
    const newUserBoard = game.userBoard.map(r => [...r]);
    hints.forEach(hint => {
      newUserBoard[hint.row][hint.col] = hint.value;
    });
    setGame({ ...game, userBoard: newUserBoard });
    toast.success(`Dicas adicionadas: ${hints.length}`);
  };

  const handleCheckLogic = () => {
    // Verifica se há algum erro de lógica nas posições preenchidas pelo usuário
    let foundError = false;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = game.userBoard[row][col];
        if (
          value !== null &&
          value !== game.solution[row][col] &&
          game.initialBoard[row][col] === null
        ) {
          foundError = true;
        }
      }
    }
    if (foundError) {
      toast.error('Há erros de lógica nas posições preenchidas!');
    } else {
      toast.success('Nenhum erro de lógica encontrado!');
    }
  };

  const handleShowRules = () => {
    setShowRules(true);
  };

  const handleSetDifficulty = (d: 'easy' | 'medium' | 'hard') => {
    setGame(generateSudoku(d));
    setSelectedCell(null);
  };

  
  if (showRules) {
    return (
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Regras do Sudoku</h2>
        <ol className="list-decimal ml-6 mb-4">
          <li>Todas as colunas devem ter todos os números de 1 a 9, sem repetição.</li>
          <li>Todas as linhas devem ter todos os números de 1 a 9, sem repetição.</li>
          <li>Cada quadrante 3x3 deve ter todos os números de 1 a 9, sem repetição.</li>
        </ol>
        <p>Preencha todas as posições vazias seguindo as regras acima.</p>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setShowRules(false)}>Voltar ao Jogo</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="grid grid-cols-9 gap-0 border-2 border-gray-800">
        {game.userBoard.map((row: (number|null)[], rowIndex: number) => (
          row.map((cell: number|null, colIndex: number) => (
            <SudokuCell
              key={`${rowIndex}-${colIndex}`}
              value={cell}
              row={rowIndex}
              col={colIndex}
              isInitial={game.initialBoard[rowIndex][colIndex] !== null}
              isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
              onClick={handleCellClick}
            />
          ))
        ))}
      </div>
      <SudokuControls
        onNewGame={handleNewGame}
        onGetHints={handleGetHints}
        onCheckLogic={handleCheckLogic}
        onShowRules={handleShowRules}
        difficulty={game.difficulty}
        setDifficulty={handleSetDifficulty}
      />
    </div>
  );
}
