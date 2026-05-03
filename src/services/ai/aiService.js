// src/services/ai/aiService.js
// Client AI service targeting /api/generate proxy

function getProvider() {
  return localStorage.getItem('lamp_ai_provider') || 'claude';
}

function scoreOutput(text) {
  if (!text || text.length < 20) return 0;
  let score = 0.7;
  const genericPhrases = ['as an ai', 'i cannot', 'i am unable', 'dear valued', 'greetings and salutations'];
  const hasGeneric = genericPhrases.some(p => text.toLowerCase().includes(p));
  if (hasGeneric) score -= 0.3;
  const warmPhrases = ['family', 'grace', 'bless', 'love', 'together', 'amen', 'lord', 'faith'];
  const warmCount = warmPhrases.filter(p => text.toLowerCase().includes(p)).length;
  score += Math.min(warmCount * 0.03, 0.15);
  const wordCount = text.split(' ').length;
  if (wordCount > 300) score -= 0.2;
  if (wordCount < 5) score -= 0.3;
  return Math.min(Math.max(score, 0), 1);
}

export async function generateContent({
  system,
  userMessage,
  maxTokens = 1500,
  forceProvider = null,
  useRefinement = false
}) {
  const provider = forceProvider || getProvider();
  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system,
        messages: [{ role: 'user', content: userMessage }],
        max_tokens: maxTokens,
        provider
      })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    const text = data.text;
    const score = scoreOutput(text);

    if (useRefinement && score < 0.75) {
      const refineRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `You are refining a draft for Light Assembly Bible Church.
          Improve the draft: make it warmer, more human, more natural and ministry-aware.
          Preserve meaning and facts. Remove robotic phrasing.
          Do not add invented facts. Keep platform-appropriate length.
          Return only the improved final version.`,
          messages: [{ role: 'user', content: `Refine this draft:\n\n${text}` }],
          max_tokens: maxTokens,
          provider: 'haiku'
        })
      });
      const refineData = await refineRes.json();
      if (!refineData.error) {
        return { text: refineData.text, score: 0.9, refined: true, provider };
      }
    }
    return { text, score, refined: false, provider };
  } catch (error) {
    console.error('AI generation error:', error);
    throw error;
  }
}

export async function generateJSON({ system, userMessage, maxTokens = 3000 }) {
  const provider = getProvider();
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system,
      messages: [{ role: 'user', content: userMessage }],
      max_tokens: maxTokens,
      provider
    })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  try {
    const cleaned = data.text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    throw new Error('Could not parse AI response as JSON');
  }
}
