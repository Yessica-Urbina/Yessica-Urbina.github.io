import React from 'react';
import { excelData } from '../data';

export default function ExcelView({ sheetName }) {
  const data = excelData[sheetName];

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-slate-200">
        <p className="text-slate-500">No hay datos disponibles para esta sección.</p>
      </div>
    );
  }

  // Extraer las claves (columnas) del primer objeto
  const headers = Object.keys(data[0]).filter(k => k && !k.startsWith('Unnamed'));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-300">
      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-xl font-bold text-slate-800">{sheetName.replace(/_/g, ' ')}</h2>
        <p className="text-sm text-slate-500 mt-1">Datos extraídos del documento Excel original.</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-600 bg-slate-100/50 border-b border-slate-200">
            <tr>
              {headers.map((header, i) => (
                <th key={i} className="px-6 py-4 font-semibold uppercase tracking-wider whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, rowIndex) => {
              // Skip empty rows (where all header fields are basically empty or NaN in the JSON)
              const isEmpty = headers.every(h => !row[h] || row[h] === 'nan');
              if (isEmpty) return null;

              // Check if this row looks like a sub-header (only first column has text, others empty)
              const isSubheader = headers.length > 1 && row[headers[0]] && headers.slice(1).every(h => !row[h] || row[h] === 'nan');

              if (isSubheader) {
                return (
                  <tr key={rowIndex} className="bg-slate-50/80">
                    <td colSpan={headers.length} className="px-6 py-3 font-bold text-slate-700 border-t border-slate-200">
                      {String(row[headers[0]])}
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={rowIndex} className="hover:bg-blue-50/30 transition-colors">
                  {headers.map((header, colIndex) => {
                    const cellValue = row[header];
                    const displayValue = (!cellValue || cellValue === 'nan') ? '' : String(cellValue);
                    return (
                      <td key={colIndex} className="px-6 py-3 text-slate-600 align-top">
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
