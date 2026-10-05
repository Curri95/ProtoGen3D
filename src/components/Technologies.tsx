import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, Shield, Info } from 'lucide-react';

const technologies = [
  { tech: 'CNC Milling (5-Ejes)', tolerance: '±0.01 mm', materials: 'Aluminio 7075/6061, Acero Inox 316L, Titanio, POM', maxVolume: '1000 x 500 x 500 mm' },
  { tech: 'SLS (Sinterizado Láser)', tolerance: '±0.25 mm', materials: 'Nylon PA12, PA11, TPU, Alumide', maxVolume: '380 x 330 x 460 mm' },
  { tech: 'SLA (Estereolitografía)', tolerance: '±0.10 mm', materials: 'Resina ABS-like, Alta Temp, Clear, Dental', maxVolume: '600 x 600 x 400 mm' },
  { tech: 'DMLS (Impresión Metal)', tolerance: '±0.10 mm', materials: 'Aluminio AlSi10Mg, Acero Inox 316L, Titanio Ti64', maxVolume: '250 x 250 x 325 mm' },
  { tech: 'FDM Industrial', tolerance: '±0.20 mm', materials: 'ABS, PC, ULTEM 9085, PEEK Técnico', maxVolume: '914 x 610 x 914 mm' },
];

interface MaterialSpec {
  id: string;
  name: string;
  code: string;
  technology: string;
  tensileStrength: string; // Resistencia a tracción MPa
  youngsModulus: string;   // Módulo de Young GPa
  hdtTemp: string;         // Temperatura HDT °C
  elongation: string;      // Alargamiento a la rotura
  density: string;         // Densidad
  features: string;
}

const MATERIALS_DATA: MaterialSpec[] = [
  {
    id: 'pa12',
    name: 'Nylon PA12',
    code: 'PA-2200 / EOS',
    technology: 'SLS (Sinterizado Láser)',
    tensileStrength: '48 MPa',
    youngsModulus: '1.7 GPa (1.700 MPa)',
    hdtTemp: '163 °C (@0.45 MPa)',
    elongation: '18 %',
    density: '0.95 g/cm³',
    features: 'Excelente resistencia al impacto, isotropía mecánica casi total y estanqueidad química.'
  },
  {
    id: 'resina-abs',
    name: 'Resina ABS-like Técnica',
    code: 'Accura Xtreme / SLA',
    technology: 'SLA (Estereolitografía)',
    tensileStrength: '55 MPa',
    youngsModulus: '2.4 GPa (2.400 MPa)',
    hdtTemp: '68 °C (@0.45 MPa)',
    elongation: '12 %',
    density: '1.18 g/cm³',
    features: 'Alta definición superficial, paredes delgadas (0.4 mm) y acabado semejante a inyección.'
  },
  {
    id: 'alsi10mg',
    name: 'Aluminio AlSi10Mg',
    code: 'DIN EN 1706 / DMLS',
    technology: 'DMLS (Metal 3D)',
    tensileStrength: '410 MPa',
    youngsModulus: '70 GPa (70.000 MPa)',
    hdtTemp: '450 °C (Continuo)',
    elongation: '8 %',
    density: '2.67 g/cm³',
    features: 'Aleación ligera de silicio y magnesio con excelente conductividad térmica y soldabilidad.'
  },
  {
    id: 'al7075',
    name: 'Aluminio 7075-T6',
    code: 'Aeroespacial / CNC',
    technology: 'Mecanizado CNC 5-Ejes',
    tensileStrength: '570 MPa',
    youngsModulus: '72 GPa (72.000 MPa)',
    hdtTemp: '480 °C (Límite operacional)',
    elongation: '11 %',
    density: '2.81 g/cm³',
    features: 'Relación resistencia-peso comparable a aceros estructurales; mecanizado para alta fatiga.'
  },
  {
    id: 'inox316l',
    name: 'Acero Inoxidable 316L',
    code: 'AISI 316L / 1.4404',
    technology: 'CNC / DMLS',
    tensileStrength: '620 MPa',
    youngsModulus: '193 GPa (193.000 MPa)',
    hdtTemp: '850 °C',
    elongation: '35 %',
    density: '7.99 g/cm³',
    features: 'Inmunidad a la corrosión por cloruros, biocompatibilidad médica y resistencia criogénica.'
  },
  {
    id: 'peek',
    name: 'PEEK Industrial',
    code: 'Polyetheretherketone',
    technology: 'FDM Industrial / CNC',
    tensileStrength: '98 MPa',
    youngsModulus: '3.8 GPa (3.800 MPa)',
    hdtTemp: '250 °C (@1.8 MPa)',
    elongation: '15 %',
    density: '1.30 g/cm³',
    features: 'Termoplástico de ultra-altas prestaciones, retardante de llama V0 y sustituto de titanio.'
  }
];

