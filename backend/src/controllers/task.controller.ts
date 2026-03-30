import { Request, Response } from 'express';
import { prisma } from '../lib/db';
import { z } from 'zod';
import { AIService } from '../services/ai.service';

const createTaskSchema = z.object({
  title: z.string().min(1, 'Titre requis'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  dueDate: z.string().optional(),
  categoryId: z.string().optional(),
  subTasks: z.array(z.string()).optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
});

export class TaskController {
  
  static async list(req: Request, res: Response) {
    try {
      // @ts-ignore
      const userId = req.user.id;
      const tasks = await prisma.task.findMany({
        where: { userId },
        include: { 
          category: true,
          subTasks: true 
        },
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json(tasks);
    } catch (e) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des tâches' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      // @ts-ignore
      const userId = req.user.id;
      const parsedData = createTaskSchema.parse(req.body);
      const aiFeedback = await AIService.calculatePriority(parsedData.title, parsedData.description);
      const estimatedTime = await AIService.estimateTime(parsedData.title, parsedData.description);

      const task = await prisma.task.create({
        data: {
          title: parsedData.title,
          description: parsedData.description,
          status: 'TODO',
          priority: parsedData.priority || 'MEDIUM',
          isAIPriority: aiFeedback.isPriority,
          aiScore: aiFeedback.score,
          aiReasoning: aiFeedback.reasoning,
          estimatedTime: estimatedTime,
          categoryId: parsedData.categoryId,
          userId: userId,
          dueDate: parsedData.dueDate ? new Date(parsedData.dueDate) : null,
          subTasks: parsedData.subTasks ? {
            create: parsedData.subTasks.map(title => ({
              title,
              userId
            }))
          } : undefined
        },
        include: {
          subTasks: true
        }
      });

      return res.status(201).json(task);
    } catch (e: any) {
      if (e instanceof z.ZodError) {
         return res.status(400).json({ error: e.issues[0].message });
      }
      return res.status(500).json({ error: 'Erreur lors de la création de la tâche' });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      // @ts-ignore
      const userId = req.user.id;
      const taskId = req.params.id as string;
      const parsedData = updateStatusSchema.parse(req.body);

      const task = await prisma.task.updateMany({
        where: { id: taskId, userId: userId },
        data: { status: parsedData.status }
      });

      if (task.count === 0) {
        return res.status(404).json({ error: 'Tâche non trouvée ou non autorisée' });
      }
      const updated = await prisma.task.findUnique({ where: { id: taskId }});
      return res.status(200).json(updated);
    } catch (e: any) {
      if (e instanceof z.ZodError) {
         return res.status(400).json({ error: e.issues[0].message });
      }
      return res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      // @ts-ignore
      const userId = req.user.id;
      const taskId = req.params.id as string;
      const { title, description, priority, dueDate, categoryId } = req.body;

      const data: any = {};
      if (title !== undefined) data.title = title;
      if (description !== undefined) data.description = description;
      if (priority !== undefined) data.priority = priority;
      if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;
      if (categoryId !== undefined) data.categoryId = categoryId || null;

      const result = await prisma.task.updateMany({
        where: { id: taskId, userId },
        data
      });

      if (result.count === 0) {
        return res.status(404).json({ error: 'Tâche non trouvée' });
      }

      const updated = await prisma.task.findUnique({ 
        where: { id: taskId },
        include: { category: true, subTasks: true }
      });
      return res.status(200).json(updated);
    } catch (e) {
      return res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      // @ts-ignore
      const userId = req.user.id;
      const taskId = req.params.id as string;

      const deleted = await prisma.task.deleteMany({
        where: { id: taskId, userId: userId }
      });

      if (deleted.count === 0) {
        return res.status(404).json({ error: 'Tâche non trouvée' });
      }

      return res.status(204).send();
    } catch (e) {
      return res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
  }

  static async toggleSubTask(req: Request, res: Response) {
    try {
      // @ts-ignore
      const userId = req.user.id;
      const subTaskId = req.params.subTaskId as string;
      const { completed } = req.body;

      const subTask = await prisma.subTask.updateMany({
        where: { id: subTaskId, userId: userId },
        data: { completed: !!completed }
      });

      if (subTask.count === 0) {
        return res.status(404).json({ error: 'Sous-tâche non trouvée' });
      }

      return res.status(200).json({ message: 'État mis à jour' });
    } catch (e) {
      return res.status(500).json({ error: 'Erreur lors de la mise à jour de la sous-tâche' });
    }
  }
}
