import { useState, useCallback, useEffect } from 'react';
import './PixelGrid.css';

interface PixelGridProps {
  rows?: number;
  cols?: number;
}

const PixelGrid = ({ rows = 6, cols = 9 }: PixelGridProps) => {
  const [grid, setGrid] = useState<boolean[][]>(
    Array(rows).fill(null).map(() => Array(cols).fill(false))
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [savedData, setSavedData] = useState<number[][]>([]);

  useEffect(() => {
    console.log(savedData);
  }, [savedData]);

  const togglePixel = useCallback((row: number, col: number) => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((r, rIdx) =>
        r.map((cell, cIdx) => {
          if (rIdx === row && cIdx === col) {
            return true; // Set to black
          }
          return cell;
        })
      );
      return newGrid;
    });
  }, []);

  const handleMouseDown = (row: number, col: number) => {
    setIsDrawing(true);
    togglePixel(row, col);
  };

  const handleMouseMove = (row: number, col: number) => {
    if (isDrawing) {
      togglePixel(row, col);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseLeave = () => {
    setIsDrawing(false);
  };

  const clearGrid = () => {
    setGrid(Array(rows).fill(null).map(() => Array(cols).fill(false)));
  };

  const saveGrid = () => {
    // Flatten the grid row by row into a single array of 54 elements
    const flattened: number[] = grid.flat().map(pixel => pixel ? 1 : 0);
    setSavedData(prev => [...prev, flattened]);
  };

  return (
    <div className="pixel-grid-container">
      <div
        className="pixel-grid"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="pixel-row">
            {row.map((isBlack, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`pixel ${isBlack ? 'black' : 'white'}`}
                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                onMouseMove={() => handleMouseMove(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="button-group">
        <button className="clear-button" onClick={clearGrid}>
          Clear
        </button>
        <button className="save-button" onClick={saveGrid}>
          Save
        </button>
      </div>
    </div>
  );
};

export default PixelGrid;
