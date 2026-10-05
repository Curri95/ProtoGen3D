import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const projects = [
  {
    title: 'Carcasa Disipadora Aeroespacial',
    challenge: 'Reducción de peso del 40% manteniendo disipación térmica y resistencia estructural bajo vibración.',
    solution: 'Optimización topológica y fabricación aditiva en DMLS (Aluminio AlSi10Mg).',
    result: 'Peso reducido en 43%, mejora térmica del 15%.',
    tech: 'DMLS Metal 3D',
    imageUrl: '/src/assets/images/heatsink_aerospace_1791193682868.jpg'
  },
  {
    title: 'Engranaje de Transmisión Crítica',
    challenge: 'Replicar pieza descatalogada para maquinaria pesada con plano original extraviado.',
    solution: 'Escaneo 3D metrológico, ingeniería inversa CAD y mecanizado CNC 5 ejes.',
    result: 'Pieza operativa en 72h con tolerancias de ±0.01mm.',
    tech: 'Ing. Inversa + CNC',
    imageUrl: '/src/assets/images/gear_transmission_1791193665709.jpg'
  }
];

export default function Projects() {
  return (
    <section id="proyectos" className="bg-slate-50 border-t border-slate-200">
      <div className="section-padding">
        <div className="mb-12 flex justify-between items-end">
          <div>
            <span className="tech-mono text-industrial-accent mb-4 block">// CASOS DE ESTUDIO</span>
            <h2 className="heading-lg">Proyectos Destacados</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((proj, idx) => (
            <div key={idx} className="group cursor-pointer bg-white border border-slate-200 overflow-hidden flex flex-col shadow-xs hover:border-slate-400 transition-colors">
              <div className="relative h-64 overflow-hidden border-b border-slate-200">
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10" />
                <img 
                  src={proj.imageUrl} 
                  alt={proj.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute top-4 right-4 z-20 bg-slate-900/90 backdrop-blur px-3 py-1 tech-mono text-xs text-white border border-slate-700">
                  {proj.tech}
                </div>
              </div>
              
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-industrial-accent transition-colors">{proj.title}</h3>
                  <ArrowUpRight className="text-slate-400 group-hover:text-industrial-accent transition-colors" />
                </div>
                
                <div className="space-y-4 text-sm flex-grow">
                  <div>
                    <strong className="block text-slate-700 tech-mono text-xs mb-1">RETO:</strong>
                    <p className="text-slate-600">{proj.challenge}</p>
                  </div>
                  <div>
                    <strong className="block text-slate-700 tech-mono text-xs mb-1">SOLUCIÓN:</strong>
                    <p className="text-slate-600">{proj.solution}</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <strong className="block text-industrial-accent tech-mono text-xs mb-1">RESULTADO OBTENIDO:</strong>
                  <p className="text-slate-900 font-semibold">{proj.result}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
