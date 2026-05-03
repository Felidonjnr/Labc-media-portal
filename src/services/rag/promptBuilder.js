// src/services/rag/promptBuilder.js
import { getLengthInstruction, getPlatformNote } from '../../utils/contentRules';

export function buildBaseIdentity() {
  return `You are the AI content writer for Light Assembly Bible Church media team in Uyo, Akwa Ibom, Nigeria.
  You generate warm, Spirit-filled, Nigerian Pentecostal church content.
  You never sound robotic, corporate, or generic.
  You sound like a caring, prayerful, ministry-aware church media team.
  You write in simple, flowing human language — not marketing copy.`;
}

export function buildChurchBlock(knowledge) {
  if (!knowledge) return '';
  return `
  CHURCH IDENTITY:
  Name: ${knowledge.churchName || 'Light Assembly Bible Church'}
  Location: ${knowledge.location || 'Uyo, Akwa Ibom, Nigeria'}
  Pastor: ${knowledge.pastorName || 'Rev. Emmanuel Udoh'} (${knowledge.pastorTitle || 'Senior Pastor'})
  Preaching style: ${knowledge.pastorStyle || 'Passionate, Word-based, faith-and-action'}
  Vision: ${knowledge.vision || ''}
  Tone: ${knowledge.tone || 'Warm, charismatic, Spirit-filled, Nigerian Pentecostal'}
  Church language: ${knowledge.churchLanguage || 'Family, Kingdom, Holy Ghost, Covenant'}
  Key scriptures: ${knowledge.keyScriptures || ''}
  Recurring programmes: ${knowledge.recurringProgrammes || 'Thursday Night Programme, 2nd Sunday Covenant Service'}
  `.trim();
}

export function buildTaskBlock(contentType, extraContext = '') {
  const lengthRule = getLengthInstruction(contentType);
  const platformNote = getPlatformNote(contentType);
  return `
  TASK: Generate a ${contentType.replace(/_/g, ' ')} message.
  ${lengthRule}
  Style note: ${platformNote}
  ${extraContext ? `Additional context: ${extraContext}` : ''}
  Write ONLY the final message — no labels, no explanation, no preamble.
  Output must be ready to copy and send directly.
  `.trim();
}

export function buildSermonBlock(sermonBrief) {
  if (!sermonBrief) return '';
  return `
  SERMON BRIEF:
  Title: ${sermonBrief.title || ''}
  Speaker: ${sermonBrief.speaker || 'Rev. Emmanuel Udoh'}
  Date: ${sermonBrief.date || ''}
  Main burden: ${sermonBrief.mainBurden || ''}
  Key points: ${(sermonBrief.mainPoints || []).join('; ')}
  Key scriptures: ${(sermonBrief.scriptures || []).join(', ')}
  Strongest quote: ${sermonBrief.strongestQuote || ''}
  Tone: ${sermonBrief.tone || ''}
  Practical takeaway: ${sermonBrief.practicalTakeaway || ''}
  Call to action: ${sermonBrief.callToAction || ''}
  `.trim();
}

export function buildKnowledgeBlock(chunks = []) {
  if (!chunks.length) return '';
  const relevant = chunks.slice(0, 3).map(c => c.text).join('\n\n');
  return `
  RELEVANT KNOWLEDGE:
  ${relevant}
  (Use insights from above where genuinely applicable. Do not fabricate.)
  `.trim();
}

export function buildExemplarBlock(examples = []) {
  if (!examples.length) return '';
  const sample = examples.slice(0, 2).map(e => `"${e.text}"`).join('\n\n');
  return `
  APPROVED STYLE EXAMPLES (match this tone and quality):
  ${sample}
  `.trim();
}

export function buildPrompt({
  contentType,
  knowledge,
  sermonBrief,
  knowledgeChunks,
  styleExemplars,
  userInput,
  extraContext
}) {
  const blocks = [
    buildBaseIdentity(),
    buildChurchBlock(knowledge),
    sermonBrief ? buildSermonBlock(sermonBrief) : '',
    knowledgeChunks?.length ? buildKnowledgeBlock(knowledgeChunks) : '',
    styleExemplars?.length ? buildExemplarBlock(styleExemplars) : '',
    buildTaskBlock(contentType, extraContext),
  ].filter(Boolean).join('\n\n');
  return {
    system: blocks,
    userMessage: userInput || `Generate the ${contentType.replace(/_/g, ' ')} now.`
  };
}

export function buildSermonExtractionPrompt(sermonInput, churchName = 'Light Assembly Bible Church') {
  return {
    system: `You are a sermon analysis assistant for ${churchName}.
    Extract structured information from sermon notes or transcripts.
    Return ONLY valid JSON — no markdown, no explanation.`,
    userMessage: `Extract a structured sermon brief from this content:
    ${sermonInput}
    Return this exact JSON structure:
    {
      "title": "sermon title",
      "speaker": "speaker name",
      "date": "date or empty string",
      "mainBurden": "one sentence burden",
      "mainPoints": ["point 1", "point 2"],
      "scriptures": ["refs"],
      "strongestQuote": "quote",
      "practicalTakeaway": "one action",
      "callToAction": "what to do",
      "tone": "tone description"
    }`
  };
}

export function buildRepurposePrompt({ knowledge, sermonBrief, userInput, outputTypes }) {
  const churchBlock = buildChurchBlock(knowledge);
  const sermonBlock = sermonBrief ? buildSermonBlock(sermonBrief) : '';
  const outputInstructions = outputTypes.map(type => {
    const rule = getLengthInstruction(type);
    const note = getPlatformNote(type);
    return `"${type}": "${rule}. ${note}. Ready to copy and send."`;
  }).join(',\n');
  return {
    system: `${buildBaseIdentity()}
    ${churchBlock}
    ${sermonBlock}
    You are generating multiple content pieces simultaneously.
    Return ONLY valid JSON — no markdown backticks, no explanation.
    Each value must be a complete, ready-to-send message.
    Never sound robotic or corporate.`,
    userMessage: `Input: ${userInput}
    Generate all of these content pieces:
    {
    ${outputInstructions}
    }`
  };
}
