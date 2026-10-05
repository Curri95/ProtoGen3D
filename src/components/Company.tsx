import React from 'react';
import { ShieldCheck, Factory, Binary, MapPin } from 'lucide-react';

export default function Company() {
  return (
    <section id="empresa" className="bg-white border-t border-slate-200 relative overflow-hidden">
      {/* Abstract structural graphic */}
      <div className="absolute right-0 top-0 w-1/3 h-full border-l border-slate-200 opacity-60 hidden lg:block pointer-events-none">
        <div className="w-full h-px bg-slate-200 absolute top-1/4" />
        <div className="w-full h-px bg-slate-200 absolute top-2/4" />
        <div className="w-full h-px bg-slate-200 absolute top-3/4" />
      </div>

      <div className="section-padding relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <span className="tech-mono text-industrial-accent mb-4 block">// INFRAESTRUCTURA PROTOGEN3D</span>
            <h2 className="heading-lg mb-6">Capacidad de Planta y Control de Calidad</h2>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              Instalaciones preparadas para la alta exigencia del sector B2B. Nuestro parque de maquinaria se renueva constantemente para ofrecer las últimas capacidades en manufactura aditiva y sustractiva.
            </p>
            
            <ul className="space-y-6">
              <li className="flex gap-4">
                <Factory className="w-8 h-8 text-industrial-accent shrink-0" />
                <div>
                  <h4 className="text-slate-900 font-bold mb-1">Parque de Maquinaria Avanzado</h4>
                  <p className="text-slate-600 text-sm">Más de 25 equipos industriales en planta incluyendo centros de mecanizado de 5 ejes y sistemas DMLS.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <ShieldCheck className="w-8 h-8 text-industrial-accent shrink-0" />
                <div>
                  <h4 className="text-slate-900 font-bold mb-1">Metrología Estricta</h4>
                  <p className="text-slate-600 text-sm">Laboratorio climatizado con Máquinas de Medición por Coordenadas (CMM) y escáneres ópticos para emisión de certificados.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <MapPin className="w-8 h-8 text-industrial-accent shrink-0" />
                <div>
                  <h4 className="text-slate-900 font-bold mb-1">Planta de Fabricación Central</h4>
                  <p className="text-slate-600 text-sm">Polígono Industrial Atalaya, Avenida de los Trabajadores 20, Torrijos (Toledo).</p>
                </div>
              </li>
              <li className="flex gap-4">
                <Binary className="w-8 h-8 text-industrial-accent shrink-0" />
                <div>
                  <h4 className="text-slate-900 font-bold mb-1">Confidencialidad Garantizada</h4>
                  <p className="text-slate-600 text-sm">Protocolos estrictos de seguridad de la información (ISO 27001) para proteger la propiedad intelectual (IP) de nuestros clientes.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 p-8 text-center flex flex-col justify-center min-h-[200px] shadow-2xs">
              <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">2500<span className="text-industrial-accent text-2xl">m²</span></div>
              <div className="tech-mono text-xs text-slate-500">ÁREA DE PRODUCCIÓN</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-8 text-center flex flex-col justify-center min-h-[200px] shadow-2xs">
              <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">48<span className="text-industrial-accent text-2xl">h</span></div>
              <div className="tech-mono text-xs text-slate-500">ENTREGA PROMEDIO</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-8 text-center flex flex-col justify-center min-h-[200px] shadow-2xs">
              <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">&lt;0.5<span className="text-industrial-accent text-2xl">%</span></div>
              <div className="tech-mono text-xs text-slate-500">TASA DE RECHAZO</div>
            </div>
            <div className="bg-orange-50/70 border border-orange-200 p-8 text-center flex flex-col justify-center min-h-[200px] shadow-2xs">
              <div className="text-2xl font-bold text-slate-900 mb-2">ISO 9001</div>
              <div className="tech-mono text-xs text-industrial-accent font-semibold">CERTIFICACIÓN ACTIVA</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
