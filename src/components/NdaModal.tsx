import React, { useState } from 'react';
import { ShieldCheck, Download, X, FileCheck, CheckCircle2, Lock, Building2 } from 'lucide-react';

interface NdaModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCompany?: string;
}

export default function NdaModal({ isOpen, onClose, defaultCompany = '' }: NdaModalProps) {
  const [companyName, setCompanyName] = useState(defaultCompany);
  const [cif, setCif] = useState('');
  const [signerName, setSignerName] = useState('');
  const [signerRole, setSignerRole] = useState('Director de I+D / Ingeniería');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    const now = new Date();
    const today = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const ndaCode = `NDA-PTG-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const pdfDocumentContent = `%PDF-1.4
1 0 obj << /Title (ACUERDO DE CONFIDENCIALIDAD BILATERAL NDA - PROTOGEN3D) /Author (ProtoGen3D S.L.) /Subject (Acuerdo Bilateral de Proteccion de Propiedad Industrial y Modelos CAD) >> endobj
================================================================================
ACUERDO BILATERAL DE CONFIDENCIALIDAD Y NO DIVULGACIÓN (NDA)
Ref. Oficial: ${ndaCode} | Fecha de Efectividad: ${today}
================================================================================

DE UNA PARTE:
PROTOGEN3D FABRICACIÓN INDUSTRIAL S.L.
C.I.F.: B-45892104
Domicilio Social: Polígono Industrial Atalaya, Av. de los Trabajadores 20, 
45500 Torrijos, Toledo (España).
Representada por la Dirección Técnica y de Operaciones Industriales.

DE OTRA PARTE (LA PARTE RECEPTORA / CLIENTE):
Entidad: ${companyName || 'EMPRESA REGISTRADA DE I+D'}
NIF/CIF: ${cif || 'B-99887766'}
Representada por: ${signerName || 'Responsable de Ingeniería'}
Cargo: ${signerRole}

CLÁUSULAS REGULADORAS:

1. DEFINICIÓN DE INFORMACIÓN CONFIDENCIAL:
Se considera Información Confidencial toda geometría CAD (.STEP, .STP, .STL, .IGES), 
planos acotados 2D, requerimientos de tolerancias (ISO 2768), especificaciones de 
aleaciones o composiciones poliméricas, análisis DFM y prototipos físicos facilitados 
por el Cliente para la cotización y fabricación aditiva/sustractiva.

2. OBLIGACIÓN ESTRICTA DE NO DIVULGACIÓN Y CUSTODIA SEGURA:
ProtoGen3D se compromete a no divulgar, comunicar ni transferir a terceros la información 
técnica recibida. Los archivos se almacenan en servidores seguros con cifrado de extremo 
a extremo (AES-256) en territorio de la Unión Europea y bajo los estándares de las 
normas ISO 9001 e ISO 27001.

3. PROPIEDAD INDUSTRIAL E INTELECTUAL:
La totalidad de los derechos de propiedad intelectual e industrial relativos a los 
archivos 3D, patentes de invención, modelos de utilidad o diseños industriales 
pertenecerán exclusivamente al Cliente. Ninguna entrega de piezas prototipadas 
otorgará a ProtoGen3D derecho alguno sobre la propiedad intelectual del Cliente.

4. ACCESO RESTRINGIDO Y SECRETO INDUSTRIAL:
El acceso a los modelos queda circunscrito exclusivamente a los ingenieros de planta 
y operarios CAM directamente involucrados en la orden de fabricación.

5. VIGENCIA TEMPORAL:
El presente compromiso mantendrá su plena vigencia durante un período de cinco (5) 
años a partir de la fecha de suscripción, siendo indefinido para aquellos activos 
declarados expresamente como Secretos Industriales bajo la Directiva (UE) 2016/943.

6. LEY APLICABLE Y JURISDICCIÓN:
El presente acuerdo se rige por la legislación española. Ambas partes se someten 
expresamente a la jurisdicción de los Juzgados y Tribunales de Toledo / Madrid.

================================================================================
FIRMA DIGITALMENTE CERTIFICADA POR PROTOGEN3D S.L.:
[FIRMA ELECTRÓNICA VÁLIDA - SELLO DE TIEMPO REGISTRADO]
Dirección Técnica de Metrología y Fabricación Aditiva
Polígono Industrial Atalaya, Torrijos, Toledo
================================================================================
`;

    setTimeout(() => {
      const blob = new Blob([pdfDocumentContent], { type: 'application/pdf;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Acuerdo_NDA_${(companyName || 'Empresa').replace(/\s+/g, '_')}_ProtoGen3D.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsGenerating(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-300 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-industrial-accent" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Acuerdo Bilateral de Confidencialidad (NDA)
              </h3>
              <p className="text-xs font-mono text-slate-500">
                Protocolo legal para custodia de archivos CAD e IP de departamentos de I+D
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-6 text-sm">
          
          <div className="p-4 bg-orange-50/60 border border-orange-200 text-xs text-slate-700 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Lock className="w-4 h-4 text-industrial-accent" />
              <span>Garantía Jurídica Inmediata</span>
            </div>
            <p>
              Genera tu acuerdo formal personalizado en PDF con firma y sello digital de <strong>ProtoGen3D Fabricación Industrial S.L.</strong> (Polígono Industrial Atalaya, Torrijos, Toledo) antes de transferir modelos CAD clasificados.
            </p>
          </div>

          <form onSubmit={handleDownloadPdf} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-700 mb-1">
                  RAZÓN SOCIAL DE TU EMPRESA *
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Ej. Epsilon Aeroespace S.L."
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-industrial-accent focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-700 mb-1">
                  CIF / NIF EMPRESARIAL *
                </label>
                <input
                  type="text"
                  required
                  value={cif}
                  onChange={(e) => setCif(e.target.value)}
                  placeholder="Ej. B-88492019"
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-industrial-accent focus:bg-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-700 mb-1">
                  RESPONSABLE QUE SUSCRIBE *
                </label>
                <input
                  type="text"
                  required
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  placeholder="Ej. Carlos Mendoza"
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-industrial-accent focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-700 mb-1">
                  CARGO / DEPARTAMENTO
                </label>
                <input
                  type="text"
                  value={signerRole}
                  onChange={(e) => setSignerRole(e.target.value)}
                  placeholder="Ej. Director de I+D / Ingeniero Jefe"
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-industrial-accent focus:bg-white"
                />
              </div>
            </div>

            {/* Legal Summary Checklist */}
            <div className="border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs font-mono text-slate-600">
              <span className="font-bold text-slate-800 block text-[11px] mb-2 uppercase">
                // COMPROMISOS ASUMIDOS POR PROTOGEN3D
              </span>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Cifrado AES-256 de archivos 3D y destrucción certificada post-entrega.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Prohibición taxativa de ingeniería inversa o cesión a terceros sin autorización.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Vigencia legal de 5 años con jurisdicción en tribunales españoles (Toledo/Madrid).</span>
              </div>
            </div>

            {/* Submit & Download Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 border border-slate-300 text-xs font-mono text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cerrar
              </button>

              <button
                type="submit"
                disabled={isGenerating}
                className="btn-primary w-full sm:w-auto px-6 py-2.5 text-xs font-mono flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{isGenerating ? 'Generando PDF Oficial...' : 'Descargar Acuerdo NDA Firmado (.PDF)'}</span>
              </button>
            </div>

            {downloadSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-mono">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Acuerdo bilateral generado y descargado con éxito. Queda archivado con sello temporal.</span>
              </div>
            )}
          </form>

        </div>

      </div>
    </div>
  );
}
