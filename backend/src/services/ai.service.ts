import { GoogleGenAI } from '@google/genai';

export class AIService {

  /**
   * Calcule un score de priorité (0-100) via Gemini.
   * Retourne des valeurs par défaut si l'appel échoue.
   */
  static async calculatePriority(title: string, description?: string | null): Promise<{ score: number, isPriority: boolean, reasoning: string }> {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error('No API key');

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Tu es un système de priorisation de tâches. Analyse cette tâche et donne un score de priorité de 0 à 100.

Tâche : "${title}"
${description ? `Description : "${description}"` : ''}

Réponds UNIQUEMENT en JSON valide, sans markdown, sans explication :
{"score": <number 0-100>, "reasoning": "<explication courte en français>"}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });

      const text = (response.text || '').trim();
      const json = JSON.parse(text);
      const score = Math.min(Math.max(Math.round(json.score), 0), 100);

      return {
        score,
        isPriority: score > 75,
        reasoning: json.reasoning || 'Analyse IA effectuée.'
      };
    } catch (e) {
      console.error('AI Priority error:', e instanceof Error ? e.message : e);
      return { score: 50, isPriority: false, reasoning: 'Analyse IA indisponible.' };
    }
  }

  /**
   * Estime le temps nécessaire en minutes via Gemini.
   * Retourne null si l'appel échoue.
   */
  static async estimateTime(title: string, description?: string | null): Promise<number | null> {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error('No API key');

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Tu es un estimateur de temps pour des tâches. Estime le temps nécessaire pour accomplir cette tâche.

Tâche : "${title}"
${description ? `Description : "${description}"` : ''}

Réponds UNIQUEMENT avec un nombre entier représentant les minutes estimées. Rien d'autre.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });

      const minutes = parseInt((response.text || '').trim(), 10);
      if (isNaN(minutes) || minutes < 1) return null;
      return Math.min(minutes, 480);
    } catch (e) {
      console.error('AI Time error:', e instanceof Error ? e.message : e);
      return null;
    }
  }
}
