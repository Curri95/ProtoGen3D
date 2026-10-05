import React from 'react';

const steps = [
  { num: '01', title: 'Archivo CAD/STL', desc: 'Sube tu modelo 3D a nuestra plataforma segura.' },
  { num: '02', title: 'Análisis Técnico', desc: 'Revisión DFM automática y manual por ingenieros.' },
  { num: '03', title: 'Presupuesto', desc: 'Cotización detallada y selección de parámetros.' },
  { num: '04', title: 'Fabricación', desc: 'Producción en planta bajo estándares ISO.' },
  { num: '05', title: 'Control Calidad', desc: 'Inspección metrológica y verificación CMM.' },
  { num: '06', title: 'Entrega', desc: 'Envío asegurado con trazabilidad completa.' },
];

export default function Process() {
  return (
    <section id="proceso" className="bg-white border-t border-slate-200">
      <div className="section-padding">
        <div className="mb-16 text-center">
          <span className="tech-mono text-industrial-accent mb-4 block">// PROTOCOLO DE TRABAJO</span>
          <h2 className="heading-lg">Flujo de Producción</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 relative">
          {/* Decorative line behind steps for lg screens */}
          <div className="hidden lg:block absolute top-[4.5rem] left-0 w-full h-[1px] bg-slate-200 z-0"></div>

          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-slate-50 border-2 border-slate-300 rounded-none flex items-center justify-center text-xl font-bold text-slate-900 mb-6 group-hover:border-industrial-accent group-hover:text-industrial-accent group-hover:bg-white shadow-2xs transition-colors">
                {step.num}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-600 text-sm max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
