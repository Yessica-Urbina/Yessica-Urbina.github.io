import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ExternalLink, ChevronDown, ChevronUp, DollarSign, FileText } from 'lucide-react';

const etapasIniciales = [
  {
    id: 1,
    titulo: "1. Preparación y Asesoría",
    items: [
      { id: "prep-1", nombre: "Pagar S/ 70 y enviar comprobante a la agencia", detalle: "Realiza el pago a los medios proporcionados por la agencia y envíales la captura.", completado: false },
      { id: "prep-2", nombre: "Asistir a la asesoría presencial", detalle: "Día martes en Los Olivos. Lleva tus dudas anotadas de esta guía.", completado: false }
    ]
  },
  {
    id: 2,
    titulo: "2. Compra de Pasajes",
    items: [
      { id: "pas-1", nombre: "Comprar vuelo Lima ✈️ Cartagena (Ida y Vuelta)", detalle: "Vuelo que realmente usarás para quedarte con tu familiar.", completado: false },
      { id: "pas-2", nombre: "Comprar pasaje 'fachada' hacia Venezuela", detalle: "Boleto terrestre o aéreo barato desde la costa colombiana a Venezuela (exigencia de Migraciones, no lo abordarás). Preguntar en la asesoría qué ruta recomiendan comprar.", completado: false }
    ]
  },
  {
    id: 3,
    titulo: "3. Ficha de Canje Interpol",
    items: [
      { id: "int-1", nombre: "Pagar arancel de Interpol (S/ 31.50)", detalle: "Paga usando el código 08141 en Págalo.pe o Banco de la Nación.", link: "https://pagalo.pe/", completado: false },
      { id: "int-2", nombre: "Solicitar cita y cargar datos (Agencia)", detalle: "La agencia carga esto el viernes para pedir cita el sábado. Costo de gestión: S/ 83.50", link: "https://interpolperu1.policia.gob.pe/citas/", completado: false },
      { id: "int-3", nombre: "Asistir a la cita y obtener la ficha", detalle: "Sede Monterrico. Debes llevar tu pasaporte original y copia. Te entregan la ficha aprox 1 hora después.", completado: false }
    ]
  },
  {
    id: 4,
    titulo: "4. Salvoconducto (Migraciones Perú)",
    items: [
      { id: "sal-1", nombre: "Pagar arancel de Salvoconducto (S/ 15.20)", detalle: "Paga usando el código 07570 en Págalo.pe o Banco de la Nación.", link: "https://pagalo.pe/", completado: false },
      { id: "sal-2", nombre: "Ingresar trámite en Agencia Virtual (Agencia)", detalle: "Requiere la Ficha de Interpol. Costo de gestión de la agencia: S/ 139.80. Mínimo 20 días antes del vuelo.", link: "https://agenciavirtual.migraciones.gob.pe/agencia-virtual/identidad", completado: false },
      { id: "sal-3", nombre: "Retirar Salvoconducto", detalle: "Migraciones te enviará un correo con fecha y hora para retirar el documento presencialmente.", completado: false }
    ]
  },
  {
    id: 5,
    titulo: "5. Pasaporte Venezolano en Colombia",
    items: [
      { id: "saime-1", nombre: "Pedir cita y pagar Saime online (US$ 216)", detalle: "Agendar en el portal Saime seleccionando el consulado en Colombia (ej. Cartagena, Barranquilla, Bogotá).", link: "https://siic.saime.gob.ve/", completado: false },
      { id: "saime-2", nombre: "Asistir a la cita y pagar arancel consular (US$ 120)", detalle: "Llevar los US$ 120 en efectivo el día de la cita al consulado.", completado: false }
    ]
  }
];

