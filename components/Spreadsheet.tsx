import React, { useState, useMemo } from 'react';

const COLS = 26; // A-Z
const ROWS = 100;

type CellData = { [key: string]: string }; // e.g. { A1: 'Hello', B2: '100' }

const Spreadsheet: React.FC = () => {
    const [cells, setCells] = useState<CellData>({
        'A1': 'Revenue', 'B1': '1000', 'C1': '1200', 'D1': '1500',
        'A2': 'Expenses', 'B2': '800', 'C2': '900', 'D2': '1100',
        'A4': 'Profit', 'B4': '=SUM(B1:B2)', 'C4': '=SUM(C1:C2)', 'D4': '=SUM(D1:D2)'
    });
    const [editingCell, setEditingCell] = useState<string | null>('A1');
    
    const formulaInput = useMemo(() => cells[editingCell || ''] || '', [cells, editingCell]);

    const columnHeaders = Array.from({ length: COLS }, (_, i) => String.fromCharCode(65 + i));

    const evaluatedCells = useMemo(() => {
        const evaluated: CellData = {};
        const processing = new Set<string>();

        function evaluateCell(key: string): string {
            if (key in evaluated) return evaluated[key];
            if (processing.has(key)) return '#REF!'; // Circular reference detection

            processing.add(key);
            
            const rawValue = cells[key] || '';
            let result = rawValue;

            if (rawValue.startsWith('=')) {
                const sumRegex = /=SUM\(([A-Z]+\d+):([A-Z]+\d+)\)/i;
                const match = rawValue.match(sumRegex);
                
                if (match) {
                    const [, startCell, endCell] = match;
                    const startCol = startCell.match(/[A-Z]+/i)![0];
                    const startRow = parseInt(startCell.match(/\d+/)![0]);
                    const endCol = endCell.match(/[A-Z]+/i)![0];
                    const endRow = parseInt(endCell.match(/\d+/)![0]);
                    
                    const startColIndex = startCol.charCodeAt(0) - 65;
                    const endColIndex = endCol.charCodeAt(0) - 65;
                    
                    let sum = 0;
                    for (let c = Math.min(startColIndex, endColIndex); c <= Math.max(startColIndex, endColIndex); c++) {
                        for (let r = Math.min(startRow, endRow); r <= Math.max(startRow, endRow); r++) {
                            const cellKey = `${String.fromCharCode(65 + c)}${r}`;
                            const cellValue = evaluateCell(cellKey);
                            sum += parseFloat(cellValue) || 0;
                        }
                    }
                    result = sum.toString();
                } else {
                    result = '#NAME?';
                }
            }
            
            processing.delete(key);
            evaluated[key] = result;
            return result;
        }

        Object.keys(cells).forEach(key => evaluateCell(key));
        return evaluated;
    }, [cells]);

    const handleFormulaBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editingCell) {
            setCells(prev => ({...prev, [editingCell]: e.target.value}));
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Spreadsheet</h2>
            <div className="bg-secondary rounded-lg p-4">
                <div className="flex items-center mb-2">
                    <div className="w-20 text-center font-mono text-text-secondary border-r border-border-color mr-2 p-2">{editingCell || ''}</div>
                    <input 
                        type="text"
                        value={formulaInput}
                        onChange={handleFormulaBarChange}
                        placeholder="fx"
                        className="w-full bg-tertiary text-text-primary p-2 rounded-md border border-border-color focus:outline-none focus:ring-2 focus:ring-accent font-mono"
                    />
                </div>
                <div className="overflow-auto h-[calc(100vh-250px)]">
                    <table className="table-fixed w-full border-collapse">
                        <thead className="sticky top-0 bg-tertiary z-10">
                            <tr>
                                <th className="w-16 border border-border-color sticky left-0 bg-tertiary z-20"></th>
                                {columnHeaders.map(header => (
                                    <th key={header} className="w-32 border border-border-color p-1 text-center font-semibold">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: ROWS }, (_, i) => i + 1).map(rowNum => (
                                <tr key={rowNum}>
                                    <td className="sticky left-0 bg-tertiary border border-border-color text-center font-semibold text-text-secondary z-10">{rowNum}</td>
                                    {columnHeaders.map(col => {
                                        const key = `${col}${rowNum}`;
                                        return (
                                            <td key={key} className={`border border-border-color p-1 text-text-primary whitespace-nowrap overflow-hidden ${editingCell === key ? 'ring-2 ring-inset ring-accent' : ''}`} onClick={() => setEditingCell(key)}>
                                                {evaluatedCells[key] || ''}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Spreadsheet;
