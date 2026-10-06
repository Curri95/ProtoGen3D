import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  Layers, 
  Clock, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StoredQuote, subscribeToUserQuotes } from '../lib/firebase';

const STATUS_LABELS: Record<string, { label: string; color: string; step: number }> = {
  received: { label: 'Expediente Registrado', color: 'bg-slate-100 text-slate-700 border-slate-300', step: 1 },
  dfm_review: { label: 'En Revisión DFM (Metrología)', color: 'bg-amber-100 text-amber-800 border-amber-300', step: 2 },
  in_production: { label: 'En Producción (Centro CNC/3D)', color: 'bg-blue-100 text-blue-800 border-blue-300', step: 3 },
  qc_cmm: { label: 'Control Dimensional CMM', color: 'bg-purple-100 text-purple-800 border-purple-300', step: 4 },
  shipped: { label: 'Expedido / En Tránsito', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', step: 5 },
};

export default function ClientPortal() {
  const { user, signInWithGoogle, isLoading, accessToken } = useAuth();
  const [quotes, setQuotes] = useState<StoredQuote[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);

  useEffect(() => {
    if (!user) {
      setQuotes([]);
      return;
    }

    setLoadingQuotes(true);
    const unsubscribe = subscribeToUserQuotes(
      user.uid,
      (fetchedQuotes) => {
        setQuotes(fetchedQuotes);
        setLoadingQuotes(false);
      },
      (err) => {
        console.error("Error fetching quotes:", err);
        setLoadingQuotes(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return (
    <section id="portal-b2b" className="bg-slate-100 border-t border-slate-200">
      <div className="section-padding">
        
        {/* Section Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="tech-mono text-industrial-accent mb-2 block">// ECOSISTEMA B2B & FIREBASE FIRESTORE</span>
            <h2 className="heading-lg">Portal de Clientes & Seguimiento de Planta</h2>
          </div>
          <p className="text-slate-600 max-w-md tech-mono text-xs leading-relaxed">
            Monitoriza el estado de tus órdenes de mecanizado y fabricación aditiva en tiempo real con trazabilidad ISO 9001.
          </p>
        </div>

        {!user ? (
          /* Sign-in Promotion Card */
          <div className="bg-white border border-slate-300 p-8 md:p-12 text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-14 h-14 bg-orange-50 border border-orange-200 flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-7 h-7 text-industrial-accent" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Acceso al Área Privada de Ingeniería
            </h3>
            <p className="text-slate-600 text-sm mb-6 max-w-lg mx-auto leading-relaxed">
              Inicia sesión con tu cuenta de Google Workspace para sincronizar automáticamente tus solicitudes en <strong>Google Sheets</strong>, recibir comprobantes por <strong>Gmail</strong> y seguir la fabricación en <strong>Firebase</strong>.
            </p>

            {/* Official Google Sign-In Button */}
            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={isLoading}
              className="inline-flex items-center gap-3 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-300 shadow-xs transition-all hover:border-slate-400"
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>Continuar con Google</span>
            </button>

            <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-slate-500 text-left">
              <div>
                <strong className="text-slate-700 block mb-1">Google Sheets</strong>
                <span>Pipeline de pedidos sincronizado en tu Drive</span>
              </div>
              <div>
                <strong className="text-slate-700 block mb-1">Gmail API</strong>
                <span>Confirmaciones y acuse técnico directo</span>
              </div>
              <div>
                <strong className="text-slate-700 block mb-1">Firebase DB</strong>
                <span>Trazabilidad de metrología y estados en vivo</span>
              </div>
            </div>
          </div>
        ) : (
          /* Logged In Portal Dashboard */
          <div className="space-y-6">
            
            {/* User Info Bar */}
            <div className="bg-white border border-slate-300 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-4">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'Usuario'} className="w-12 h-12 rounded-full border border-slate-300" />
                ) : (
                  <div className="w-12 h-12 bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-lg">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {user.displayName || user.email}
                  </h3>
                  <p className="text-xs font-mono text-slate-500">
                    Cliente Corporativo · UID: <span className="text-slate-700">{user.uid.slice(0, 10)}...</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Sincronizado con Google & Firebase</span>
                </span>
              </div>
            </div>

            {/* Orders List from Firestore */}
            <div className="bg-white border border-slate-300 shadow-xs">
              <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-industrial-accent" />
                  <h4 className="text-base font-bold text-slate-900">
                    Expedientes de Fabricación Registrados ({quotes.length})
                  </h4>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  Actualización en tiempo real vía Firestore
                </span>
              </div>

              {loadingQuotes ? (
                <div className="p-12 text-center text-slate-500 font-mono text-sm flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-industrial-accent" />
                  <span>Cargando expedientes de planta...</span>
                </div>
              ) : quotes.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="font-medium text-slate-700 text-sm">No tienes expedientes registrados todavía.</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Sube un modelo CAD en la sección de cotización para registrar tu primera orden.
                  </p>
                  <a href="#cotizacion" className="btn-primary inline-flex text-xs px-4 py-2 mt-4">
                    Subir Modelo CAD
                  </a>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {quotes.map((q) => {
                    const statusInfo = STATUS_LABELS[q.status] || STATUS_LABELS.received;
                    return (
                      <div key={q.id} className="p-5 sm:p-6 hover:bg-slate-50 transition-colors">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="text-base font-mono font-bold text-industrial-accent">
                                {q.ticketNumber}
                              </span>
                              <span className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 border ${statusInfo.color}`}>
                                {statusInfo.label}
                              </span>
                            </div>
                            <span className="text-xs text-slate-500 font-mono block mt-1">
                              Empresa: <strong>{q.company}</strong> · {q.createdAt}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 font-mono text-xs text-slate-600">
                            <Clock className="w-4 h-4 text-industrial-accent" />
                            <span>Compromiso SLA: <strong>{q.slaSpeed}</strong></span>
                          </div>
                        </div>

                        {/* Technical Parameters Badges */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 border border-slate-200">
                          <div>
                            <span className="block text-[10px] font-mono text-slate-400 uppercase">Tecnología</span>
                            <span className="font-semibold text-slate-800">{q.technology}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-mono text-slate-400 uppercase">Material</span>
                            <span className="font-semibold text-slate-800">{q.material}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-mono text-slate-400 uppercase">Acabado</span>
                            <span className="font-semibold text-slate-800 truncate block">{q.surfaceFinish}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-mono text-slate-400 uppercase">Cantidad</span>
                            <span className="font-semibold text-industrial-accent">{q.quantity} uds</span>
                          </div>
                        </div>

                        {/* Lifecycle Progress Bar */}
                        <div className="mt-4 pt-3 border-t border-slate-100">
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1.5">
                            <span>1. Registro</span>
                            <span>2. DFM</span>
                            <span>3. Planta</span>
                            <span>4. CMM</span>
                            <span>5. Entrega</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 overflow-hidden">
                            <div 
                              className="bg-industrial-accent h-full transition-all duration-500"
                              style={{ width: `${(statusInfo.step / 5) * 100}%` }}
                            />
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