export default function Dashboard() {
  const [tareas, setTareas] = useState(() => {
    const guardado = localStorage.getItem('progresoPasaporte');
    if (guardado) return JSON.parse(guardado);
    return etapasIniciales;
  });
  
  const [expandido, setExpandido] = useState(null);

  useEffect(() => {
    localStorage.setItem('progresoPasaporte', JSON.stringify(tareas));
  }, [tareas]);

  const toggleCompletado = (etapaId, itemId) => {
    const nuevasTareas = [...tareas];
    const etapaIndex = nuevasTareas.findIndex(e => e.id === etapaId);
    const itemIndex = nuevasTareas[etapaIndex].items.findIndex(i => i.id === itemId);
    
    nuevasTareas[etapaIndex].items[itemIndex].completado = !nuevasTareas[etapaIndex].items[itemIndex].completado;
    setTareas(nuevasTareas);
  };

  const calcularProgreso = () => {
    let total = 0;
    let completadas = 0;
    tareas.forEach(etapa => {
      etapa.items.forEach(item => {
        total++;
        if (item.completado) completadas++;
      });
    });
    return Math.round((completadas / total) * 100);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Panel Interactivo</h2>
        <p className="text-blue-100 mb-6 text-sm">Gestiona y haz seguimiento a tu proceso migratorio</p>
        
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Progreso general</span>
            <span className="font-bold text-xl">{calcularProgreso()}%</span>
          </div>
          <div className="w-full bg-black/20 rounded-full h-2.5 overflow-hidden">
            <div className="bg-emerald-400 h-2.5 rounded-full transition-all duration-700 ease-out" style={{ width: `${calcularProgreso()}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold flex items-center text-slate-800 mb-6">
            <FileText className="w-5 h-5 mr-2 text-blue-600" /> Checklist de Tareas
          </h3>
          <div className="space-y-6">
            {tareas.map(etapa => (
              <div key={etapa.id} className="space-y-3">
                <h4 className="font-semibold text-slate-700 bg-slate-50 px-3 py-2 rounded-md border border-slate-100">{etapa.titulo}</h4>
                <div className="space-y-2">
                  {etapa.items.map(item => (
                    <div key={item.id} className="border border-slate-200 rounded-lg overflow-hidden transition-all duration-200 hover:border-blue-300 hover:shadow-sm bg-white">
                      <div className="flex items-center p-3 cursor-pointer select-none" onClick={() => setExpandido(expandido === item.id ? null : item.id)}>
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleCompletado(etapa.id, item.id); }} 
                          className="mr-3 shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-full"
                        >
                          {item.completado ? <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-50" /> : <Circle className="w-6 h-6 text-slate-300 hover:text-blue-400" />}
                        </button>
                        <div className="flex-1 font-medium text-sm">
                          <span className={item.completado ? 'line-through text-slate-400' : 'text-slate-700'}>{item.nombre}</span>
                        </div>
                        <button className="ml-2 text-slate-400">
                          {expandido === item.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </div>
                      {expandido === item.id && (
                        <div className="p-4 bg-slate-50 border-t border-slate-100 text-sm">
                          <p className="text-slate-600 mb-3 leading-relaxed">{item.detalle}</p>
                          {item.link && (
                            <a href={item.link} target="_blank" rel="noreferrer" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-xs shadow-sm">
                              <ExternalLink className="w-3 h-3 mr-2" /> Ir al sitio web oficial
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold flex items-center text-slate-800 mb-5">
              <DollarSign className="w-5 h-5 mr-2 text-emerald-600" /> Presupuesto
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">Agencia (Trámites Perú)</span>
                <span className="text-lg font-semibold text-slate-800">S/ 340.00</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">Aranceles Perú</span>
                <span className="text-lg font-semibold text-slate-800">S/ 46.70</span>
              </div>
              <div className="flex justify-between items-end pb-1">
                <span className="text-sm text-slate-500">Pasaporte Saime</span>
                <span className="text-lg font-semibold text-slate-800">US$ 336.00</span>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center text-sm">
              <FileText className="w-4 h-4 mr-2" /> Información adicional
            </h4>
            <p className="text-xs text-blue-700 leading-relaxed">
              Explora las opciones del menú lateral para ver el desglose completo del archivo Excel, cronogramas y la guía detallada paso a paso.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
