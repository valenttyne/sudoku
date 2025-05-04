type SudokuControlsProps = {
  onNewGame: () => void;
  onGetHints: () => void;
  onCheckLogic: () => void;
  onShowRules: () => void;
  difficulty: 'easy' | 'medium' | 'hard';
  setDifficulty: (d: 'easy' | 'medium' | 'hard') => void;
};

export default function SudokuControls({
  onNewGame,
  onGetHints,
  onCheckLogic,
  onShowRules,
  difficulty,
  setDifficulty
}: SudokuControlsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="flex gap-2">
        <button 
          onClick={onNewGame}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Novo Jogo
        </button>
        <button 
          onClick={onGetHints}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Dicas
        </button>
        <button 
          onClick={onCheckLogic}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
        >
          Verificar Lógica
        </button>
        <button 
          onClick={onShowRules}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
        >
          Regras
        </button>
      </div>
      <div className="flex gap-2 items-center">
        <span className="font-medium">Dificuldade:</span>
        <select
          value={difficulty}
          onChange={e => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
          className="border rounded px-2 py-1"
        >
          <option value="easy">Fácil</option>
          <option value="medium">Médio</option>
          <option value="hard">Difícil</option>
        </select>
      </div>
    </div>
  );
}
