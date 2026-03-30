import { Request, Response } from 'express';
import { prisma } from '../lib/db';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export class CategoryController {
  
  static async list(req: Request, res: Response) {
    try {
      // @ts-ignore
      const userId = req.user.id;
      const categories = await prisma.category.findMany({
        where: { userId },
        orderBy: { name: 'asc' }
      });
      return res.status(200).json(categories);
    } catch (e) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des catégories' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      // @ts-ignore
      const userId = req.user.id;
      const parsedData = categorySchema.parse(req.body);

      const category = await prisma.category.create({
        data: {
          name: parsedData.name,
          color: parsedData.color || '#6366f1',
          icon: parsedData.icon || 'folder',
          userId: userId,
        }
      });

      return res.status(201).json(category);
    } catch (e: any) {
      if (e instanceof z.ZodError) {
         return res.status(400).json({ error: e.issues[0].message });
      }
      return res.status(500).json({ error: 'Erreur lors de la création' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      // @ts-ignore
      const userId = req.user.id;
      const id = req.params.id as string;

      await prisma.category.deleteMany({
        where: { id, userId }
      });

      return res.status(204).send();
    } catch (e) {
      return res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
  }
}
