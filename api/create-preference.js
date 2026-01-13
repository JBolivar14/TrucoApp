import mercadopago from 'mercadopago';

export default async function handler(req, res) {
  // Solo permitir método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Configurar credenciales
    mercadopago.configure({
      access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
    });

    // Obtener datos del pago del body
    const {
      tournamentName,
      amount,
      playerName,
      email,
      phone,
      ticketId,
      tournamentId,
      playerId,
      baseUrl
    } = req.body;

    // Validar datos requeridos
    if (!tournamentName || !amount || !playerName || !email) {
      return res.status(400).json({
        error: 'Faltan datos requeridos: tournamentName, amount, playerName, email'
      });
    }

    // Preparar teléfono (extraer código de área y número)
    const phoneNumber = phone || '';
    const areaCode = phoneNumber.substring(0, 2) || '11';
    const number = phoneNumber.substring(2) || '';

    // Crear preferencia de pago
    const preference = {
      items: [
        {
          title: tournamentName,
          quantity: 1,
          unit_price: parseFloat(amount),
          currency_id: 'ARS'
        }
      ],
      payer: {
        name: playerName,
        email: email,
        phone: {
          area_code: areaCode,
          number: number
        }
      },
      back_urls: {
        success: `${baseUrl || 'https://trucoapp.vercel.app'}/pago/exitoso?ticketId=${ticketId || ''}&tournamentId=${tournamentId || ''}&playerId=${playerId || ''}`,
        failure: `${baseUrl || 'https://trucoapp.vercel.app'}/pago/fallido?ticketId=${ticketId || ''}`,
        pending: `${baseUrl || 'https://trucoapp.vercel.app'}/pago/pendiente?ticketId=${ticketId || ''}`
      },
      auto_return: 'approved',
      external_reference: ticketId || `ticket-${Date.now()}`,
      statement_descriptor: 'TORNEO TRUCO',
      notification_url: `${baseUrl || 'https://trucoapp.vercel.app'}/api/webhook/mercadopago` // Para webhooks (opcional)
    };

    // Crear la preferencia en Mercado Pago
    const response = await mercadopago.preferences.create(preference);

    // Devolver la URL de pago (init_point)
    return res.status(200).json({
      init_point: response.body.init_point,
      preference_id: response.body.id
    });

  } catch (error) {
    console.error('Error al crear preferencia de Mercado Pago:', error);
    return res.status(500).json({
      error: 'Error al crear preferencia de pago',
      message: error.message
    });
  }
}
