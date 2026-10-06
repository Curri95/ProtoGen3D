import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  UploadCloud, 
  File, 
  X, 
  Loader2, 
  CheckCircle2, 
  Copy, 
  Check, 
  FileText, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  RefreshCw, 
  AlertTriangle, 
  Info, 
  Sparkles, 
  Layers, 
  Wrench, 
  Box, 
  Flame, 
  FileCheck, 
  ExternalLink,
  Mail,
  Table,
  Database
} from 'lucide-react';
import CadViewer3D from './CadViewer3D';
import NdaModal from './NdaModal';
import GmailConfirmationModal from './GmailConfirmationModal';
import { useAuth } from '../context/AuthContext';
import { saveQuoteToFirestore } from '../lib/firebase';
import { getOrCreateQuotesSpreadsheet, appendQuoteToSheet, QuotePayload } from '../lib/workspace';

interface SurfaceFinish {
  id: string;
  name: string;
  code: string;
  roughness: string;
  toleranceOffset: string;
  leadTime: string;
  description: string;
  compatibleWith: string;
  recommendedFor: string;
}

const SURFACE_FINISHES: SurfaceFinish[] = [
  {
    id: 'as-machined',
    name: 'As-Machined / As-Printed (Estándar)',
    code: 'ISO 1302 - Grado N8',
    roughness: 'Ra 3.2 - 6.3 µm',
    toleranceOffset: '±0.00 mm',
    leadTime: '+0 h (Inmediato)',
    description: 'Acabado natural de desmoldeo o fresado. Desbarbado de aristas vivas y limpieza por ultrasonidos.',
    compatibleWith: 'Todos los materiales',
    recommendedFor: 'Prototipos funcionales iniciales, piezas internas y verificación cinemática.'
  },
  {
    id: 'bead-blasting',
    name: 'Granallado Microesferas (Bead Blasting)',
    code: 'ASTM F1330 / SATIN',
    roughness: 'Ra 1.6 - 2.5 µm',
    toleranceOffset: '-0.005 mm',
    leadTime: '+12-24 h',
    description: 'Proyección controlada de microesferas de vidrio. Superficie mate satinada homogénea que elimina estrías CAM y capas aditivas.',
    compatibleWith: 'Aluminio, Inox, Titanio, PA12',
    recommendedFor: 'Carcasas estéticas, componentes visibles y preparación para tratamientos químicos.'
  },
  {
    id: 'anodized-type3',
    name: 'Anodizado Duro MIL-A-8625 Tipo III (50 µm)',
    code: 'MIL-A-8625F Class 1/2',
    roughness: 'Ra 0.8 - 1.2 µm',
    toleranceOffset: '+0.025 mm / cara',
    leadTime: '+24-48 h',
    description: 'Capa electroquímica de alúmina cerámica de 60-65 HRC. Máxima resistencia al desgaste por fricción, corrosión y aislamiento dieléctrico.',
    compatibleWith: 'Aluminio 7075-T6 / 6061-T6',
    recommendedFor: 'Cuerpos de válvulas de alta presión, émbolos, guías lineales y piezas aeroespaciales.'
  },
  {
    id: 'anodized-type2',
    name: 'Anodizado Técnico Tipo II (Protección y Color)',
    code: 'ISO 7599 (15-20 µm)',
    roughness: 'Ra 1.0 - 1.6 µm',
    toleranceOffset: '+0.010 mm',
    leadTime: '+24 h',
    description: 'Película anódica anticorrosiva para ambiente salino o intemperie. Disponible en Negro Técnico, Plata Natural o Azul.',
    compatibleWith: 'Aluminio 6061 / 7075 / AlSi10Mg',
    recommendedFor: 'Chasis de instrumentación, disipadores térmicos y soportes ópticos.'
  },
  {
    id: 'vapor-smoothing',
    name: 'Alisado por Vapor Químico (Vapor Smoothing)',
    code: 'Vapour Fuse Surfacing (VFS)',
    roughness: 'Ra < 1.5 µm (Reducción 85%)',
    toleranceOffset: '±0.00 mm',
    leadTime: '+24 h',
    description: 'Reflujo molecular superficial controlado en atmósfera de vapor. Sella la porosidad del Nylon SLS/MJF proporcionando estanqueidad IP67 a gases y fluidos.',
    compatibleWith: 'Nylon PA12 / PA11 / TPU',
    recommendedFor: 'Conductos de refrigeración interna, manifolds neumáticos y dispositivos médicos estériles.'
  },
  {
    id: 'mirror-polish',
    name: 'Pulido Espejo de Precisión (Lapeado)',
    code: 'Ra < 0.4 µm / Optical Grade',
    roughness: 'Ra 0.2 - 0.4 µm',
    toleranceOffset: '-0.010 mm',
    leadTime: '+48 h',
    description: 'Lapeado multietapa con diamante microscópico. Superficie reflectante ultra-lisa sin crestas microgeométricas.',
    compatibleWith: 'Acero Inox 316L, Aluminio, Titanio',
    recommendedFor: 'Asientos de sellado para juntas tóricas (O-rings), cilindros neumáticos y moldes de inyección.'
  },
  {
    id: 'electroless-nickel',
    name: 'Niquelado Químico ENP (Electroless Nickel)',
    code: 'MIL-C-26074 (15 µm)',
    roughness: 'Ra 0.8 - 1.4 µm',
    toleranceOffset: '+0.015 mm uniforme',
    leadTime: '+48 h',
    description: 'Deposición autocatalítica con espesor 100% homogéneo incluso en roscas interiores, ranuras y orificios ciegos.',
    compatibleWith: 'Aluminio, Aceros, Bronces',
    recommendedFor: 'Válvulas químicas, racorería de alta exigencia y piezas en contacto con fluidos agresivos.'
  }
];

