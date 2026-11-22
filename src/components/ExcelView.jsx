import React, { useState } from 'react';
import { excelData } from '../data';
import { CheckCircle2, Circle } from 'lucide-react';

export default function ExcelView({ sheetName }) {
  const rawData = excelData[sheetName];
  const [completados, setCompletados] = useState(new Set());

  if (!rawData || rawData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-slate-200">
        <p className="text-slate-500">No hay datos disponibles para esta sección.</p>
      </div>
    );
  }

  // Obtener todas las columnas
  const allKeys = Object.keys(rawData[0]);
  
  // Filtrar columnas vacías
  let activeKeys = allKeys.filter(key => {
    return rawData.some(row => row[key] && row[key] !== 'nan' && String(row[key]).trim() !== '');
  });

  // Ocultar las columnas "Manual" y "Automática" en la hoja de Resumen
  if (sheetName === 'Resumen') {
    activeKeys = activeKeys.filter(key => {
      const text = String(rawData[2]?.[key] || '').toLowerCase();
      return !text.includes('automática') && !text.includes('manual');
    });
  }

  // Detectar la fila de encabezados principales
  let headerRowIndex = -1;
  let maxCols = 0;
  rawData.forEach((row, idx) => {
    const colsWithData = activeKeys.filter(k => row[k] && row[k] !== 'nan' && String(row[k]).trim() !== '').length;
    if (colsWithData > maxCols) {
      maxCols = colsWithData;
      headerRowIndex = idx;
    }
  });

  // Función para dar formato a números y links
  const formatValue = (val) => {
    if (!val || val === 'nan') return '';
    const strVal = String(val).trim();
    
    // Si es un número, formatearlo con miles y 2 decimales
    if (!isNaN(strVal) && strVal !== '') {
      const num = parseFloat(strVal);
      return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    
    // Si es un link, hacerlo clickeable
    if (strVal.startsWith('http://') || strVal.startsWith('https://')) {
      return (
        <a href={strVal} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:text-blue-800 hover:underline break-all">
          Ir al enlace 🔗
        </a>
      );
    }
    
    return strVal;
  };

  // Función para el Checklist Interactivo
  const isChecklist = sheetName === 'Checklist';
  const toggleFila = (idx) => {
    if (!isChecklist) return;
    const nuevos = new Set(completados);
    if (nuevos.has(idx)) nuevos.delete(idx);
    else nuevos.add(idx);
    setCompletados(nuevos);
  };

  const avance = Math.min(100, Math.round((completados.size / 27) * 100)); // Calculado en base a 27 tareas

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-300 overflow-hidden animate-in fade-in duration-300 flex flex-col w-full">
      
      {/* Cabecera del Panel */}
      <div className="px-4 md:px-6 py-5 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight">{sheetName.replace(/_/g, ' ')}</h2>
          <p className="text-sm text-slate-600 mt-1 font-medium">Información detallada extraída del documento original.</p>
        </div>
        {isChecklist && (
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 text-center">
            <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Tu Progreso</span>
            <span className="text-2xl font-black text-emerald-600">{avance}%</span>
          </div>
        )}
      </div>
      
      {/* Contenedor de la Tabla */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-sm text-left border-collapse min-w-[700px]">
          <tbody className="divide-y divide-slate-200">
            {rawData.map((row, rowIndex) => {
              const isEmpty = activeKeys.every(k => !row[k] || row[k] === 'nan' || String(row[k]).trim() === '');
              if (isEmpty) return null;

              const filledCols = activeKeys.filter(k => row[k] && row[k] !== 'nan' && String(row[k]).trim() !== '');
              const isTitle = filledCols.length === 1;
              const isHeader = rowIndex === headerRowIndex;
              const isCompleted = completados.has(rowIndex);

              // 1. Filas de Títulos (Una sola columna ancha)
              if (isTitle) {
                return (
                  <tr key={rowIndex} className="bg-slate-800">
                    <td colSpan={activeKeys.length + (isChecklist ? 1 : 0)} className="px-4 md:px-6 py-4 font-black text-white uppercase tracking-wider text-center md:text-left text-sm md:text-base">
                      {String(row[filledCols[0]])}
                    </td>
                  </tr>
                );
              }

              // 2. Fila de Encabezados de Columnas
              if (isHeader) {
                return (
                  <tr key={rowIndex} className="bg-blue-600 border-b-4 border-blue-800">
                    {isChecklist && <td className="w-12 px-4 py-3 bg-blue-700"></td>}
                    {activeKeys.map((key, colIndex) => (
                      <td key={colIndex} className="px-4 md:px-6 py-3 font-bold text-white uppercase text-xs md:text-sm tracking-wider border-r border-blue-500/50 last:border-0">
                        {row[key] && row[key] !== 'nan' ? String(row[key]) : ''}
                      </td>
                    ))}
                  </tr>
                );
              }

              // 3. Filas de Datos Normales (Estilo Cebra + Interactivas si es Checklist)
              const rowClasses = `transition-colors duration-200 ${isChecklist ? 'cursor-pointer hover:bg-blue-50' : 'hover:bg-slate-100'} ${isCompleted ? 'bg-emerald-50' : rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}`;
              const textClasses = isCompleted ? 'line-through text-slate-400' : 'text-slate-800 font-medium';

              return (
                <tr key={rowIndex} className={rowClasses} onClick={() => toggleFila(rowIndex)}>
                  {isChecklist && (
                    <td className="px-4 py-3 border-r border-slate-200 align-middle text-center w-12">
                      {isCompleted ? <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" /> : <Circle className="w-6 h-6 text-slate-300 mx-auto" />}
                    </td>
                  )}
                  {activeKeys.map((key, colIndex) => {
                    const cellValue = row[key];
                    return (
                      <td key={colIndex} className={`px-4 md:px-6 py-3 md:py-4 align-top border-r border-slate-200 last:border-0 ${textClasses}`}>
                        {formatValue(cellValue)}
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
