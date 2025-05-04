type SudokuCellProps = {
  value: number | null;
  row: number;
  col: number;
  isInitial: boolean;
  isSelected: boolean;
  onClick: (row: number, col: number) => void;
};

export default function SudokuCell({
  value,
  row,
  col,
  isInitial,
  isSelected,
  onClick
}: SudokuCellProps) {
  return (
    <div 
      className={`
        w-12 h-12 flex items-center justify-center text-xl font-bold
        border border-gray-300
        ${(row % 3 === 2) ? 'border-b-2 border-gray-800' : ''}
        ${(col % 3 === 2) ? 'border-r-2 border-gray-800' : ''}
        ${isInitial ? 'bg-gray-100' : 'bg-white'}
        ${isSelected ? 'bg-blue-100 ring-2 ring-blue-500' : ''}
        cursor-pointer select-none
      `}
      onClick={() => onClick(row, col)}
    >
      {value ?? ''}
    </div>
  );
}
