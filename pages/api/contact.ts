import type { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';

type ContactData = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
};

type ResponseData = {
  success: boolean;
  message: string;
};

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY environment variable is not set');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const data = req.body as ContactData;

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.message) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez remplir tous les champs obligatoires',
      });
    }

    const msg = {
      to: 'contact@marialena-pietri.fr', // Your email address
      from: 'noreply@marialena-pietri.fr', // Your verified sender
      subject: `Nouveau message de ${data.firstName} ${data.lastName}`,
      text: `
        Nom: ${data.firstName} ${data.lastName}
        Email: ${data.email}
        Téléphone: ${data.phone || 'Non renseigné'}
        
        Message:
        ${data.message}
      `,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Téléphone:</strong> ${data.phone || 'Non renseigné'}</p>
        <br/>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br/>')}</p>
      `,
    };

    await sgMail.send(msg);
    return res.status(200).json({
      success: true,
      message: 'Message envoyé avec succès',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de l\'envoi du message',
    });
  }
}
