import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Minus, 
  Send, 
  RotateCcw, 
  ArrowRight, 
  Cpu, 
  Check, 
  ChevronUp,
  FileCheck2,
  HelpCircle,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: () => void }[];
  technicalSpecs?: { label: string; value: string }[];
}

interface QuickTopic {
  label: string;
  query: string;
  category: string;
}

const QUICK_TOPICS: QuickTopic[] = [
  {
    category: 'Tolerancias',
    label: 'Tolerancias CNC vs Impresión 3D',
    query: '¿Cuáles son las tolerancias estándar en CNC frente a impresión 3D industrial?'
  },
  {
    category: 'Materiales',
    label: 'Material para alta temperatura (>180°C)',
    query: '¿Qué material recomendáis para resistencia térmica superior a 180°C y agentes químicos?'
  },
  {
    category: 'DFM',
    label: 'Espesor mínimo de pared (PA12 / SLA)',
    query: '¿Cuál es el espesor mínimo de pared recomendado para SLS (Nylon PA12) y resinas SLA?'
  },
  {
    category: 'Procesos',
    label: '¿Cuándo elegir SLS sobre Mecanizado CNC?',
    query: '¿En qué casos es más rentable y funcional elegir SLS frente a mecanizado CNC?'
  },
  {
    category: 'Acabados',
    label: 'Rugosidad superficial (Ra)',
    query: '¿Qué rugosidad superficial (Ra) se obtiene tras mecanizado o post-procesado aditivo?'
  }
];

