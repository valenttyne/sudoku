import SudokuBoard from '../../components/SudokuBoard';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Sudoku</h1>
        <SudokuBoard />
        <Toaster position="bottom-center" />
      </div>
    </main>
  );
}


