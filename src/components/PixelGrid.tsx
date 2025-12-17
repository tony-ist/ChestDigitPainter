import { useState, useCallback } from 'react';
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
      <button className="clear-button" onClick={clearGrid}>
        Clear
      </button>
    </div>
  );
};

export default PixelGrid;
