import { Request, Response } from 'express';
import { prisma } from '../lib/db';
import { GoogleGenAI } from '@google/genai';

export class AIController {
  static async chat(req: Request, res: Response) {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Clé API Gemini non configurée dans le backend." });
      }

      // @ts-ignore
      const userId = req.user.id;
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "Historique de messages requis." });
      }

      // Fetch 20 most recent/relevant tasks for context (not all)
      const tasks = await prisma.task.findMany({
        where: { userId },
        include: { subTasks: true, category: true },
        orderBy: [
          { status: 'asc' },      // TODO first, then DONE
          { createdAt: 'desc' }
        ],
        take: 20
      });

      const today = new Date().toLocaleDateString('fr-FR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });

      const systemPrompt = `Tu es le noyau IA de "Priora OS", un assistant de productivité d'élite.
Ton style est précis, orienté data, sans bla-bla. Tu vouvoies l'utilisateur.
Tu donnes des recommandations chirurgicales sur l'optimisation de son temps.
Date du jour : ${today}.

TÂCHES DE L'UTILISATEUR (20 plus récentes) :
${JSON.stringify(tasks.map((t: any) => ({
  titre: t.title,
  statut: t.status,
  priorite: t.priority,
  score_ia: t.aiScore,
  date_echeance: t.dueDate,
  temps_estime: t.estimatedTime ? `${t.estimatedTime} min` : null,
  categorie: t.category?.name,
  sous_taches: t.subTasks.map((st: any) => ({ titre: st.title, termine: st.completed }))
})), null, 2)}`;

      const ai = new GoogleGenAI({ apiKey });

      // Convert history to Gemini format
      let contents = messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      // Ensure first content is from 'user'
      while (contents.length > 0 && contents[0].role !== 'user') {
        contents.shift();
      }

      if (contents.length === 0) {
        contents.push({
          role: 'user',
          parts: [{ text: 'Bonjour, analyse ma productivité.' }]
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: systemPrompt,
        },
        contents: contents
      });

      return res.status(200).json({ reply: response.text || "Désolé, je n'ai pas pu générer de réponse." });
    } catch (e: any) {
      console.error("AI Error:", e);
      return res.status(500).json({ error: "Erreur lors de la communication avec l'IA." });
    }
  }
}
