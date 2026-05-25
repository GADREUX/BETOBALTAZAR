/**
 * Helpers para integração via WhatsApp Web (links wa.me)
 * Não usa API paga — links abrem WhatsApp com mensagem pré-preenchida.
 */

const CORRETOR_NAME = process.env.NEXT_PUBLIC_CORRETOR_NOME || 'Beto Baltazar';
const CORRETOR_WHATSAPP = process.env.NEXT_PUBLIC_CORRETOR_WHATSAPP || '5515996897738';
const CORRETOR_PHONE = '(15) 99689-7738';
const CRECI = 'CRECI 318284-F';
const PIX_KEY = process.env.NEXT_PUBLIC_PIX_KEY || 'betobaltazar@gmail.com';

export function whatsappUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const finalPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  return `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`;
}

export const templates = {
  boletoReminder: (params: {
    tenantName: string;
    propertyTitle: string;
    value: string;
    dueDate: string;
    pixCode: string;
  }) =>
    `Olá ${params.tenantName.split(' ')[0]}! 🏠

Lembrete referente ao imóvel *${params.propertyTitle}*:

💰 Valor: ${params.value}
📅 Vencimento: ${params.dueDate}

*Pagamento via PIX (copia e cola):*
${params.pixCode}

Ou pela chave PIX:
📧 ${PIX_KEY}

Após o pagamento, por favor envie o comprovante.

Qualquer dúvida estou à disposição!

— ${CORRETOR_NAME}
${CRECI}
📞 ${CORRETOR_PHONE}`,

  boletoOverdue: (params: {
    tenantName: string;
    propertyTitle: string;
    value: string;
    dueDate: string;
    daysOverdue: number;
  }) =>
    `Olá ${params.tenantName.split(' ')[0]},

Notei que o boleto referente a *${params.propertyTitle}* está em atraso há ${params.daysOverdue} dia(s).

💰 Valor: ${params.value}
📅 Vencimento: ${params.dueDate}

Caso já tenha realizado o pagamento, por favor desconsidere esta mensagem e me envie o comprovante.

Se houver algum problema, vamos conversar para encontrar a melhor solução.

— ${CORRETOR_NAME}
${CRECI}`,

  propertyShare: (params: {
    title: string;
    neighborhood: string;
    city: string;
    state: string;
    price: string;
    bedrooms: number;
    bathrooms: number;
    parking: number;
    area: number;
    description: string;
    url?: string;
  }) =>
    `🏠 *${params.title}*
📍 ${params.neighborhood}, ${params.city}/${params.state}

💰 ${params.price}
🛏 ${params.bedrooms} quartos | 🚿 ${params.bathrooms} banheiros
🚗 ${params.parking} vagas | 📐 ${params.area}m²

${params.description}
${params.url ? `\n🔗 ${params.url}\n` : ''}
— ${CORRETOR_NAME}
${CRECI}
📞 ${CORRETOR_PHONE}`,

  leadFirstContact: (params: { leadName: string; interest: string }) =>
    `Olá ${params.leadName.split(' ')[0]}! 😊

Aqui é o ${CORRETOR_NAME}, Corretor de Imóveis.

Estou entrando em contato sobre seu interesse:
*${params.interest}*

Podemos conversar para entender melhor o que você procura?

${CRECI}
📞 ${CORRETOR_PHONE}`,

  visitConfirmation: (params: {
    leadName: string;
    propertyTitle: string;
    date: string;
    time: string;
    address: string;
  }) =>
    `Olá ${params.leadName.split(' ')[0]}! ✨

Confirmando sua visita ao imóvel:
🏠 *${params.propertyTitle}*

📅 Data: ${params.date}
🕐 Horário: ${params.time}
📍 Endereço: ${params.address}

Te aguardo no local. Qualquer alteração me avise!

— ${CORRETOR_NAME}
${CRECI}
📞 ${CORRETOR_PHONE}`,

  contractRenewal: (params: { tenantName: string; propertyTitle: string; endDate: string }) =>
    `Olá ${params.tenantName.split(' ')[0]}! 📋

Seu contrato referente ao imóvel *${params.propertyTitle}* tem vencimento em ${params.endDate}.

Gostaria de conversar sobre a renovação? Vamos agendar uma conversa.

— ${CORRETOR_NAME}
${CRECI}`,

  newSubmissionAlert: (params: {
    name: string;
    phone: string;
    type: string;
    details: string;
  }) =>
    `🔔 *Nova solicitação no site!*

👤 *Nome:* ${params.name}
📞 *Telefone:* ${params.phone}
📋 *Tipo:* ${params.type}

*Detalhes:*
${params.details}

Acesse o painel para responder.`,
};

export function shareProperty(phone: string, propertyData: Parameters<typeof templates.propertyShare>[0]) {
  return whatsappUrl(phone, templates.propertyShare(propertyData));
}

export function sendBoletoReminder(phone: string, data: Parameters<typeof templates.boletoReminder>[0]) {
  return whatsappUrl(phone, templates.boletoReminder(data));
}

export function notifyCorretor(message: string) {
  return whatsappUrl(CORRETOR_WHATSAPP, message);
}
