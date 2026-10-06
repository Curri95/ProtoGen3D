/**
 * Google Workspace Client Integration: Google Sheets & Gmail API
 */

export interface QuotePayload {
  ticketNumber: string;
  company: string;
  email: string;
  technology: string;
  material: string;
  surfaceFinish: string;
  quantity: number;
  slaSpeed: string;
  autoDfm: boolean;
  fileNames: string;
  notes?: string;
  date: string;
}

// -------------------------------------------------------------
// GOOGLE SHEETS API
// -------------------------------------------------------------

const SPREADSHEET_TITLE = 'ProtoGen3D - Pipeline de Cotizaciones Industriales';

/**
 * Searches for existing ProtoGen3D spreadsheet or creates a new one with formatted headers
 */
export async function getOrCreateQuotesSpreadsheet(accessToken: string): Promise<{ id: string; url: string }> {
  // 1. Search existing files using Google Drive API
  try {
    const driveQuery = encodeURIComponent(`name = '${SPREADSHEET_TITLE}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`);
    const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${driveQuery}&fields=files(id,name,webViewLink)`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData.files && searchData.files.length > 0) {
        const file = searchData.files[0];
        return {
          id: file.id,
          url: file.webViewLink || `https://docs.google.com/spreadsheets/d/${file.id}/edit`,
        };
      }
    }
  } catch (err) {
    console.warn("Drive search error, proceeding to create sheet:", err);
  }

  // 2. Create new spreadsheet if not found
  const headers = [
    'Nº Ticket',
    'Fecha Registro',
    'Empresa / Centro I+D',
    'Email Contacto',
    'Tecnología',
    'Material',
    'Acabado Superficial',
    'Cantidad (Uds)',
    'Plazo SLA',
    'Compensación DFM',
    'Modelos CAD',
    'Requerimientos / Notas'
  ];

  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: SPREADSHEET_TITLE,
      },
      sheets: [
        {
          properties: {
            title: 'Cotizaciones B2B',
            gridProperties: {
              frozenRowCount: 1,
            },
          },
          data: [
            {
              startRow: 0,
              startColumn: 0,
              rowData: [
                {
                  values: headers.map(header => ({
                    userEnteredValue: { stringValue: header },
                    userEnteredFormat: {
                      textFormat: { bold: true, foregroundColor: { red: 0.1, green: 0.15, blue: 0.25 } },
                      backgroundColor: { red: 0.95, green: 0.96, blue: 0.98 },
                    },
                  })),
                },
              ],
            },
          ],
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const errorData = await createRes.json();
    throw new Error(errorData.error?.message || 'Error al inicializar la hoja en Google Sheets');
  }

  const sheetData = await createRes.json();
  return {
    id: sheetData.spreadsheetId,
    url: sheetData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${sheetData.spreadsheetId}/edit`,
  };
}

/**
 * Appends a quote row into Google Sheets
 */
export async function appendQuoteToSheet(
  accessToken: string,
  spreadsheetId: string,
  quote: QuotePayload
): Promise<boolean> {
  const rowValues = [
    quote.ticketNumber,
    quote.date,
    quote.company,
    quote.email,
    quote.technology,
    quote.material,
    quote.surfaceFinish,
    quote.quantity,
    quote.slaSpeed,
    quote.autoDfm ? 'Sí (+0.2 mm)' : 'No',
    quote.fileNames,
    quote.notes || 'Ninguna especificación adicional'
  ];

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Cotizaciones%20B2B!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      range: 'Cotizaciones B2B!A1',
      majorDimension: 'ROWS',
      values: [rowValues],
    }),
  });

  if (!res.ok) {
    // Fallback if sheet tab name differs
    const fallbackUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
    const fallbackRes = await fetch(fallbackUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [rowValues],
      }),
    });
    return fallbackRes.ok;
  }

  return true;
}

// -------------------------------------------------------------
// GMAIL API
// -------------------------------------------------------------

function encodeBase64Url(str: string): string {
  // Standard btoa and replace URL unsafe characters
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Sends a formal confirmation email from the user's Gmail
 */
export async function sendQuoteConfirmationEmail(
  accessToken: string,
  recipientEmail: string,
  quote: QuotePayload
): Promise<{ id: string; threadId: string }> {
  const subject = `[ProtoGen3D] Confirmación de Expediente de Fabricación ${quote.ticketNumber}`;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; border: 1px solid #e2e8f0; padding: 24px;">
      <div style="border-bottom: 2px solid #FF5722; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #0f172a; margin: 0; font-size: 20px;">PROTOGEN<span style="color: #FF5722;">3D</span> // INGENIERÍA INDUSTRIAL</h2>
        <p style="margin: 4px 0 0 0; color: #64748b; font-size: 12px; font-family: monospace;">CENTRO DE MECANIZADO Y FABRICACIÓN ADITIVA - TORRIJOS (TOLEDO)</p>
      </div>

      <p style="font-size: 14px;">Estimado/a responsable de <strong>${quote.company}</strong>,</p>
      <p style="font-size: 14px; line-height: 1.5;">
        Hemos recibido y registrado satisfactoriamente tu solicitud de fabricación. El expediente ha sido asignado al equipo técnico bajo estricto protocolo de confidencialidad NDA.
      </p>

      <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 16px; margin: 20px 0; font-size: 13px;">
        <div style="margin-bottom: 8px;"><strong>Nº DE TICKET:</strong> <span style="color: #FF5722; font-family: monospace; font-weight: bold;">${quote.ticketNumber}</span></div>
        <div style="margin-bottom: 8px;"><strong>TECNOLOGÍA:</strong> ${quote.technology}</div>
        <div style="margin-bottom: 8px;"><strong>MATERIAL / ALEACIÓN:</strong> ${quote.material}</div>
        <div style="margin-bottom: 8px;"><strong>ACABADO SUPERFICIAL:</strong> ${quote.surfaceFinish}</div>
        <div style="margin-bottom: 8px;"><strong>CANTIDAD:</strong> ${quote.quantity} unidades</div>
        <div style="margin-bottom: 8px;"><strong>PLAZO DE FABRICACIÓN (SLA):</strong> ${quote.slaSpeed}</div>
        <div style="margin-bottom: 8px;"><strong>ARCHIVOS CAD ANALIZADOS:</strong> ${quote.fileNames}</div>
        <div><strong>COMPENSACIÓN DFM PREVENTIVA:</strong> ${quote.autoDfm ? 'Autorizada (+0.2 mm)' : 'Revisión estándar'}</div>
      </div>

      <div style="background-color: #fff7ed; border-left: 4px solid #FF5722; padding: 12px; margin: 20px 0; font-size: 12px; color: #9a3412;">
        <strong>Compromiso SLA de Respuesta:</strong> Un ingeniero revisará la viabilidad de mecanizado/impresión y te remitirá la validación final en menos de 2 horas laborables.
      </div>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      
      <p style="font-size: 11px; color: #64748b; font-family: monospace; margin: 0;">
        Planta Industrial: Polígono Industrial Atalaya, Av. de los Trabajadores 20, Torrijos, Toledo.<br/>
        Contacto de soporte: ingenieria@protogen3d.com
      </p>
    </div>
  `;

  const rawMessage = [
    `To: ${recipientEmail}`,
    `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    htmlBody,
  ].join('\r\n');

  const base64Safe = encodeBase64Url(rawMessage);

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: base64Safe,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error?.message || 'Error al enviar el correo mediante Gmail');
  }

  return await res.json();
}
