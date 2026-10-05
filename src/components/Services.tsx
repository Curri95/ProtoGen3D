import React, { useState } from 'react';
import { Layers, Zap, Scan, Ruler, CheckCircle2, Sliders, ArrowRight } from 'lucide-react';

const services = [
  {
    id: '01',
    title: 'Impresión 3D Industrial',
    description: 'Fabricación aditiva avanzada (FDM, SLS, SLA, DMLS) a partir de archivos .STL o CAD. Ideal para prototipado rápido y geometrías complejas.',
    icon: Layers,
    tags: ['Nylon PA12', 'Resinas Técnicas', 'Metal']
  },
  {
    id: '02',
    title: 'Mecanizado CNC',
    description: 'Fresado y torneado CNC de 3 a 5 ejes para series cortas y medias. Máxima precisión geométrica y acabados superficiales superiores.',
    icon: Zap,
    tags: ['Aluminio 6061/7075', 'Acero Inox', 'Titanio']
  },
  {
    id: '03',
    title: 'Ingeniería Inversa',
    description: 'Digitalización 3D mediante escáneres de luz estructurada y láser. Reconstrucción paramétrica de piezas descatalogadas o sin planimetría.',
    icon: Scan,
    tags: ['Nube de Puntos', 'Modelado CAD', 'Control Dimensional']
  },
  {
    id: '04',
    title: 'Análisis y Optimización',
    description: 'Verificación de tolerancias, análisis de elementos finitos (FEA) y optimización topológica para reducir peso manteniendo propiedades mecánicas.',
    icon: Ruler,
    tags: ['DFM', 'Análisis FEM', 'Metrología']
  }
];

interface ProcessComparison {
  name: string;
  category: string;
  tolerance: string;
  toleranceGrade: 'ultra' | 'high' | 'standard';
  costLevel: string;
  costBadge: string;
  costRating: 1 | 2 | 3 | 4;
  roughness: string;
  roughnessGrade: 'mirror' | 'smooth' | 'textured';
  bestFor: string;
  setupTime: string;
}

const COMPARISON_DATA: ProcessComparison[] = [
  {
    name: 'Mecanizado CNC (5 Ejes)',
    category: 'Sustractivo',
    tolerance: '±0.01 mm',
    toleranceGrade: 'ultra',
    costLevel: 'Medio - Alto (por set-up CAM)',
    costBadge: '€€€',
    costRating: 3,
    roughness: 'Ra 0.8 - 1.6 µm (Rectificado: Ra 0.4 µm)',
    roughnessGrade: 'mirror',
    bestFor: 'Ajustes de rodamiento H7, metales macizos y máxima rigidez mecánica.',
    setupTime: '24-48 horas'
  },
  {
    name: 'Impresión 3D SLS (Nylon PA12)',
    category: 'Aditivo Polímero',
    tolerance: '±0.25 mm (o ±0.3%)',
    toleranceGrade: 'standard',
    costLevel: 'Muy Económico (sin utillaje)',
    costBadge: '€',
    costRating: 1,
    roughness: 'Ra 8.0 - 12.0 µm (Vapor Smoothing: Ra < 2 µm)',
    roughnessGrade: 'textured',
    bestFor: 'Preseries funcionales 1-50 uds, carcasas y geometrías sin soportes.',
    setupTime: '12-24 horas'
  },
  {
    name: 'Impresión 3D SLA (Resinas Técnicas)',
    category: 'Aditivo Foto-polímero',
    tolerance: '±0.10 mm',
    toleranceGrade: 'high',
    costLevel: 'Económico - Medio',
    costBadge: '€€',
    costRating: 2,
    roughness: 'Ra 0.2 - 0.8 µm (Acabado molde de inyección)',
    roughnessGrade: 'mirror',
    bestFor: 'Prototipos cosméticos, verificación dimensional fina y túnel de viento.',
    setupTime: '12-24 horas'
  },
  {
    name: 'Impresión 3D Metal DMLS',
    category: 'Aditivo Metálico',
    tolerance: '±0.10 mm (tras tratamiento)',
    toleranceGrade: 'high',
    costLevel: 'Alto (Sinterizado Láser Metal)',
    costBadge: '€€€€',
    costRating: 4,
    roughness: 'Ra 6.0 - 9.0 µm (Mecanizable localmente)',
    roughnessGrade: 'textured',
    bestFor: 'Canales internos de refrigeración conformada, titanio e Inconel.',
    setupTime: '48-72 horas'
  }
];

