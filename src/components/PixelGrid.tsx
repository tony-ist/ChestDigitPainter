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
  const [isErasing, setIsErasing] = useState(false);
  const [savedData, setSavedData] = useState<number[][]>([]);
  const [showToast, setShowToast] = useState(false);
  const [label, setLabel] = useState<string>('');

  useEffect(() => {
    console.log(savedData);
  }, [savedData]);

  const setPixel = useCallback((row: number, col: number, isBlack: boolean) => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((r, rIdx) =>
        r.map((cell, cIdx) => {
          if (rIdx === row && cIdx === col) {
            return isBlack; // Set to black or white
          }
          return cell;
        })
      );
      return newGrid;
    });
  }, []);

  const handleMouseDown = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (e.button === 0) {
      // Left mouse button - draw black
      setIsDrawing(true);
      setIsErasing(false);
      setPixel(row, col, true);
    } else if (e.button === 2) {
      // Right mouse button - draw white (erase)
      setIsErasing(true);
      setIsDrawing(false);
      setPixel(row, col, false);
    }
  };

  const handleMouseMove = (_e: React.MouseEvent, row: number, col: number) => {
    if (isDrawing) {
      setPixel(row, col, true);
    } else if (isErasing) {
      setPixel(row, col, false);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setIsErasing(false);
  };

  const handleMouseLeave = () => {
    setIsDrawing(false);
    setIsErasing(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent context menu on right click
  };

  const clearGrid = () => {
    setGrid(Array(rows).fill(null).map(() => Array(cols).fill(false)));
  };

  const isValidLabel = (value: string): boolean => {
    // Check if the string is exactly one digit (0-9), disallowing negative numbers
    return /^[0-9]$/.test(value);
  };

  const saveGrid = () => {
    // Extract the digit from label
    const digits = label.match(/\d/g);
    const labelDigit = digits ? parseInt(digits[0], 10) : 0;
    
    // Flatten the grid row by row into a single array of 54 elements
    const flattened: number[] = grid.flat().map(pixel => pixel ? 1 : 0);
    
    // Prepend label as the first value in the array
    const dataWithLabel: number[] = [labelDigit, ...flattened];
    
    setSavedData(prev => [...prev, dataWithLabel]);
    setShowToast(true);
    clearGrid();
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
    // Revoke the blob URL to free up memory
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pixel-grid-container">
      <div
        className="pixel-grid"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onContextMenu={handleContextMenu}
      >
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="pixel-row">
            {row.map((isBlack, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`pixel ${isBlack ? 'black' : 'white'}`}
                onMouseDown={(e) => handleMouseDown(e, rowIndex, colIndex)}
                onMouseMove={(e) => handleMouseMove(e, rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="saved-data-counter">
        Saved: {savedData.length}
      </div>
      <div className="label-input-container">
        <label htmlFor="label-input">Label:</label>
        <input
          id="label-input"
          type="text"
          className="label-input"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Enter digit (0-9)"
        />
      </div>
      <div className="button-group">
        <button className="clear-button" onClick={clearGrid}>
          Clear
        </button>
        <button 
          className="save-button" 
          onClick={saveGrid}
          disabled={!isValidLabel(label)}
        >
          Save
        </button>
        <button className="download-button" onClick={downloadCSV} disabled={savedData.length === 0}>
          Download CSV
        </button>
      </div>
      <Toast
        message="Digit saved successfully!"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default PixelGrid;
