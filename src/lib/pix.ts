/**
 * Gerador de PIX BR Code (Copia e Cola) seguindo o padrão Bacen.
 * Não requer conta bancária integrada — gera código estático que o pagador escaneia/cola.
 */

function crc16(payload: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
      crc &= 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function tlv(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

interface PixOptions {
  pixKey: string;          // Chave PIX (email, CPF, celular, aleatória)
  merchantName: string;    // Nome do recebedor (máx 25 chars)
  merchantCity: string;    // Cidade (máx 15 chars, sem acento)
  amount?: number;         // Valor opcional
  txid?: string;           // Identificador da transação (máx 25 chars)
  description?: string;    // Descrição opcional
}

export function generatePixCode(opts: PixOptions): string {
  const sanitizeName = (s: string) =>
    s.toUpperCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Z0-9 ]/g, '')
      .slice(0, 25);

  const sanitizeCity = (s: string) =>
    s.toUpperCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Z0-9 ]/g, '')
      .slice(0, 15);

  const sanitizeTxId = (s?: string) =>
    (s ?? '***').replace(/[^A-Za-z0-9]/g, '').slice(0, 25) || '***';

  // Payload Format Indicator
  let payload = tlv('00', '01');

  // Merchant Account Information (PIX)
  const gui = tlv('00', 'BR.GOV.BCB.PIX');
  const key = tlv('01', opts.pixKey);
  const desc = opts.description ? tlv('02', opts.description.slice(0, 50)) : '';
  payload += tlv('26', gui + key + desc);

  // Merchant Category Code
  payload += tlv('52', '0000');
  // Transaction Currency (986 = BRL)
  payload += tlv('53', '986');
  // Transaction Amount
  if (opts.amount && opts.amount > 0) {
    payload += tlv('54', opts.amount.toFixed(2));
  }
  // Country Code
  payload += tlv('58', 'BR');
  // Merchant Name
  payload += tlv('59', sanitizeName(opts.merchantName));
  // Merchant City
  payload += tlv('60', sanitizeCity(opts.merchantCity));

  // Additional Data Field — TX ID
  payload += tlv('62', tlv('05', sanitizeTxId(opts.txid)));

  // CRC16 — adicionar ID e tamanho antes de calcular
  payload += '6304';
  const crc = crc16(payload);

  return payload + crc;
}

/**
 * Gera o código PIX para um boleto específico.
 */
export function generateBoletoPixCode(boletoId: string, value: number): string {
  return generatePixCode({
    pixKey: process.env.NEXT_PUBLIC_PIX_KEY || 'betobaltazar@gmail.com',
    merchantName: process.env.NEXT_PUBLIC_CORRETOR_NOME || 'Beto Baltazar',
    merchantCity: process.env.NEXT_PUBLIC_PIX_CIDADE || 'CAPAO BONITO',
    amount: value,
    txid: boletoId.replace(/-/g, '').slice(0, 25),
    description: 'Aluguel',
  });
}