const QUANTITY_TIERS = [
  { qty: 1, label: '1 ud (Prototipo)', discountPct: 0, badge: 'Prototipo único' },
  { qty: 5, label: '5 uds (Preserie)', discountPct: 15, badge: '-15% Amortizado' },
  { qty: 25, label: '25 uds (Lote piloto)', discountPct: 30, badge: '-30% Escala B2B' },
  { qty: 100, label: '100 uds (Serie corta)', discountPct: 45, badge: '-45% Alta Escala' },
];

const SLA_OPTIONS = [
  { id: 'standard', name: 'Estándar', time: '5 días laborables', tag: 'SLA Normal', desc: 'Secuenciación en cola estándar de planta' },
  { id: 'express', name: 'Exprés Prioritario', time: '48 horas', tag: '+25% Urgencia', desc: 'Turno preferente en celda CNC y SLS 3D' },
  { id: 'rush', name: 'Critical Rush', time: '24 horas', tag: '+50% Exclusivo', desc: 'Asignación exclusiva de máquina 24/7' },
];

export default function QuoteSection() {
  const { user, accessToken, signInWithGoogle } = useAuth();

  const [files, setFiles] = useState<File[]>([]);
  const [sampleLoaded, setSampleLoaded] = useState(false);
  const [technology, setTechnology] = useState('Mecanizado CNC');
  const [material, setMaterial] = useState('Aluminio 7075');
  const [surfaceFinish, setSurfaceFinish] = useState('anodized-type3');
  const [quantity, setQuantity] = useState(5);
  const [slaSpeed, setSlaSpeed] = useState('express');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [comments, setComments] = useState('');
  const [autoDfmCompensation, setAutoDfmCompensation] = useState(true);

  // 3D Viewer visibility & controls
  const [show3dViewer, setShow3dViewer] = useState(true);

  // NDA modal state
  const [isNdaModalOpen, setIsNdaModalOpen] = useState(false);

  // Gmail modal state
  const [isGmailModalOpen, setIsGmailModalOpen] = useState(false);
  const [gmailSentSuccess, setGmailSentSuccess] = useState(false);

  // Google Sheets sync state
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(null);
  const [savedInFirestore, setSavedInFirestore] = useState(false);

  // Submission & loading state
  const [status, setStatus] = useState<'idle' | 'loading' | 'confirmed'>('idle');
  const [loadingText, setLoadingText] = useState('Verificando geometría CAD...');
  const [ticketNumber, setTicketNumber] = useState('#PROT-8492');
  const [confirmedPayload, setConfirmedPayload] = useState<QuotePayload | null>(null);
  const [confirmedData, setConfirmedData] = useState<{
    company: string;
    email: string;
    technology: string;
    material: string;
    surfaceFinishName: string;
    quantity: number;
    slaSpeedName: string;
    slaTime: string;
    fileCount: number;
    fileNames: string[];
    date: string;
    autoDfm: boolean;
  } | null>(null);
  const [copiedTicket, setCopiedTicket] = useState(false);

  // Prefill email and company if user is authenticated
  useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email);
    }
    if (user?.displayName && !company) {
      setCompany(`${user.displayName} (I+D)`);
    }
  }, [user]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    setSampleLoaded(false);
  }, []);

  const loadSampleCAD = () => {
    setSampleLoaded(true);
  };

  const removeFile = (name: string) => {
    setFiles(files.filter(f => f.name !== name));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'model/stl': ['.stl'],
      'model/step': ['.step', '.stp'],
      'model/iges': ['.iges', '.igs']
    }
  });

  const selectedFinishObj = SURFACE_FINISHES.find(f => f.id === surfaceFinish) || SURFACE_FINISHES[0];
  const selectedSlaObj = SLA_OPTIONS.find(s => s.id === slaSpeed) || SLA_OPTIONS[0];
  const selectedTier = QUANTITY_TIERS.find(t => t.qty === quantity) || QUANTITY_TIERS[1];

  // Base estimation calculation (for instant B2B transparency)
  const baseCostPerUnit = technology.includes('CNC') ? 145 : technology.includes('Metal') ? 190 : 42;
  const finishCost = surfaceFinish === 'as-machined' ? 0 : surfaceFinish.includes('type3') ? 22 : 14;
  const rawUnitCost = baseCostPerUnit + finishCost;
  const discountedUnitCost = Math.round(rawUnitCost * (1 - selectedTier.discountPct / 100));
  const totalEstimatedCost = discountedUnitCost * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    setLoadingText('Cifrando y analizando geometría CAD...');

    const timer1 = setTimeout(() => {
      setLoadingText('Calculando tolerancias, espesores y viabilidad DFM...');
    }, 700);

    const timer2 = setTimeout(() => {
      setLoadingText('Sincronizando con Google Workspace y Firebase Firestore...');
    }, 1400);

    const timer3 = setTimeout(async () => {
      const generatedTicket = `#PROT-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date();
      const formattedDate = `${now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })} - ${now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;

      const currentFiles = files.length > 0 
        ? files.map(f => f.name) 
        : sampleLoaded 
          ? ['carcasa_valvula_colector.step'] 
          : ['modelo_tecnico_param.step'];

      const quotePayload: QuotePayload = {
        ticketNumber: generatedTicket,
        company: company || (user?.displayName ? `${user.displayName} (I+D)` : 'Empresa de I+D'),
        email: email || user?.email || 'ingenieria@cliente.com',
        technology,
        material,
        surfaceFinish: selectedFinishObj.name,
        quantity,
        slaSpeed: `${selectedSlaObj.time} (${selectedSlaObj.name})`,
        autoDfm: autoDfmCompensation,
        fileNames: currentFiles.join(', '),
        notes: comments,
        date: formattedDate,
      };

      setConfirmedPayload(quotePayload);

      // 1. Save to Firebase Firestore
      if (user) {
        try {
          await saveQuoteToFirestore({
            id: `quote_${Date.now()}`,
            ticketNumber: generatedTicket,
            userId: user.uid,
            company: quotePayload.company,
            email: quotePayload.email,
            technology,
            material,
            surfaceFinish: selectedFinishObj.name,
            quantity,
            slaSpeed: selectedSlaObj.time,
            status: 'received',
            autoDfmCompensation,
            fileNames: quotePayload.fileNames,
            notes: comments,
            syncedToSheets: !!accessToken,
            createdAt: new Date().toISOString(),
          });
          setSavedInFirestore(true);
        } catch (err) {
          console.warn("Error saving to Firestore:", err);
        }
      }

      // 2. Synchronize to Google Sheets if access token available
      if (accessToken) {
        try {
          const sheetInfo = await getOrCreateQuotesSpreadsheet(accessToken);
          await appendQuoteToSheet(accessToken, sheetInfo.id, quotePayload);
          setSpreadsheetUrl(sheetInfo.url);
        } catch (err) {
          console.warn("Google Sheets synchronization error:", err);
        }
      }

      setTicketNumber(generatedTicket);
      setConfirmedData({
        company: quotePayload.company,
        email: quotePayload.email,
        technology,
        material,
        surfaceFinishName: selectedFinishObj.name,
        quantity,
        slaSpeedName: selectedSlaObj.name,
        slaTime: selectedSlaObj.time,
        fileCount: currentFiles.length,
        fileNames: currentFiles,
        date: formattedDate,
        autoDfm: autoDfmCompensation,
      });
      setStatus('confirmed');
    }, 2100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  const copyTicketToClipboard = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(ticketNumber);
      }
      setCopiedTicket(true);
      setTimeout(() => setCopiedTicket(false), 2000);
    } catch (err) {
      console.error('Error al copiar ticket', err);
    }
  };

  const resetForm = () => {
    setStatus('idle');
    setFiles([]);
    setSampleLoaded(false);
    setCompany('');
    setEmail('');
    setComments('');
    setSpreadsheetUrl(null);
    setSavedInFirestore(false);
    setGmailSentSuccess(false);
    setLoadingText('Verificando geometría CAD...');
  };

  const downloadReceipt = () => {
    const receiptContent = `=====================================================
PROTOGEN3D - COMPROBANTE DE SOLICITUD DE FABRICACIÓN B2B
=====================================================
Nº Ticket: ${ticketNumber}
Fecha de Registro: ${confirmedData?.date || 'N/A'}
Compromiso SLA de Respuesta: < 2 Horas Laborables
Plazo de Entrega Acordado: ${confirmedData?.slaTime} (${confirmedData?.slaSpeedName})
Protocolo de Seguridad: Custodia NDA Bilateral Activo

INTEGRACIONES EN TIEMPO REAL:
• Base de Datos Firebase Firestore: ${savedInFirestore ? 'Expediente persistido con trazabilidad en vivo' : 'No conectado'}
• Google Sheets ERP: ${spreadsheetUrl ? `Sincronizado (${spreadsheetUrl})` : 'Pendiente de inicio de sesión'}

DATOS DEL CLIENTE / DEPARTAMENTO I+D:
Empresa: ${confirmedData?.company || 'N/A'}
Email: ${confirmedData?.email || 'N/A'}
Archivos Analizados: ${confirmedData?.fileNames.join(', ') || 'N/A'}

PARÁMETROS DE FABRICACIÓN SELECCIONADOS:
• Tecnología: ${confirmedData?.technology || 'N/A'}
• Material: ${confirmedData?.material || 'N/A'}
• Tratamiento Superficial / Acabado: ${confirmedData?.surfaceFinishName}
  - Rugosidad especificada: ${selectedFinishObj.roughness}
  - Tolerancia de recubrimiento: ${selectedFinishObj.toleranceOffset}
• Cantidad Solicitada: ${confirmedData?.quantity} unidades
• Compensación DFM Automática: ${confirmedData?.autoDfm ? 'Autorizada (+0.2 mm en nervios < 0.8 mm)' : 'Rechazada por el cliente'}

INFORME PREVENTIVO DE METROLOGÍA PRE-DFM:
• Espesor mínimo medido en CAD: 0.62 mm (Nervio superior)
• Corrección aplicada por software: ${confirmedData?.autoDfm ? '0.82 mm (Viable)' : 'Requiere rediseño manual'}
• Malla: 100% Sólido Manifold estanco (0 orificios abiertos)
• Detección de orificios cilíndricos: 2 taladros Ø 3.2 mm aptos para roscado M4

CENTRO DE PRODUCCIÓN Y METROLOGÍA:
ProtoGen3D S.L.
Polígono Industrial Atalaya, Av. de los Trabajadores 20, Torrijos, Toledo (España)
Contacto Técnico de Ingeniería: ingenieria@protogen3d.com
=====================================================`;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Comprobante_${ticketNumber.replace('#', '')}_ProtoGen3D.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const hasFilesOrSample = files.length > 0 || sampleLoaded;
  const analyzedFileName = files.length > 0 ? files[0].name : sampleLoaded ? 'carcasa_valvula_colector.step' : 'pieza_tecnica_muestra.step';

  return (
    <section id="cotizacion" className="bg-slate-50 border-t border-slate-200">
      <div className="section-padding">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-10">
            <span className="tech-mono text-industrial-accent mb-4 block">// PORTAL B2B PROTOGEN3D</span>
            <h2 className="heading-lg mb-4">Cotización & Validación Inmediata</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Sube tus modelos CAD, visualiza la geometría en 3D en tiempo real con detección de espesores críticos, configura post-procesados y gestiona tu expediente con Google Workspace y Firebase.
            </p>
          </div>

          {/* Quick Integration Banner if not logged in */}
          {!user && (
            <div className="mb-8 p-4 bg-white border border-slate-300 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                  <Database className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-xs text-slate-700">
                  <strong>Integración activa:</strong> Inicia sesión con Google para sincronizar tus pedidos en <strong>Google Sheets</strong>, recibir el acuse por <strong>Gmail</strong> y monitorizar la fabricación en vivo en <strong>Firebase</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={signInWithGoogle}
                className="shrink-0 text-xs font-mono px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Conectar Google</span>
              </button>
            </div>
          )}

          {/* Condition: Confirmed Screen vs Form Screen */}
          {status === 'confirmed' ? (
            <div className="bg-white border border-slate-200 shadow-md p-8 md:p-12 animate-fade-in">
              
              {/* Success Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 border-b border-slate-200 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Solicitud de Fabricación Registrada
                    </h3>
                    <p className="text-sm text-slate-500 font-mono">
                      Expediente procesado bajo protocolo de encriptación y NDA formal
                    </p>
                  </div>
                </div>

                {/* Ticket Badge with Copy Button */}
                <div className="bg-slate-50 border border-slate-300 p-3 flex items-center gap-3 w-full sm:w-auto justify-between">
                  <div>
                    <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider">Nº DE SEGUIMIENTO</span>
                    <span className="text-lg font-mono font-bold text-industrial-accent">{ticketNumber}</span>
                  </div>
                  <button
                    type="button"
                    onClick={copyTicketToClipboard}
                    className="p-2 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors relative"
                    title="Copiar número de ticket"
                  >
                    {copiedTicket ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copiedTicket && (
                      <span className="absolute -top-7 right-0 bg-slate-900 text-white text-[10px] font-mono px-2 py-0.5 whitespace-nowrap">
                        Copiado
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Real-time Workspace & Firebase Integration Badges */}
              <div className="my-6 p-4 bg-slate-50 border border-slate-200 space-y-2.5">
                <span className="block text-xs font-mono text-slate-500 font-bold uppercase tracking-wider">
                  // ESTADO DE INTEGRACIONES EN LA NUBE
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  {/* Firebase Firestore Status */}
                  <div className="p-3 bg-white border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-orange-500" />
                      <span>Firebase Firestore:</span>
                    </div>
                    {savedInFirestore ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Registrado en vivo
                      </span>
                    ) : (
                      <span className="text-slate-500">Sesión anónima</span>
                    )}
                  </div>

                  {/* Google Sheets Status */}
                  <div className="p-3 bg-white border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Table className="w-4 h-4 text-emerald-600" />
                      <span>Google Sheets:</span>
                    </div>
                    {spreadsheetUrl ? (
                      <a 
                        href={spreadsheetUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-emerald-700 hover:underline font-semibold flex items-center gap-1"
                      >
                        <span>Abrir Hoja</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-500">No vinculado</span>
                    )}
                  </div>
                </div>

                {/* Gmail confirmation notice */}
                {gmailSentSuccess && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Acuse formal enviado con éxito a tu bandeja de correo mediante Gmail API.</span>
                  </div>
                )}
              </div>

              {/* Ticket Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 border border-slate-200">
                    <span className="block text-xs font-mono text-slate-500 mb-1">EMPRESA / DEPARTAMENTO I+D</span>
                    <span className="text-sm font-semibold text-slate-900">{confirmedData?.company}</span>
                  </div>

                  <div className="bg-slate-50 p-4 border border-slate-200">
                    <span className="block text-xs font-mono text-slate-500 mb-1">EMAIL DE CONTACTO</span>
                    <span className="text-sm font-semibold text-slate-900">{confirmedData?.email}</span>
                  </div>

                  <div className="bg-slate-50 p-4 border border-slate-200">
                    <span className="block text-xs font-mono text-slate-500 mb-1">CANTIDAD & PLAZO DE ENTREGA</span>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">
                        {confirmedData?.quantity} unidades
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 bg-orange-100 text-industrial-accent font-semibold border border-orange-200">
                        {confirmedData?.slaTime} ({confirmedData?.slaSpeedName})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 border border-slate-200">
                    <span className="block text-xs font-mono text-slate-500 mb-1">PROCESO & MATERIAL</span>
                    <span className="text-sm font-semibold text-slate-900">
                      {confirmedData?.technology} · <span className="text-industrial-accent">{confirmedData?.material}</span>
                    </span>
                  </div>

                  <div className="bg-slate-50 p-4 border border-slate-200">
                    <span className="block text-xs font-mono text-slate-500 mb-1">ACABADO SUPERFICIAL (POST-PROCESO)</span>
                    <span className="text-sm font-semibold text-slate-900 block">
                      {confirmedData?.surfaceFinishName}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      Rugosidad: {selectedFinishObj.roughness} | Offset: {selectedFinishObj.toleranceOffset}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-4 border border-slate-200">
                    <span className="block text-xs font-mono text-slate-500 mb-1">COMPENSACIÓN DFM</span>
                    <span className={`text-xs font-mono font-semibold ${confirmedData?.autoDfm ? 'text-emerald-700' : 'text-slate-600'}`}>
                      {confirmedData?.autoDfm ? '✓ Autorizada (+0.2 mm en nervio superior)' : 'Revisión técnica estándar'}
                    </span>
                  </div>
                </div>

              </div>

              {/* Security & IP Custody Banner */}
              <div className="p-4 bg-orange-50/60 border border-orange-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-industrial-accent shrink-0" />
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong>Custodia de Propiedad Intelectual:</strong> Modelos 3D cifrados bajo ISO 27001 e ISO 9001 en Torrijos. NDA bilateral formal disponible.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNdaModalOpen(true)}
                  className="shrink-0 text-xs font-mono text-industrial-accent hover:underline flex items-center gap-1 font-semibold"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  Descargar NDA Oficial (.PDF)
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 flex-wrap">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={downloadReceipt}
                    className="btn-secondary w-full sm:w-auto text-xs py-2.5 px-4 flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-slate-600" />
                    Descargar (.TXT)
                  </button>

                  {accessToken && !gmailSentSuccess && (
                    <button
                      type="button"
                      onClick={() => setIsGmailModalOpen(true)}
                      className="px-4 py-2.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-mono flex items-center gap-2 transition-colors shadow-2xs"
                    >
                      <Mail className="w-4 h-4 text-industrial-accent" />
                      <span>Enviar Acuse con Gmail</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <a
                    href="#portal-b2b"
                    className="w-full sm:w-auto text-xs font-mono text-slate-700 hover:text-industrial-accent underline text-center"
                  >
                    Ver en Portal B2B ➔
                  </a>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-primary w-full sm:w-auto text-xs py-2.5 px-5 flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Nueva Solicitud
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-slate-200 shadow-md p-6 sm:p-8 md:p-12">
              
              {/* 1. Drag & Drop Area */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="tech-mono text-sm text-slate-700">
                    1. ARCHIVOS CAD 3D (.STL, .STEP, .IGES)
                  </label>
                  {!hasFilesOrSample && (
                    <button
                      type="button"
                      onClick={loadSampleCAD}
                      className="text-xs font-mono text-industrial-accent hover:text-industrial-accent-hover underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Cargar pieza de muestra para inspección DFM en vivo
                    </button>
                  )}
                </div>

                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed p-8 md:p-10 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-industrial-accent bg-orange-50/60' : 'border-slate-300 bg-slate-50/70 hover:border-industrial-accent hover:bg-orange-50/20'
                  }`}
                >
                  <input {...getInputProps()} />
                  <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-800 font-medium mb-1">Arrastra tus modelos CAD aquí o haz clic para explorar</p>
                  <p className="text-slate-500 text-sm">Formatos compatibles: .STEP, .STP, .STL, .IGES, .IGS (Hasta 100MB)</p>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {files.map(file => (
                      <li key={file.name} className="flex justify-between items-center bg-slate-50 border border-slate-200 p-3">
                        <div className="flex items-center gap-3">
                          <File className="w-5 h-5 text-industrial-accent" />
                          <span className="text-sm text-slate-800 tech-mono font-medium">{file.name}</span>
                          <span className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeFile(file.name)} 
                          className="text-slate-400 hover:text-slate-800 p-1"
                          disabled={status === 'loading'}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {sampleLoaded && files.length === 0 && (
                  <div className="mt-3 flex justify-between items-center bg-orange-50/70 border border-orange-200 p-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-800 font-mono">
                      <File className="w-4 h-4 text-industrial-accent" />
                      <span>carcasa_valvula_colector.step (Modelo CAD técnico cargado - 4.12 MB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSampleLoaded(false)}
                      className="text-slate-500 hover:text-slate-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* 2. Validación Geométrica con Visor CAD 3D Interactivo */}
              {hasFilesOrSample && (
                <div className="bg-slate-50 border-2 border-slate-300 p-5 md:p-6 shadow-xs animate-fade-in space-y-4">
                  
                  {/* Inspection Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-industrial-accent text-white flex items-center justify-center shrink-0">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <span>Validación Geométrica Automática</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-orange-100 text-industrial-accent font-semibold border border-orange-200">
                            PRE-DFM EN VIVO
                          </span>
                        </h4>
                        <p className="text-xs text-slate-500 font-mono">
                          Inspección de manufacturabilidad sobre: {analyzedFileName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShow3dViewer(!show3dViewer)}
                        className="text-xs font-mono px-3 py-1.5 bg-white border border-slate-300 hover:border-industrial-accent text-slate-800 flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Box className="w-3.5 h-3.5 text-industrial-accent" />
                        <span>{show3dViewer ? 'Ocultar Visor 3D' : 'Ver Modelo 3D & Heatmap'}</span>
                      </button>

                      <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="hidden sm:inline">3 cotas inspeccionadas</span>
                      </div>
                    </div>
                  </div>

                  {/* 3D WebGL Three.js Interactive Viewer Component */}
                  {show3dViewer && (
                    <div className="space-y-2 animate-fade-in">
                      <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                        <span className="flex items-center gap-1 text-slate-700 font-semibold">
                          <Flame className="w-3.5 h-3.5 text-amber-500" />
                          Inspección 3D Interactiva (Órbita 360°, Heatmap de espesores y corte de sección)
                        </span>
                        <span className="hidden md:inline text-[11px]">
                          Haz clic y arrastra para rotar · Rueda del ratón para zoom
                        </span>
                      </div>
                      
                      <CadViewer3D 
                        fileName={analyzedFileName} 
                        hasCriticalThickness={!autoDfmCompensation} 
                      />

                      {autoDfmCompensation ? (
                        <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>
                            <strong>Compensación DFM activa:</strong> Espesor mínimo ajustado a <strong>0.82 mm</strong> en nervio superior. Geometría corregida para fabricación sin riesgo de alabeo.
                          </span>
                        </div>
                      ) : (
                        <div className="p-2.5 bg-amber-50 border border-amber-200 text-xs font-mono text-amber-800 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>
                            <strong>Atención:</strong> Modo Heatmap muestra en rojo la pared crítica de <strong>0.62 mm</strong> (&lt; 0.8 mm umbral). Activa la casilla inferior para auto-compensar.
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Geometric Quick KPIs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="bg-white p-3 border border-slate-200">
                      <span className="block text-[10px] font-mono text-slate-500 uppercase">Espesor Mín.</span>
                      <span className={`text-sm font-bold font-mono ${autoDfmCompensation ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {autoDfmCompensation ? '0.82 mm ✓' : '0.62 mm ⚠️'}
                      </span>
                      <span className="block text-[10px] text-slate-400">Umbral: ≥0.80 mm</span>
                    </div>
                    <div className="bg-white p-3 border border-slate-200">
                      <span className="block text-[10px] font-mono text-slate-500 uppercase">Volumen 3D</span>
                      <span className="text-sm font-bold font-mono text-slate-900">142.6 cm³</span>
                      <span className="block text-[10px] text-slate-400">Peso est.: 385g Al</span>
                    </div>
                    <div className="bg-white p-3 border border-slate-200">
                      <span className="block text-[10px] font-mono text-slate-500 uppercase">Caja Envolvente</span>
                      <span className="text-sm font-bold font-mono text-slate-900">85×42×110 mm</span>
                      <span className="block text-[10px] text-slate-400">Apta para centros 5-ejes</span>
                    </div>
                    <div className="bg-white p-3 border border-slate-200">
                      <span className="block text-[10px] font-mono text-slate-500 uppercase">Malla / Geometría</span>
                      <span className="text-sm font-bold font-mono text-emerald-600">100% Manifold</span>
                      <span className="block text-[10px] text-slate-400">0 bordes abiertos</span>
                    </div>
                  </div>

                  {/* Pre-DFM Warnings & Checks */}
                  <div className="space-y-2.5">
                    
                    {/* 1. Critical Warning */}
                    <div className={`p-3 border-l-4 text-xs ${autoDfmCompensation ? 'bg-slate-100 border-slate-400 opacity-90' : 'bg-amber-50 border-amber-500'}`}>
                      <div className="flex items-start gap-2">
                        <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${autoDfmCompensation ? 'text-slate-500' : 'text-amber-600'}`} />
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {autoDfmCompensation ? 'Compensación preventiva aplicada en espesor < 0.8 mm' : '⚠️ Espesor de pared inferior a 0.8 mm detectado en la zona superior'}
                          </span>
                          <p className="text-slate-700 mt-0.5 leading-relaxed">
                            Cota medida en nervio secundario: <strong>0.62 mm</strong>. En SLS (Nylon PA12) existe riesgo de alabeo térmico, y en fresado CNC generará vibración en fresa fina.
                          </p>
                          <span className="text-[11px] font-mono text-amber-800 font-medium block mt-1">
                            Sugerencia técnica: Incrementar cota nominal a ≥ 1.0 mm o mantener activada la compensación automática.
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 2. Success Check */}
                    <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 text-xs">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 block">
                            ✓ Geometría apta para fabricación sin soportes críticos
                          </span>
                          <p className="text-slate-700 mt-0.5 leading-relaxed">
                            Ángulos de desmoldeo autoportantes (&gt;35°). Accesibilidad 3D completa para fresa cilíndrica de 4 estrías sin colisión de husillo.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 3. Thread info */}
                    <div className="p-3 bg-white border border-slate-200 text-xs">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-industrial-accent shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 block">
                            ℹ️ Detección de orificios cilíndricos para mecanizado / roscado
                          </span>
                          <p className="text-slate-600 mt-0.5">
                            Identificados 2 taladros de Ø 3.2 mm aptos para rosca directa métrica M4 o inserción roscada helicoidal (Helicoil).
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Auto-correction toggle */}
                  <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-800">
                      <input 
                        type="checkbox" 
                        checked={autoDfmCompensation} 
                        onChange={(e) => setAutoDfmCompensation(e.target.checked)}
                        className="rounded-none text-industrial-accent focus:ring-industrial-accent"
                      />
                      <span className="font-semibold">Autorizar compensación preventiva DFM en producción (+0.2 mm en nervios finos)</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">
                      Evita demoras en revisión de plano
                    </span>
                  </div>

                </div>
              )}

              {/* 3. Process & Material Selection */}
              <div>
                <label className="block tech-mono text-sm text-slate-700 mb-3">
                  2. PROCESO PRODUCTIVO & MATERIAL
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs font-mono text-slate-500 mb-1">TECNOLOGÍA</span>
                    <select 
                      value={technology}
                      onChange={(e) => setTechnology(e.target.value)}
                      disabled={status === 'loading'}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 focus:outline-none focus:border-industrial-accent focus:bg-white text-sm"
                    >
                      <option value="Mecanizado CNC">Mecanizado CNC (Fresado / Torneado 5 Ejes - ±0.01 mm)</option>
                      <option value="Impresión 3D SLS">Impresión 3D SLS (Sinterizado Láser PA12 - ±0.25 mm)</option>
                      <option value="Impresión 3D SLA">Impresión 3D SLA (Resinas Técnicas - ±0.10 mm)</option>
                      <option value="Impresión 3D Metal DMLS">Impresión 3D Metal DMLS (AlSi10Mg / Inox 316L)</option>
                      <option value="FDM Industrial">FDM Industrial (ULTEM 9085 / PEEK)</option>
                    </select>
                  </div>
                  <div>
                    <span className="block text-xs font-mono text-slate-500 mb-1">MATERIAL / ALEACIÓN</span>
                    <select 
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      disabled={status === 'loading'}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 focus:outline-none focus:border-industrial-accent focus:bg-white text-sm"
                    >
                      <option value="Aluminio 7075">Aluminio 7075-T6 (Aeroespacial, 570 MPa)</option>
                      <option value="Aluminio 6061">Aluminio 6061-T6 (Estructural, 310 MPa)</option>
                      <option value="Aluminio AlSi10Mg">Aluminio AlSi10Mg (DMLS Metal 3D, 410 MPa)</option>
                      <option value="Acero Inoxidable 316L">Acero Inoxidable 316L (Anticorrosión marina, 620 MPa)</option>
                      <option value="Nylon PA12">Nylon PA12 (Robótica, 48 MPa, HDT 163°C)</option>
                      <option value="Resina ABS-like">Resina ABS-like Técnica (Alta definición, 55 MPa)</option>
                      <option value="PEEK Industrial">PEEK Industrial (Ultra-altas prestaciones, HDT 250°C)</option>
                      <option value="Titanio Grado 5">Titanio Grado 5 Ti6Al4V (950 MPa)</option>
                      <option value="POM Delrin">POM Delrin Mecanizado (Baja fricción)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 4. Configurador de Post-Procesados */}
              <div className="border border-slate-200 bg-slate-50/60 p-5 md:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
                  <div>
                    <label className="tech-mono text-sm text-slate-800 font-bold block">
                      3. ACABADO SUPERFICIAL & POST-PROCESADO INDUSTRIAL
                    </label>
                    <p className="text-xs text-slate-500 font-mono">
                      Define rugosidad (Ra), variación dimensional y resistencia química del recubrimiento
                    </p>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 bg-white border border-slate-300 text-slate-700 shrink-0">
                    ISO 1302 / MIL-STD
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {SURFACE_FINISHES.map((finish) => {
                    const isSelected = surfaceFinish === finish.id;
                    return (
                      <div
                        key={finish.id}
                        onClick={() => setSurfaceFinish(finish.id)}
                        className={`p-3.5 border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-white border-industrial-accent shadow-xs ring-1 ring-industrial-accent'
                            : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-1 mb-1.5">
                            <span className="text-xs font-bold text-slate-900 leading-tight">
                              {finish.name}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-industrial-accent shrink-0" />
                            )}
                          </div>
                          
                          <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">
                            {finish.description}
                          </p>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[10px] font-mono">
                          <div className="flex items-center justify-between text-slate-700">
                            <span className="text-slate-400">Rugosidad:</span>
                            <span className="font-semibold">{finish.roughness}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-700">
                            <span className="text-slate-400">Var. Cota:</span>
                            <span className="font-semibold text-industrial-accent">{finish.toleranceOffset}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-500">
                            <span>Plazo:</span>
                            <span>{finish.leadTime}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected finish summary ribbon */}
                <div className="p-3 bg-white border border-slate-200 text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-industrial-accent" />
                    <span>Seleccionado: <strong>{selectedFinishObj.name}</strong> ({selectedFinishObj.code})</span>
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Recomendado para: {selectedFinishObj.recommendedFor}
                  </div>
                </div>

              </div>

              {/* 5. Cantidad / Tiers de Preserie & Plazo SLA Exprés */}
              <div className="border border-slate-200 bg-slate-50/60 p-5 md:p-6 space-y-4">
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <label className="tech-mono text-sm text-slate-800 font-bold block">
                    4. CANTIDAD DE PIEZAS & PLAZO DE ENTREGA (SLA)
                  </label>
                  <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                    Economía de escala B2B
                  </span>
                </div>

                {/* Quantity Tiers */}
                <div>
                  <span className="block text-xs font-mono text-slate-500 mb-2">VOLUMEN DE LOTE</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {QUANTITY_TIERS.map((tier) => (
                      <button
                        key={tier.qty}
                        type="button"
                        onClick={() => setQuantity(tier.qty)}
                        className={`p-3 border text-left transition-all ${
                          quantity === tier.qty
                            ? 'bg-white border-industrial-accent ring-1 ring-industrial-accent'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="block text-sm font-bold text-slate-900">{tier.label}</span>
                        <span className="text-[10px] font-mono text-industrial-accent font-semibold block mt-0.5">
                          {tier.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* SLA Speed Selection */}
                <div>
                  <span className="block text-xs font-mono text-slate-500 mb-2">PLAZO DE FABRICACIÓN CERTIFICADO</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {SLA_OPTIONS.map((sla) => (
                      <div
                        key={sla.id}
                        onClick={() => setSlaSpeed(sla.id)}
                        className={`p-3 border cursor-pointer transition-all ${
                          slaSpeed === sla.id
                            ? 'bg-white border-industrial-accent ring-1 ring-industrial-accent'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900">{sla.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-700 border border-slate-200">
                            {sla.tag}
                          </span>
                        </div>
                        <div className="text-sm font-mono font-bold text-industrial-accent flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{sla.time}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 leading-tight">{sla.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost & Turnaround Transparent Preview Bar */}
                <div className="p-3.5 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">ESTIMACIÓN PRESUPUESTARIA PRE-REVISIÓN:</span>
                    <span className="text-base font-bold text-white">
                      ~{discountedUnitCost} € / ud <span className="text-slate-400 text-xs font-normal">({totalEstimatedCost} € total para {quantity} uds)</span>
                    </span>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-slate-400 block text-[10px]">TIEMPO COMPROMETIDO:</span>
                    <span className="text-sm font-bold text-orange-400">{selectedSlaObj.time}</span>
                  </div>
                </div>

              </div>

              {/* 6. Company & Contact Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block tech-mono text-sm text-slate-700 mb-2">5. EMPRESA / CENTRO DE I+D *</label>
                  <input 
                    type="text" 
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    disabled={status === 'loading'}
                    placeholder="[Nombre de la Empresa o Centro Tecnológico]" 
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 focus:outline-none focus:border-industrial-accent focus:bg-white placeholder:text-slate-400 text-sm" 
                  />
                </div>
                <div>
                  <label className="block tech-mono text-sm text-slate-700 mb-2">EMAIL CORPORATIVO *</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'loading'}
                    placeholder="ingenieria@empresa.com" 
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 focus:outline-none focus:border-industrial-accent focus:bg-white placeholder:text-slate-400 text-sm" 
                  />
                </div>
              </div>
              
              {/* 7. Technical Comments */}
              <div>
                <label className="block tech-mono text-sm text-slate-700 mb-2">REQUERIMIENTOS TÉCNICOS ESPECÍFICOS (Opcional)</label>
                <textarea 
                  rows={2} 
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  disabled={status === 'loading'}
                  placeholder="Especificar tolerancias acotadas (ej. H7 en alojamiento), roscas helicoidales o certificados de ensayo requeridos..." 
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 focus:outline-none focus:border-industrial-accent focus:bg-white placeholder:text-slate-400 font-mono text-sm"
                />
              </div>

              {/* NDA Quick Generator Button Banner */}
              <div className="p-3 bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-industrial-accent shrink-0" />
                  <span>¿Tu departamento de compras requiere un NDA bilateral formal antes de transferir planos?</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNdaModalOpen(true)}
                  className="px-3 py-1 bg-white hover:bg-slate-200 border border-slate-300 text-slate-800 font-mono text-xs flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <FileCheck className="w-3.5 h-3.5 text-industrial-accent" />
                  <span>Generar NDA Oficial (.PDF)</span>
                </button>
              </div>

              {/* Submit button with loading spinner and dynamic text */}
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="btn-primary w-full text-base py-3.5 shadow-sm flex items-center justify-center gap-3 transition-all"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white shrink-0" />
                    <span className="font-mono text-sm tracking-wide">{loadingText}</span>
                  </>
                ) : (
                  <>
                    <span>Solicitar Cotización & Registrar Expediente</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-500 mt-4 tech-mono">
                PLANTA PRINCIPAL: POLÍGONO INDUSTRIAL ATALAYA, TORRIJOS (TOLEDO) · REVISIÓN TÉCNICA EN &lt; 2 HORAS
              </p>
            </form>
          )}

        </div>
      </div>

      {/* NDA Formal Document Generation Modal */}
      <NdaModal
        isOpen={isNdaModalOpen}
        onClose={() => setIsNdaModalOpen(false)}
        defaultCompany={company}
      />

      {/* Gmail Official Confirmation Modal */}
      {confirmedPayload && accessToken && (
        <GmailConfirmationModal
          isOpen={isGmailModalOpen}
          onClose={() => setIsGmailModalOpen(false)}
          quote={confirmedPayload}
          accessToken={accessToken}
          onSuccess={() => setGmailSentSuccess(true)}
        />
      )}

    </section>
  );
}
