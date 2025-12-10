import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { CustomError } from '../../utils/CustomError';
import { UserModel } from '../../dto/user/User.dto';

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_FROM_EMAILSENDER,
        pass: process.env.PASSWORD_FROM_EMAILSENDER,
      },
    });
  }

  async sendMail(mailOptions: MailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM_EMAILSENDER,
        ...mailOptions,
      });
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      throw new CustomError('Erreur lors de l\'envoi de l\'email', 500);
    }
  }

  async sendWaitingApprovalEmail(user: UserModel): Promise<void> {
    try {
      const templatePath = path.join(__dirname, '../../mailing/templates/waitingApproval.html');
      
      let htmlContent = fs.readFileSync(templatePath, 'utf8');

      htmlContent = htmlContent
        .replace(/{{username}}/g, user.username || 'Utilisateur')
        .replace(/{{email}}/g, user.email)
        .replace(/{{registrationDate}}/g, new Date().toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }));

      await this.sendMail({
        to: user.email,
        subject: 'Inscription en attente d\'approbation - Archetype Warfare',
        html: htmlContent,
      });
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi de l\'email d\'attente:', error);
      throw new CustomError('Erreur lors de l\'envoi de l\'email d\'attente', 500);
    }
  }
}