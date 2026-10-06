import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, X, Send } from 'lucide-react';
import { QuotePayload, sendQuoteConfirmationEmail } from '../lib/workspace';

interface GmailConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: QuotePayload | null;
  accessToken: string;
  onSuccess: () => void;
}

export default function GmailConfirmationModal({
  isOpen,
  onClose,
  quote,
  accessToken,
  onSuccess,
}: GmailConfirmationModalProps) {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !quote) return null;

  const handleSend = async () => {
    setIsSending(true);
    setError(null);
    try {
      await sendQuoteConfirmationEmail(accessToken, quote.email, quote);
      setIsSending(false);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error sending email:", err);
      setError(err instanceof Error ? err.message : 'Error al enviar el correo con Gmail');
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-300 w-full max-w-lg shadow-2xl p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-industrial-accent" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Confirmar Envío de Correo vía Gmail
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Google Workspace API · Envío de Acuse Oficial
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          ¿Deseas enviar un correo formal de confirmación de fabricación desde tu cuenta de Gmail vinculada a <strong>{quote.email}</strong> para el expediente <strong>{quote.ticketNumber}</strong>?
        </p>

        {/* Email Preview Box */}
        <div className="bg-slate-50 border border-slate-200 p-3 text-xs font-mono mb-6 space-y-1.5 text-slate-700">
          <div><span className="text-slate-400">Destinatario:</span> {quote.email}</div>
          <div><span className="text-slate-400">Asunto:</span> [ProtoGen3D] Confirmación de Expediente {quote.ticketNumber}</div>
          <div><span className="text-slate-400">Detalles:</span> {quote.technology} · {quote.material} · {quote.quantity} uds</div>
          <div><span className="text-slate-400">Plazo SLA:</span> {quote.slaSpeed}</div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isSending}
            className="px-4 py-2 text-xs font-mono border border-slate-300 hover:bg-slate-100 text-slate-700"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSend}
            disabled={isSending}
            className="btn-primary px-5 py-2 text-xs font-mono flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSending ? 'Enviando...' : 'Confirmar y Enviar con Gmail'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
