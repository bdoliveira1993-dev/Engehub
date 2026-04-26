
/**
 * EngenhariaHub - Automação de Lembretes de Eventos
 * Este script deve rodar em uma Vercel Cron Job ou Supabase Edge Function a cada 1 hora.
 */

import { Resend } from 'resend'; // Sugestão de serviço para e-mails transacionais

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function eventReminderCron() {
  console.log('Iniciando processamento de lembretes...');

  // 1. Buscar participantes de eventos que começam em ~24h ou ~1h
  // Mock da query SQL: 
  // SELECT a.*, e.title, e.date, u.email, u.name 
  // FROM event_attendees a 
  // JOIN events e ON a.event_id = e.id 
  // JOIN users u ON a.user_id = u.id
  // WHERE e.date BETWEEN (NOW() + INTERVAL '23 hours') AND (NOW() + INTERVAL '25 hours')
  // AND a.reminder_sent_24h = false;

  const upcomingAttendees = [
    { 
      email: 'exemplo@engenharia.com', 
      name: 'Eng. Ricardo', 
      eventTitle: 'Webinar: Inovações em Concreto',
      type: '24h'
    }
  ];

  for (const attendee of upcomingAttendees) {
    try {
      // 2. Disparar E-mail
      await resend.emails.send({
        from: 'EngenhariaHub <comunidade@engenhariahub.com>',
        to: attendee.email,
        subject: `[Lembrete] ${attendee.eventTitle} em ${attendee.type}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
            <h2 style="color: #2563eb;">Falta pouco, ${attendee.name.split(' ')[0]}!</h2>
            <p>Seu evento <strong>${attendee.eventTitle}</strong> começará em breve.</p>
            <p>Prepare suas perguntas e nos vemos lá!</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <small style="color: #94a3b8;">EngenhariaHub - Networking Profissional de Elite</small>
          </div>
        `
      });

      // 3. Registrar Notificação Interna no Banco
      // await supabase.from('notifications').insert({ ... });

      // 4. Marcar lembrete como enviado para evitar duplicidade
      // await supabase.from('event_attendees').update({ reminder_sent_24h: true }).eq('id', attendee.id);

      console.log(`Lembrete enviado para ${attendee.email}`);
    } catch (err) {
      console.error('Erro ao enviar lembrete:', err);
    }
  }

  return { status: 'success', count: upcomingAttendees.length };
}