export default function Services() {
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'tolerance' | 'cost' | 'roughness'>('all');

  return (
    <section id="servicios" className="bg-white border-t border-slate-200">
      <div className="section-padding">
        
        {/* Section Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="tech-mono text-industrial-accent mb-4 block">// CAPACIDADES PRODUCTIVAS</span>
            <h2 className="heading-lg">Servicios de Ingeniería</h2>
          </div>
          <p className="text-slate-600 max-w-md tech-mono text-sm leading-relaxed">
            Desarrollamos soluciones integrales desde la fase de concepto hasta la producción de series cortas, asegurando repetibilidad y calidad bajo norma ISO 9001.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {services.map((svc) => (
            <div key={svc.id} className="border border-slate-200 bg-slate-50/70 p-8 group hover:border-industrial-accent hover:bg-white transition-all duration-200 relative overflow-hidden shadow-2xs">
              <div className="absolute top-0 right-0 bg-white px-3 py-1 tech-mono text-xs text-slate-500 border-b border-l border-slate-200">
                SRV-{svc.id}
              </div>
              
              <svc.icon className="w-10 h-10 text-industrial-accent mb-6 opacity-90 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{svc.title}</h3>
              <p className="text-slate-600 mb-6 line-clamp-3">
                {svc.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {svc.tags.map(tag => (
                  <span key={tag} className="text-xs font-mono px-2 py-1 bg-white border border-slate-200 text-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* NEW: Interactive Decision Matrix / Comparator for Industrial Buyers */}
        <div className="bg-slate-50 border border-slate-200 p-6 md:p-10 shadow-xs">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sliders className="w-5 h-5 text-industrial-accent" />
                <span className="tech-mono text-xs text-industrial-accent font-semibold tracking-wider uppercase">
                  Herramienta de Decisión de Fabricación B2B
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                Comparador Rápido de Procesos Industriales
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Contrasta los 3 factores críticos antes de bloquear el plano CAD: tolerancia, coste en preserie y rugosidad Ra.
              </p>
            </div>

            {/* Filter by Engineering Priority */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-slate-500 mr-1">Prioridad:</span>
              <button
                type="button"
                onClick={() => setSelectedPriority('all')}
                className={`px-3 py-1.5 text-xs font-mono transition-colors ${
                  selectedPriority === 'all' 
                    ? 'bg-industrial-accent text-white font-semibold' 
                    : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'
                }`}
              >
                Todos los parámetros
              </button>
              <button
                type="button"
                onClick={() => setSelectedPriority('tolerance')}
                className={`px-3 py-1.5 text-xs font-mono transition-colors ${
                  selectedPriority === 'tolerance' 
                    ? 'bg-industrial-accent text-white font-semibold' 
                    : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'
                }`}
              >
                🎯 Máxima Tolerancia
              </button>
              <button
                type="button"
                onClick={() => setSelectedPriority('cost')}
                className={`px-3 py-1.5 text-xs font-mono transition-colors ${
                  selectedPriority === 'cost' 
                    ? 'bg-industrial-accent text-white font-semibold' 
                    : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'
                }`}
              >
                💰 Menor Coste Preserie
              </button>
              <button
                type="button"
                onClick={() => setSelectedPriority('roughness')}
                className={`px-3 py-1.5 text-xs font-mono transition-colors ${
                  selectedPriority === 'roughness' 
                    ? 'bg-industrial-accent text-white font-semibold' 
                    : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'
                }`}
              >
                ✨ Mejor Acabado Ra
              </button>
            </div>
          </div>

          {/* Decision Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px] bg-white border border-slate-200">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-100/90 text-xs font-mono text-slate-700 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Proceso Industrial</th>
                  <th className={`py-3.5 px-4 transition-colors ${selectedPriority === 'tolerance' ? 'bg-orange-100/60 text-industrial-accent font-bold' : ''}`}>
                    1. Tolerancia Alcanzable
                  </th>
                  <th className={`py-3.5 px-4 transition-colors ${selectedPriority === 'cost' ? 'bg-orange-100/60 text-industrial-accent font-bold' : ''}`}>
                    2. Coste en Preserie (1-10 Uds)
                  </th>
                  <th className={`py-3.5 px-4 transition-colors ${selectedPriority === 'roughness' ? 'bg-orange-100/60 text-industrial-accent font-bold' : ''}`}>
                    3. Acabado Superficial (Ra)
                  </th>
                  <th className="py-3.5 px-4">Idoneidad Técnica</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {COMPARISON_DATA.map((proc, idx) => {
                  const isHighlighted = 
                    (selectedPriority === 'tolerance' && proc.toleranceGrade === 'ultra') ||
                    (selectedPriority === 'cost' && proc.costRating === 1) ||
                    (selectedPriority === 'roughness' && proc.name.includes('SLA'));

                  return (
                    <tr 
                      key={idx} 
                      className={`hover:bg-slate-50 transition-colors ${isHighlighted ? 'bg-orange-50/40 ring-1 ring-inset ring-orange-300' : ''}`}
                    >
                      {/* Name & Category */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          {isHighlighted && <span className="w-2 h-2 rounded-full bg-industrial-accent shrink-0 animate-pulse" />}
                          <span>{proc.name}</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500 block mt-0.5">{proc.category}</span>
                      </td>

                      {/* 1. Tolerance */}
                      <td className={`py-4 px-4 font-mono ${selectedPriority === 'tolerance' ? 'bg-orange-50/70' : ''}`}>
                        <div className="font-bold text-slate-900 text-sm">{proc.tolerance}</div>
                        <span className="text-[11px] text-slate-500">
                          {proc.toleranceGrade === 'ultra' ? 'Grado micrométrico aeroespacial' : proc.toleranceGrade === 'high' ? 'Ajuste fino de ensamble' : 'Tolerancia funcional estándar'}
                        </span>
                      </td>

                      {/* 2. Cost */}
                      <td className={`py-4 px-4 ${selectedPriority === 'cost' ? 'bg-orange-50/70' : ''}`}>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs px-2 py-0.5 bg-slate-100 border border-slate-300 font-bold text-slate-800">
                            {proc.costBadge}
                          </span>
                          <span className="text-xs text-slate-700 font-medium">{proc.costLevel}</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500 block mt-1">Lead time: {proc.setupTime}</span>
                      </td>

                      {/* 3. Roughness */}
                      <td className={`py-4 px-4 ${selectedPriority === 'roughness' ? 'bg-orange-50/70' : ''}`}>
                        <div className="font-mono text-xs font-semibold text-industrial-accent">
                          {proc.roughness}
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          {proc.roughnessGrade === 'mirror' ? 'Apta para pulido óptico / estanqueidad' : 'Textura porosa / granallable'}
                        </span>
                      </td>

                      {/* Best for */}
                      <td className="py-4 px-4 text-xs text-slate-600 max-w-xs">
                        {proc.bestFor}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Quick CTA footer inside comparator */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 font-mono">
            <span className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Verificación dimensional en laboratorio CMM disponible para cualquiera de los 4 procesos.
            </span>
            <a 
              href="#cotizacion" 
              className="text-industrial-accent hover:text-industrial-accent-hover font-bold flex items-center gap-1"
            >
              <span>Subir CAD para cotización comparativa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
