import React from 'react';
import { ArrowRight, Settings } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-50">
      {/* Background with technical grid overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 z-0 opacity-60"
          style={{
            backgroundImage: `linear-gradient(#E2E8F0 1px, transparent 1px), linear-gradient(90deg, #E2E8F0 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        <div className="absolute right-0 top-1/4 w-1/2 h-1/2 bg-industrial-accent/5 blur-[120px] rounded-full z-0" />
      </div>

      <div className="section-padding relative z-20 w-full">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-slate-200 bg-white shadow-2xs rounded-none tech-mono text-slate-700">
            <span className="w-2 h-2 bg-industrial-accent rounded-full animate-pulse" />
            PROTOGEN3D // SISTEMA OPERATIVO [EN LÍNEA]
          </div>
          
          <h1 className="heading-xl mb-6">
            PRECISIÓN MILIMÉTRICA.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600">
              FABRICACIÓN INDUSTRIAL.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
            Servicios avanzados de prototipado y series cortas B2B. Manufactura aditiva y sustractiva con tolerancias aeroespaciales para departamentos de I+D e ingeniería.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#cotizacion" className="btn-primary group">
              Solicitar Presupuesto
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#tecnologias" className="btn-secondary">
              <Settings className="w-5 h-5 mr-2" />
              Ver Capacidades Técnicas
            </a>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-slate-200">
            <div className="bg-white/80 p-4 border border-slate-200 shadow-2xs">
              <div className="text-2xl font-bold text-slate-900 mb-1">±0.01<span className="text-industrial-accent text-lg">mm</span></div>
              <div className="tech-mono text-xs text-slate-500">TOLERANCIA CNC</div>
            </div>
            <div className="bg-white/80 p-4 border border-slate-200 shadow-2xs">
              <div className="text-2xl font-bold text-slate-900 mb-1">24/48<span className="text-industrial-accent text-lg">h</span></div>
              <div className="tech-mono text-xs text-slate-500">TIEMPO FABRICACIÓN</div>
            </div>
            <div className="bg-white/80 p-4 border border-slate-200 shadow-2xs">
              <div className="text-2xl font-bold text-slate-900 mb-1">ISO 9001</div>
              <div className="tech-mono text-xs text-slate-500">CERTIFICACIÓN</div>
            </div>
            <div className="bg-white/80 p-4 border border-slate-200 shadow-2xs">
              <div className="text-2xl font-bold text-slate-900 mb-1">3D / CNC</div>
              <div className="tech-mono text-xs text-slate-500">MULTI-TECNOLOGÍA</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
