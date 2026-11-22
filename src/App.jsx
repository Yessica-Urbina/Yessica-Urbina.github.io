import React, { useState } from 'react';
import { Menu, LayoutDashboard, FileSpreadsheet, Map, CheckSquare, Calendar, Globe, BookOpen, AlertCircle, Search } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ExcelView from './components/ExcelView';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Panel Principal', icon: LayoutDashboard, category: 'INICIO' },
    { id: 'Resumen', label: 'Resumen y Costos', icon: FileSpreadsheet, category: 'DATOS EXCEL' },
    { id: 'Ruta', label: 'Ruta Paso a Paso', icon: Map, category: 'DATOS EXCEL' },
    { id: 'Cotizacion', label: 'Cotización Detallada', icon: FileSpreadsheet, category: 'DATOS EXCEL' },
    { id: 'Comparativa', label: 'Agencia vs Propia', icon: FileSpreadsheet, category: 'DATOS EXCEL' },
    { id: 'Interpol', label: 'Guía: Interpol', icon: BookOpen, category: 'TRÁMITES' },
    { id: 'Salvoconducto', label: 'Guía: Salvoconducto', icon: BookOpen, category: 'TRÁMITES' },
    { id: 'Pasaporte_VE', label: 'Guía: Pasaporte VE', icon: BookOpen, category: 'TRÁMITES' },
    { id: 'Checklist', label: 'Checklist Excel', icon: CheckSquare, category: 'SEGUIMIENTO' },
    { id: 'Cronograma', label: 'Cronograma', icon: Calendar, category: 'SEGUIMIENTO' },
    { id: 'Fuentes', label: 'Fuentes y Links', icon: Globe, category: 'REFERENCIAS' },
  ];

  // Agrupar menú
  const categories = [...new Set(menuItems.map(item => item.category))];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      
      {/* Sidebar */}
      <aside className={`bg-slate-900 text-slate-300 w-64 flex-shrink-0 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full absolute h-full z-20'}`}>
        <div className="h-16 flex items-center px-6 bg-slate-950 border-b border-slate-800">
          <BookOpen className="w-6 h-6 text-blue-400 mr-3" />
          <span className="font-bold text-white tracking-wide">Manual Trámites</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          {categories.map((cat, idx) => (
            <div key={idx} className="mb-6">
              <p className="px-6 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{cat}</p>
              <ul>
                {menuItems.filter(i => i.category === cat).map(item => (
                  <li key={item.id}>
                    <button 
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center px-6 py-2.5 text-sm transition-colors ${activeTab === item.id ? 'bg-blue-600/20 text-blue-400 border-r-4 border-blue-500 font-medium' : 'hover:bg-slate-800 hover:text-white'}`}
                    >
                      <item.icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 justify-between shadow-sm z-10">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 mr-4 rounded-md hover:bg-slate-100 text-slate-600 focus:outline-none"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-slate-800 hidden sm:block">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input type="text" placeholder="Buscar..." className="bg-transparent border-none focus:outline-none text-sm w-32 sm:w-64" />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' ? <Dashboard /> : <ExcelView sheetName={activeTab} />}
          </div>
        </div>
      </main>

    </div>
  );
}
