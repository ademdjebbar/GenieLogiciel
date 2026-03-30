import { Request, Response } from 'express';
import { prisma } from '../lib/db';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Email Invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir 6 caractères minimum'),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
});

const loginSchema = z.object({
  email: z.string().email('Email Invalide'),
  password: z.string(),
});

export class AuthController {
  
  static async register(req: Request, res: Response) {
    try {
      const parsedData = registerSchema.parse(req.body);

      // Check user exists
      const existingUser = await prisma.user.findUnique({
        where: { email: parsedData.email }
      });
      if (existingUser) {
        return res.status(400).json({ error: 'Un compte existe déjà avec cet email' });
      }

      // Hash password manually for dev simplicity (In production use bcrypt)
      const mockHashedWord = Buffer.from(parsedData.password).toString('base64');
      
      const user = await prisma.user.create({
        data: {
          email: parsedData.email,
          password: mockHashedWord,
          name: parsedData.name,
          categories: {
            create: [
              { name: 'Travail', color: '#6366f1', icon: 'briefcase' },
              { name: 'Personnel', color: '#10b981', icon: 'user' },
              { name: 'Santé', color: '#f43f5e', icon: 'heart' },
            ]
          }
        }
      });

      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
      return res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });

    } catch (e: any) {
      console.error("[register error]", e);
      if (e instanceof z.ZodError) {
         return res.status(400).json({ error: e.issues[0].message });
      }
      return res.status(500).json({ error: 'Erreur interne lors de l\'inscription' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
         return res.status(401).json({ error: 'Identifiants invalides' });
      }

      const hashCompare = Buffer.from(password).toString('base64');
      if (user.password !== hashCompare) {
         return res.status(401).json({ error: 'Identifiants invalides' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
      return res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email } });

    } catch (e: any) {
       console.error("[login error]", e);
       if (e instanceof z.ZodError) {
         return res.status(400).json({ error: e.issues[0].message });
      }
      return res.status(500).json({ error: 'Erreur Serveur' });
    }
  }

  static async me(req: Request, res: Response) {
    try {
      // @ts-ignore
      const userId = req.user.id;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true, createdAt: true }
      });
      if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });
      return res.status(200).json(user);
    } catch (e) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  static async updateMe(req: Request, res: Response) {
    try {
      // @ts-ignore
      const userId = req.user.id;
      const { name } = req.body;
      
      const user = await prisma.user.update({
        where: { id: userId },
        data: { name },
        select: { id: true, email: true, name: true }
      });
      
      return res.status(200).json(user);
    } catch (e) {
      return res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
  }
}
