import { useState, useCallback, useEffect } from 'react';
import './PixelGrid.css';
import Toast from './Toast';

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
  const [showToast, setShowToast] = useState(false);

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
    setShowToast(true);
  };

  const downloadCSV = () => {
    if (savedData.length === 0) {
      return; // No data to download
    }

    // Convert savedData to CSV format (no header row, each row has 54 values)
    const csvContent = savedData
      .map(row => row.join(','))
      .join('\n');

    // Create a blob and download it
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'saved_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <button className="download-button" onClick={downloadCSV} disabled={savedData.length === 0}>
          Download CSV
        </button>
      </div>
      <Toast
        message="Grid saved successfully!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default PixelGrid;
