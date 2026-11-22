import React from 'react';
import { excelData } from '../data';

export default function ExcelView({ sheetName }) {
  const rawData = excelData[sheetName];

  if (!rawData || rawData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-slate-200">
        <p className="text-slate-500">No hay datos disponibles para esta sección.</p>
      </div>
    );
  }

  // Obtener todas las columnas
  const allKeys = Object.keys(rawData[0]);
  
  // Filtrar columnas que están 100% vacías en toda la hoja
  const activeKeys = allKeys.filter(key => {
    return rawData.some(row => row[key] && row[key] !== 'nan' && String(row[key]).trim() !== '');
  });

  // Identificar la fila que actúa como encabezado (la que tiene más columnas llenas)
  let headerRowIndex = -1;
  let maxCols = 0;
  rawData.forEach((row, idx) => {
    const colsWithData = activeKeys.filter(k => row[k] && row[k] !== 'nan' && String(row[k]).trim() !== '').length;
    if (colsWithData > maxCols) {
      maxCols = colsWithData;
      headerRowIndex = idx;
    }
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-300">
      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-xl font-bold text-slate-800">{sheetName.replace(/_/g, ' ')}</h2>
        <p className="text-sm text-slate-500 mt-1">Datos detallados de tu documento Excel.</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <tbody className="divide-y divide-slate-100">
            {rawData.map((row, rowIndex) => {
              // Omitir filas totalmente vacías
              const isEmpty = activeKeys.every(k => !row[k] || row[k] === 'nan' || String(row[k]).trim() === '');
              if (isEmpty) return null;

              const filledCols = activeKeys.filter(k => row[k] && row[k] !== 'nan' && String(row[k]).trim() !== '');
              const isTitle = filledCols.length === 1;
              const isHeader = rowIndex === headerRowIndex;

              // Estilo para filas de título o separadores
              if (isTitle) {
                return (
                  <tr key={rowIndex} className="bg-slate-100/70">
                    <td colSpan={activeKeys.length} className="px-6 py-4 font-bold text-slate-700 border-t border-slate-200">
                      {String(row[filledCols[0]])}
                    </td>
                  </tr>
                );
              }

              // Estilo para la fila de encabezados principales
              if (isHeader) {
                return (
                  <tr key={rowIndex} className="bg-blue-50/50 border-b-2 border-blue-100">
                    {activeKeys.map((key, colIndex) => (
                      <td key={colIndex} className="px-6 py-3 font-bold text-blue-800 uppercase text-xs tracking-wider">
                        {row[key] && row[key] !== 'nan' ? String(row[key]) : ''}
                      </td>
                    ))}
                  </tr>
                );
              }

              // Filas normales de datos (Acciones, Costos, etc.)
              return (
                <tr key={rowIndex} className="hover:bg-slate-50 transition-colors">
                  {activeKeys.map((key, colIndex) => {
                    const cellValue = row[key];
                    const displayValue = (!cellValue || cellValue === 'nan') ? '' : String(cellValue);
                    return (
                      <td key={colIndex} className="px-6 py-3 text-slate-600 align-top border-r border-slate-50 last:border-0">
                        {displayValue}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