export default function TechChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const initialMessage: Message = {
    id: 'msg-init-1',
    sender: 'assistant',
    text: 'Hola, soy el asistente técnico de ingeniería. ¿Tienes dudas sobre tolerancias, orientaciones de impresión o selección de materiales para tu diseño?',
    timestamp: getCurrentTime(),
    technicalSpecs: [
      { label: 'Especialidad', value: 'DFM & Selección de Materiales' },
      { label: 'Normativas', value: 'ISO 2768-mK / ISO 9001' },
      { label: 'Formatos CAD', value: 'STEP, IGES, STL, X_T, SLDPRT' }
    ]
  };

  const [messages, setMessages] = useState<Message[]>([initialMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  const scrollToQuote = () => {
    const quoteElement = document.getElementById('cotizacion');
    if (quoteElement) {
      quoteElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setHasUnread(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  };

  const handleResetChat = () => {
    setMessages([{
      ...initialMessage,
      timestamp: getCurrentTime()
    }]);
  };

  const generateAnswer = (userQuery: string): Message => {
    const q = userQuery.toLowerCase();
    const time = getCurrentTime();

    // 1. Tolerancias
    if (q.includes('tolerancia') || q.includes('precisión') || q.includes('iso 2768') || q.includes('exactitud')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: 'Nuestras tolerancias dimensionales dependen directamente del proceso y de la geometría de la pieza:\n\n• Mecanizado CNC (3 a 5 ejes): estándar de ±0.01 mm a ±0.05 mm bajo norma ISO 2768-mK. En alojamientos de rodamientos y ajustes H7/g6 garantizamos rectificados específicos.\n• SLS (Sinterizado Láser PA12): ±0.2 mm o ±0.3% de la cota nominal (el valor que sea mayor), con excelente isotropía mecánica.\n• SLA (Estereolitografía Técnica): ±0.1 mm, óptimo para verificaciones de ajuste fino y prototipos estéticos.\n• DMLS (Metal aditivo): ±0.1 mm tras tratamiento térmico de alivio de tensiones y mecanizado de zonas de contacto.',
        timestamp: time,
        technicalSpecs: [
          { label: 'CNC Precisión', value: '±0.01 mm' },
          { label: 'SLS PA12', value: '±0.20 mm' },
          { label: 'SLA Resinas', value: '±0.10 mm' },
          { label: 'DMLS Metal', value: '±0.10 mm' }
        ],
        quickActions: [
          { label: 'Subir archivo para análisis DFM', action: scrollToQuote }
        ]
      };
    }

    // 2. Materiales de alta temperatura / químicos
    if (q.includes('temperatura') || q.includes('calor') || q.includes('peek') || q.includes('ultem') || q.includes('quimic') || q.includes('150') || q.includes('180') || q.includes('200')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: 'Para solicitaciones térmicas elevadas o contacto con agentes químicos disponemos de varias alternativas de grado industrial:\n\n1. PEEK / ULTEM 9085 (FDM Industrial o CNC): Servicio continuo hasta 250°C (PEEK) y 180°C (ULTEM). Certificados FAR 25.853 para aeroespacial y automoción.\n2. Resina SLA Alta Temperatura: Deflexión térmica (HDT) hasta 238°C a 0.45 MPa. Excelente para conductos de aire caliente y ensayos en túnel de viento.\n3. Aluminio 7075-T6 / 6061-T6 (Mecanizado CNC): Resistencia mecánica combinada con disipación térmica activa.\n4. Acero Inox 316L / Inconel 718 (DMLS Metal): Resistencia a corrosión ácida/marina y temperaturas operativas criogénicas y de hasta 700°C.',
        timestamp: time,
        technicalSpecs: [
          { label: 'PEEK HDT', value: '250°C continuo' },
          { label: 'ULTEM 9085', value: '180°C continuo' },
          { label: 'SLA High-Temp', value: '238°C HDT' },
          { label: 'Aluminio 7075', value: '570 MPa Rm' }
        ],
        quickActions: [
          { label: 'Configurar material en la cotización', action: scrollToQuote }
        ]
      };
    }

    // 3. Espesor de pared y DFM
    if (q.includes('espesor') || q.includes('pared') || q.includes('mínimo') || q.includes('dfm') || q.includes('soporte')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: 'Reglas de diseño para espesores mínimos recomendados según tecnología:\n\n• SLS (Nylon PA12): Espesor mínimo de pared estructural de 0.8 mm (óptimo 1.2 mm a 2.0 mm para evitar alabeos térmicos). Agujeros de drenaje de polvo no sinterizado: mínimo Ø 3.5 mm.\n• SLA (Resinas Técnicas): Paredes soportadas de 0.4 mm, autoportantes de 0.8 mm. Detalles finos y textos en relieve: ancho mínimo 0.3 mm.\n• FDM Industrial: Mínimo 1.2 mm (3 perímetros de boquilla para estanqueidad).\n• Mecanizado CNC: Paredes de aluminio recomendadas ≥ 0.8 mm (evita vibraciones durante el fresado); en acero ≥ 0.6 mm. Profundidad de cavidad recomendada < 4× diámetro de fresa.',
        timestamp: time,
        technicalSpecs: [
          { label: 'SLS Pared mín.', value: '0.8 mm (1.2 mm rec.)' },
          { label: 'SLA Pared mín.', value: '0.4 mm' },
          { label: 'CNC Pared mín.', value: '0.8 mm (Aluminio)' },
          { label: 'Orificio drenaje', value: '≥ 3.5 mm' }
        ],
        quickActions: [
          { label: 'Enviar archivo para verificación automática', action: scrollToQuote }
        ]
      };
    }

    // 4. Comparativa SLS vs CNC
    if (q.includes('sls') && (q.includes('cnc') || q.includes('mecanizado') || q.includes('cuándo') || q.includes('elegir') || q.includes('rentable'))) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: 'Criterio de decisión técnico-económico entre SLS y Mecanizado CNC:\n\n• Elige SLS si: la pieza tiene canales internos conformados, destalalonados, geometrías orgánicas o necesitas series de 1 a 200 piezas sin coste inicial de utillajes/fijaciones. No requiere estructuras de soporte y ofrece propiedades mecánicas casi isotrópicas con Nylon PA12.\n• Elige Mecanizado CNC si: requieres tolerancias muy cerradas (< ±0.05 mm), rugosidad superficial brillante (Ra < 0.8 µm), roscas directas de alta fatiga o metales específicos (Aluminio 7075, Acero 316L, Latón, Delrin/POM).',
        timestamp: time,
        technicalSpecs: [
          { label: 'Criterio SLS', value: 'Geometría libre / Series 1-200 uds' },
          { label: 'Criterio CNC', value: 'Tolerancias estrechas / Metal macizo' }
        ],
        quickActions: [
          { label: 'Comparar costes con tu archivo CAD', action: scrollToQuote }
        ]
      };
    }

    // 5. Rugosidad y acabados
    if (q.includes('rugosidad') || q.includes('ra') || q.includes('acabado') || q.includes('pulido') || q.includes('anodizado') || q.includes('shot peening')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: 'Valores de rugosidad superficial alcanzables y tratamientos de post-procesado:\n\n• Mecanizado CNC directo: Ra 1.6 µm a 3.2 µm (estándar). Con pasada de acabado o rectificado: Ra 0.4 µm a 0.8 µm.\n• SLS (Nylon PA12 sin tratar): Ra 8.0 µm a 12.0 µm (tacto arenoso característico). Con granallado de microesferas de vidrio (*shot peening*): Ra ~5 µm. Con alisado químico por vapor (Vapor Smoothing): superficie estanca y brillante Ra < 2.0 µm.\n• SLA Resinas: Ra 0.2 µm a 0.8 µm tras lavado en IPA y curado UV.\n• Tratamientos superficiales disponibles: Anodizado duro tipo III, cincado, niquelado químico, teñido integral negro (para PA12) y pintura electrostática.',
        timestamp: time,
        technicalSpecs: [
          { label: 'CNC Estándar', value: 'Ra 1.6 - 3.2 µm' },
          { label: 'CNC Rectificado', value: 'Ra 0.4 - 0.8 µm' },
          { label: 'SLS Vapor Smoothing', value: 'Ra < 2.0 µm' },
          { label: 'Tratamientos', value: 'Anodizado Tipo II/III, Teñido' }
        ],
        quickActions: [
          { label: 'Solicitar acabado en la cotización', action: scrollToQuote }
        ]
      };
    }

    // 6. Formatos y confidencialidad (STEP, IGES, NDA)
    if (q.includes('formato') || q.includes('step') || q.includes('iges') || q.includes('stl') || q.includes('nda') || q.includes('archivo') || q.includes('subir')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: 'Recomendaciones de formatos de intercambio CAD:\n\n• Para CNC e Ingeniería Inversa: recomendamos archivos sólidos paramétricos .STEP (.stp AP214/AP242) o Parasolid (.x_t). Permiten extraer las cotas nominales exactas de radios y roscas.\n• Para Fabricación Aditiva (3D): archivos .STEP o .STL binario de alta resolución (desviación angular < 10°, desviación superficial < 0.02 mm para evitar faceteado poligonal).\n• Confidencialidad: toda la documentación técnica se procesa bajo protocolo NDA estricto y encriptación de datos.',
        timestamp: time,
        technicalSpecs: [
          { label: 'Formato CNC óptimo', value: 'STEP AP214/242 (.step)' },
          { label: 'Formato 3D óptimo', value: 'STEP o STL Binario fino' },
          { label: 'Protección IP', value: 'NDA firmado automático' }
        ],
        quickActions: [
          { label: 'Ir a zona de carga segura', action: scrollToQuote }
        ]
      };
    }

    // 7. Ubicación y planta física
    if (q.includes('donde') || q.includes('dónde') || q.includes('ubicacion') || q.includes('ubicación') || q.includes('direccion') || q.includes('dirección') || q.includes('planta') || q.includes('toledo') || q.includes('torrijos') || q.includes('fabrica') || q.includes('fábrica') || q.includes('sede')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: 'Nuestra planta central de producción y laboratorio de metrología se encuentra en:\n\n• Dirección: Polígono Industrial Atalaya, Avenida de los Trabajadores 20, Torrijos, Toledo (España).\n• Instalaciones: Más de 2.500 m² de capacidad con centros CNC de 5 ejes, fabricación aditiva industrial (SLS PA12, SLA, DMLS) y control CMM bajo certificación ISO 9001:2015.',
        timestamp: time,
        technicalSpecs: [
          { label: 'Ubicación', value: 'Torrijos (Toledo)' },
          { label: 'Dirección', value: 'P.I. Atalaya, Av. Trabajadores 20' },
          { label: 'Superficie', value: '2.500 m²' }
        ],
        quickActions: [
          { label: 'Ir a cotización con CAD', action: scrollToQuote }
        ]
      };
    }

    // Default engineering response
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `He recibido tu consulta sobre "${userQuery}".\n\nComo pauta general en ProtoGen3D:\n• Verificamos la viabilidad geométrica mediante análisis DFM (Design for Manufacturing) antes de iniciar máquina.\n• Contamos con mecanizado CNC 5 ejes (hasta ±0.01 mm), tecnologías aditivas (SLS PA12, SLA técnica, DMLS metal) y un laboratorio metrológico CMM climatizado.\n\nPara darte una evaluación de tolerancias o coste unitario exacta para esta pieza, te sugiero adjuntar tu modelo CAD en el formulario de cotización.`,
      timestamp: time,
      technicalSpecs: [
        { label: 'Revisión técnica', value: '< 2 horas laborales' },
        { label: 'Informe DFM', value: 'Incluido sin coste' }
      ],
      quickActions: [
        { label: 'Subir modelo CAD para análisis', action: scrollToQuote }
      ]
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: getCurrentTime()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Realistic engineering calculation / typing delay (400ms - 800ms)
    setTimeout(() => {
      const reply = generateAnswer(query);
      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      
      {/* 1. Main Chat Window */}
      {isOpen && (
        <div 
          className={`pointer-events-auto bg-white border border-slate-300 shadow-2xl flex flex-col transition-all duration-200 mb-3 ${
            isMinimized 
              ? 'h-14 w-80' 
              : isExpanded 
                ? 'w-[92vw] sm:w-[540px] h-[82vh] max-h-[780px]' 
                : 'w-[92vw] sm:w-[410px] h-[580px] max-h-[82vh]'
          }`}
          style={{ maxWidth: 'calc(100vw - 32px)' }}
          role="dialog"
          aria-label="Asistente de Ingeniería ProtoGen3D"
        >
          {/* Header */}
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center justify-between select-none">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-8 h-8 bg-white border border-slate-300 flex items-center justify-center text-industrial-accent">
                  <Cpu className="w-4 h-4" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900 truncate">Asistente de I+D</h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-white border border-slate-200 text-industrial-accent">
                    PROTOGEN3D
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  Soporte técnico B2B · En línea
                </p>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1 shrink-0 text-slate-500">
              <button 
                onClick={handleResetChat}
                title="Reiniciar conversación"
                className="p-1.5 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                aria-label="Reiniciar chat"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Tamaño estándar" : "Expandir ventana"}
                className="hidden sm:block p-1.5 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                aria-label="Modificar tamaño"
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Maximizar" : "Minimizar"}
                className="p-1.5 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                aria-label="Minimizar chat"
              >
                {isMinimized ? <ChevronUp className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                title="Cerrar asistente"
                className="p-1.5 hover:text-industrial-accent hover:bg-slate-200 transition-colors"
                aria-label="Cerrar chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body (only if not minimized) */}
          {!isMinimized && (
            <>
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm bg-slate-50/80 font-sans">
                
                {/* System Notice */}
                <div className="text-[11px] text-slate-500 text-center font-mono border-b border-slate-200 pb-2">
                  CONSULTORÍA EN TOLERANCIAS · MATERIALES · DFM
                </div>

                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2 mb-1 px-1 text-[11px] font-mono text-slate-500">
                      <span>{msg.sender === 'assistant' ? 'Asistente I+D' : 'Ingeniero / Cliente'}</span>
                      <span>·</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div 
                      className={`p-3.5 max-w-[90%] text-sm leading-relaxed whitespace-pre-line ${
                        msg.sender === 'user'
                          ? 'bg-industrial-accent text-white rounded-none border border-industrial-accent shadow-xs'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-none shadow-xs'
                      }`}
                    >
                      {msg.text}

                      {/* Technical Specs box if provided */}
                      {msg.technicalSpecs && msg.technicalSpecs.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
                          {msg.technicalSpecs.map((spec, sIdx) => (
                            <div key={sIdx} className="bg-slate-50 p-1.5 border border-slate-200">
                              <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider">{spec.label}</span>
                              <span className="font-mono text-slate-900 text-xs font-semibold">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Quick Action buttons inside message */}
                      {msg.quickActions && msg.quickActions.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-slate-200 flex flex-col gap-1.5">
                          {msg.quickActions.map((qa, aIdx) => (
                            <button
                              key={aIdx}
                              onClick={qa.action}
                              className="text-left text-xs font-mono text-industrial-accent hover:text-slate-900 flex items-center justify-between p-1.5 bg-slate-50 border border-slate-200 hover:border-industrial-accent transition-colors"
                            >
                              <span>{qa.label}</span>
                              <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-2" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing status indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-mono py-1 px-2">
                    <span className="w-1.5 h-1.5 bg-industrial-accent animate-ping rounded-full" />
                    <span>Analizando requerimientos de ingeniería...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Topic Chips (B2B questions) */}
              <div className="p-2.5 bg-white border-t border-slate-200 overflow-x-auto">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-[10px] font-mono text-slate-500 shrink-0 uppercase tracking-wider flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 text-industrial-accent" />
                    Frecuentes:
                  </span>
                  {QUICK_TOPICS.map((topic, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(topic.query)}
                      className="shrink-0 text-[11px] font-mono bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-industrial-accent text-slate-700 hover:text-slate-900 px-2.5 py-1 transition-colors whitespace-nowrap"
                    >
                      {topic.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="p-3 bg-slate-50 border-t border-slate-200">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Consulta técnica (ej. tolerancia CNC, PEEK, espesor)..."
                    className="flex-1 bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-industrial-accent font-sans"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="btn-primary px-3.5 py-2 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-xs"
                    title="Enviar consulta"
                    aria-label="Enviar mensaje"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500 font-mono">
                  <span>ENTER para enviar</span>
                  <button 
                    onClick={scrollToQuote}
                    className="text-slate-600 hover:text-industrial-accent underline transition-colors"
                  >
                    Ir a cotización con CAD
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 2. Floating Launcher Trigger Button */}
      {(!isOpen || isMinimized) && (
        <button
          onClick={handleOpen}
          className="pointer-events-auto group relative flex items-center gap-3 bg-white hover:bg-slate-50 border border-slate-300 hover:border-industrial-accent p-2.5 sm:px-4 sm:py-3 shadow-xl transition-all duration-200"
          aria-label="Abrir Asistente Técnico de I+D"
        >
          {/* Avatar Icon */}
          <div className="relative">
            <div className="w-10 h-10 bg-slate-50 border border-slate-200 flex items-center justify-center text-industrial-accent group-hover:text-industrial-accent-hover transition-colors">
              <Cpu className="w-5 h-5" />
            </div>
            {/* Live Indicator */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-industrial-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-industrial-accent" />
            </span>
          </div>

          {/* Text labels on larger screens */}
          <div className="text-left hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900 tracking-wide">Asistente de I+D</span>
              <span className="text-[9px] font-mono text-emerald-600 font-semibold">· ONLINE</span>
            </div>
            <p className="text-[11px] font-mono text-slate-500 group-hover:text-slate-700 transition-colors">
              Consultas técnicas & DFM
            </p>
          </div>

          {/* Unread message teaser tooltip on initial load */}
          {hasUnread && !isOpen && (
            <div className="absolute bottom-full right-0 mb-3 w-64 p-2.5 bg-white border border-slate-300 text-xs text-slate-700 shadow-xl pointer-events-none hidden md:block">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-industrial-accent mb-1 font-semibold">
                <span>INGENIERÍA PROTOGEN3D</span>
              </div>
              <p className="text-slate-600 leading-snug">
                ¿Dudas sobre tolerancias o materiales? Consulta al asistente técnico.
              </p>
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r border-b border-slate-300 transform rotate-45" />
            </div>
          )}
        </button>
      )}

    </div>
  );
}