export default function Technologies() {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  const downloadPDF = (mat: MaterialSpec) => {
    setDownloadingId(mat.id);

    // Create realistic PDF-like document content formatted as downloadable engineering datasheet
    const datasheetContent = `%PDF-1.4
1 0 obj << /Title (FICHA TECNICA PROTOGEN3D - ${mat.name}) /Author (ProtoGen3D Ingenieria B2B) /Subject (Hoja de Datos de Material) >> endobj
PROTOGEN3D // HOJA DE DATOS TÉCNICOS DE MATERIAL (DATASHEET)
================================================================================
MATERIAL: ${mat.name.toUpperCase()} (${mat.code})
TECNOLOGÍA DE FABRICACIÓN: ${mat.technology}
NORMATIVAS DE ENSAYO: ASTM D638 / ISO 527 / ISO 75
CENTRO DE FABRICACIÓN: Polígono Industrial Atalaya, Torrijos, Toledo (España)
================================================================================

1. PROPIEDADES MECÁNICAS PRINCIPALES:
--------------------------------------------------------------------------------
• Resistencia a la tracción (Tensile Strength): ${mat.tensileStrength}
• Módulo de elasticidad de Young:              ${mat.youngsModulus}
• Alargamiento a la rotura (Elongation at Break): ${mat.elongation}
• Densidad del material conformado:            ${mat.density}

2. PROPIEDADES TÉRMICAS & RESISTENCIA:
--------------------------------------------------------------------------------
• Temperatura de deflexión térmica (HDT):       ${mat.hdtTemp}
• Inflamabilidad / Comportamiento al fuego:     Autoextinguible / UL94 según especificación
• Conductividad térmica / Expansión lineal:     Verificado en laboratorio CMM

3. RECOMENDACIONES DE DISEÑO (DFM):
--------------------------------------------------------------------------------
• Espesor mínimo de pared recomendado:         0.8 mm a 1.2 mm
• Geometrías permitidas:                       ${mat.features}
• Certificaciones disponibles:                  Certificado de colada 3.1 / Informe dimensional CMM

================================================================================
ProtoGen3D B2B | Soporte de Ingeniería: ingenieria@protogen3d.com
`;

    setTimeout(() => {
      const blob = new Blob([datasheetContent], { type: 'application/pdf;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Ficha_Tecnica_${mat.name.replace(/\s+/g, '_')}_ProtoGen3D.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadingId(null);
      setDownloadSuccessMessage(`Ficha técnica de ${mat.name} descargada correctamente.`);
      setTimeout(() => setDownloadSuccessMessage(null), 3000);
    }, 600);
  };

  return (
    <section id="tecnologias" className="bg-slate-50 relative border-t border-slate-200">
      <div className="section-padding">
        
        {/* Header */}
        <div className="mb-12">
          <span className="tech-mono text-industrial-accent mb-4 block">// ESPECIFICACIONES TÉCNICAS</span>
          <h2 className="heading-lg">Tecnologías y Materiales</h2>
          <p className="text-slate-600 mt-2 max-w-2xl text-sm leading-relaxed">
            Parámetros dimensionales y propiedades mecánicas verificadas según normas ISO y ASTM en nuestro laboratorio de metrología.
          </p>
        </div>

        {/* 1. Process Overview Table */}
        <div className="mb-14">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-industrial-accent" />
            Parque de Maquinaria y Volúmenes de Trabajo
          </h3>
          <div className="overflow-x-auto bg-white border border-slate-200 shadow-xs">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-200 tech-mono text-xs text-slate-700 uppercase tracking-wider">
                  <th className="py-3.5 px-4 bg-slate-100/80">PROCESO / TECNOLOGÍA</th>
                  <th className="py-3.5 px-4 bg-slate-100/80">TOLERANCIA TÍPICA</th>
                  <th className="py-3.5 px-4 bg-slate-100/80">MATERIALES DISPONIBLES</th>
                  <th className="py-3.5 px-4 bg-slate-100/80">VOLUMEN MÁXIMO (XYZ)</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 font-medium">
                {technologies.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 border-l-2 border-transparent hover:border-industrial-accent">{row.tech}</td>
                    <td className="py-3.5 px-4 tech-mono text-industrial-accent font-semibold">{row.tolerance}</td>
                    <td className="py-3.5 px-4 text-sm text-slate-700">{row.materials}</td>
                    <td className="py-3.5 px-4 tech-mono text-sm text-slate-500">{row.maxVolume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. NEW: Compact Materials Table with Mechanical Properties & PDF Download */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 bg-industrial-accent" />
                Propiedades Mecánicas Clave por Material (ISO / ASTM)
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Valores nominales de tracción, rigidez elástica y deflexión térmica
              </p>
            </div>

            {downloadSuccessMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-1.5 flex items-center gap-2 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{downloadSuccessMessage}</span>
              </div>
            )}
          </div>

          <div className="overflow-x-auto bg-white border border-slate-200 shadow-xs">
            <table className="w-full text-left border-collapse min-w-[920px]">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-100/90 text-xs font-mono text-slate-700 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Material de Ingeniería</th>
                  <th className="py-3.5 px-4">Proceso Asociado</th>
                  <th className="py-3.5 px-4 text-industrial-accent">Resistencia a Tracción</th>
                  <th className="py-3.5 px-4">Módulo de Young</th>
                  <th className="py-3.5 px-4">Temperatura HDT</th>
                  <th className="py-3.5 px-4 text-right">Ficha Técnica</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {MATERIALS_DATA.map((mat) => (
                  <tr key={mat.id} className="hover:bg-slate-50/90 transition-colors group">
                    {/* Material Name & Standard Code */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{mat.name}</div>
                      <span className="text-xs font-mono text-slate-500">{mat.code}</span>
                    </td>

                    {/* Associated Process */}
                    <td className="py-4 px-4 text-xs font-medium text-slate-700">
                      {mat.technology}
                    </td>

                    {/* Tensile Strength */}
                    <td className="py-4 px-4">
                      <span className="font-mono font-bold text-slate-900 text-base">{mat.tensileStrength}</span>
                      <span className="block text-[11px] text-slate-500 font-mono">Alarg.: {mat.elongation}</span>
                    </td>

                    {/* Young Modulus */}
                    <td className="py-4 px-4 font-mono text-slate-800 font-medium text-sm">
                      {mat.youngsModulus}
                    </td>

                    {/* HDT Temp */}
                    <td className="py-4 px-4">
                      <span className="font-mono text-slate-900 font-semibold text-sm">{mat.hdtTemp}</span>
                      <span className="block text-[11px] text-slate-500">Deflexión bajo carga</span>
                    </td>

                    {/* PDF Download Button */}
                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => downloadPDF(mat)}
                        disabled={downloadingId === mat.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-industrial-accent text-slate-700 hover:text-white border border-slate-300 hover:border-industrial-accent text-xs font-mono font-medium transition-colors shadow-2xs group-hover:border-slate-400"
                        title={`Descargar ficha técnica de ${mat.name} en PDF`}
                      >
                        {downloadingId === mat.id ? (
                          <>
                            <span className="w-3 h-3 border-2 border-slate-600 border-t-transparent animate-spin rounded-full" />
                            <span>Generando...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5 text-industrial-accent group-hover:text-white transition-colors" />
                            <span>Ficha PDF</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-industrial-accent" />
              Trazabilidad de lote y certificados de calidad EN 10204 3.1 disponibles bajo solicitud formal.
            </span>
            <span>Datos actualizados a normativa 2026</span>
          </div>
        </div>

      </div>
    </section>
  );
}
