import React, { useState } from 'react';
import { Hexagon, Mail, MapPin, Phone, ShieldCheck, Copy, Check, FileCheck } from 'lucide-react';
import NdaModal from './NdaModal';

function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar al portapapeles', err);
    }
  };

  return { copied, copy };
}

export default function Footer() {
  const ndaText = "Gestión segura bajo acuerdo NDA estándar o personalizado para departamentos de I+D";
  const { copied, copy } = useCopyToClipboard();
  const [isNdaModalOpen, setIsNdaModalOpen] = useState(false);

  return (
    <footer className="bg-slate-100 border-t border-slate-200 pt-16 pb-8 text-slate-600">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Security & NDA Guarantee Bar */}
        <div className="mb-12 p-4 bg-white border border-slate-200 shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-industrial-accent" />
            </div>
            <p className="text-sm font-medium text-slate-800 leading-snug">
              {ndaText}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => setIsNdaModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-xs font-mono text-industrial-accent hover:text-industrial-accent-hover transition-colors font-semibold"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Generar NDA Oficial (.PDF)</span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => copy(ndaText)}
                title="Copiar texto de garantía NDA al portapapeles"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 text-xs font-mono text-slate-700 hover:text-slate-900 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copiar garantía</span>
                  </>
                )}
              </button>

              {/* Ephemeral Tooltip */}
              {copied && (
                <div 
                  role="status"
                  aria-live="polite"
                  className="absolute -top-9 right-0 bg-slate-900 text-white text-[11px] font-mono px-2.5 py-1 shadow-md whitespace-nowrap border border-slate-700"
                >
                  ✓ Copiado
                  <div className="absolute -bottom-1 right-5 w-2 h-2 bg-slate-900 border-r border-b border-slate-700 transform rotate-45" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div className="lg:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-6 group">
              <Hexagon className="w-8 h-8 text-industrial-accent" />
              <span className="text-xl font-bold tracking-tight text-slate-900">PROTOGEN<span className="text-industrial-accent">3D</span></span>
            </a>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Partner de fabricación industrial B2B. Transformamos diseños en componentes funcionales con máxima precisión y trazabilidad.
            </p>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold mb-6 tech-mono text-sm tracking-wider">CONTACTO</h4>
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-industrial-accent shrink-0 mt-0.5" />
                <span>
                  Polígono Industrial Atalaya<br />
                  Avenida de los Trabajadores, 20<br />
                  Torrijos, Toledo (España)
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-industrial-accent shrink-0" />
                <span>+34 925 000 000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-industrial-accent shrink-0" />
                <span>ingenieria@protogen3d.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold mb-6 tech-mono text-sm tracking-wider">ENLACES RÁPIDOS</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><a href="#servicios" className="hover:text-industrial-accent transition-colors">Servicios CNC y 3D</a></li>
              <li><a href="#tecnologias" className="hover:text-industrial-accent transition-colors">Materiales y Tolerancias</a></li>
              <li><a href="#proyectos" className="hover:text-industrial-accent transition-colors">Casos de Éxito</a></li>
              <li><a href="#cotizacion" className="hover:text-industrial-accent transition-colors">Portal de Subida B2B</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold mb-6 tech-mono text-sm tracking-wider">LEGAL</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><a href="#" className="hover:text-slate-900 transition-colors">Política de Privacidad</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Acuerdo NDA</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Política de Cookies</a></li>
            </ul>
          </div>
          
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 tech-mono">
          <p>&copy; {new Date().getFullYear()} PROTOGEN3D B2B. TODOS LOS DERECHOS RESERVADOS.</p>
          <div className="flex gap-4">
            <span>ISO 9001:2015 CERTIFIED</span>
            <span>|</span>
            <span>SYSTEM V.1.4.0</span>
          </div>
        </div>
      </div>

      <NdaModal
        isOpen={isNdaModalOpen}
        onClose={() => setIsNdaModalOpen(false)}
      />
    </footer>
  );
}
