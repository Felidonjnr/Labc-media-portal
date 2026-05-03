// src/utils/contentRules.js
// Content length and style rules per content type
export const CONTENT_RULES = {
  sunday_recap: { maxWords: 150, platform: 'whatsapp', tone: 'warm recap', note: 'End with a forward-looking blessing' },
  monday_fuel: { maxWords: 80, platform: 'whatsapp', tone: 'motivational voice note script', note: 'Conversational — as if speaking, not writing' },
  word_today: { maxWords: 60, platform: 'whatsapp', tone: 'devotional', note: '1 scripture + 2-line application only' },
  testimony_prompt: { maxWords: 50, platform: 'whatsapp', tone: 'inviting', note: 'Open question, warm energy' },
  absentee_checkin: { maxWords: 90, platform: 'whatsapp', tone: 'caring personal', note: 'Not guilt-tripping — genuine concern' },
  welcome_message: { maxWords: 110, platform: 'whatsapp', tone: 'warm welcome', note: 'Personal, signed from church family' },
  birthday_message: { maxWords: 75, platform: 'whatsapp', tone: 'celebratory blessing', note: 'Include scripture naturally' },
  milestone_message: { maxWords: 90, platform: 'whatsapp', tone: 'congratulatory', note: 'Acknowledge the milestone specifically' },
  prayer_thread: { maxWords: 55, platform: 'whatsapp', tone: 'prayerful invitation', note: 'Open, safe space energy' },
  event_reminder: { maxWords: 85, platform: 'whatsapp', tone: 'excited invitation', note: 'Key details: name, date, time, venue' },
  announcement: { maxWords: 80, platform: 'whatsapp', tone: 'clear informative', note: 'Lead with the news, not the background' },
  quote_card: { maxWords: 30, platform: 'facebook', tone: 'punchy quotable', note: 'One powerful sentence or two short ones' },
  saturday_teaser: { maxWords: 70, platform: 'facebook', tone: 'anticipation builder', note: 'Create curiosity — not information dump' },
  sunday_announcement: { maxWords: 80, platform: 'facebook', tone: 'inviting', note: 'Include time, address, what to expect' },
  programme_promo: { maxWords: 100, platform: 'facebook', tone: 'hype and invitation', note: 'Energy — not a flyer description' },
  testimony_post: { maxWords: 120, platform: 'facebook', tone: 'faith-building story', note: 'Lead with the miracle, then the person' },
  member_spotlight: { maxWords: 130, platform: 'facebook', tone: 'celebratory community', note: 'Make them the hero' },
  bts_caption: { maxWords: 60, platform: 'facebook', tone: 'casual real', note: 'Behind the scenes — human, not polished' },
  live_intro: { maxWords: 70, platform: 'facebook', tone: 'spoken welcome', note: 'As if speaking live — natural' },
  event_recap: { maxWords: 110, platform: 'facebook', tone: 'celebratory recap', note: 'Present tense energy — as if still there' },
  scripture_caption: { maxWords: 50, platform: 'facebook', tone: 'reflective', note: 'Scripture + one reflection question' },
  flyer_copy: { maxWords: 55, platform: 'print', tone: 'scannable', note: 'Title, tagline, date, time, venue — no paragraphs' },
  order_of_service: { maxWords: 200, platform: 'internal', tone: 'structured', note: 'Step by step — clear format' },
  fundraising_appeal: { maxWords: 100, platform: 'whatsapp', tone: 'pastoral appeal', note: 'Heart before ask — vision driven' },
  crusade_promo: { maxWords: 110, platform: 'facebook', tone: 'bold evangelistic', note: 'Urgency and invitation combined' },
  sms_recap: { maxChars: 160, platform: 'sms', tone: 'ultra-condensed', note: 'Core message only — no greetings' },
  sms_announcement: { maxChars: 160, platform: 'sms', tone: 'direct', note: 'What, when, where — nothing else' },
  sms_event: { maxChars: 160, platform: 'sms', tone: 'reminder', note: 'Event + time + venue only' },
  sms_birthday: { maxChars: 140, platform: 'sms', tone: 'warm brief', note: 'Name + blessing + 1 line' },
  sms_welcome: { maxChars: 155, platform: 'sms', tone: 'warm brief', note: 'Welcome + service time + contact' },
  sermon_recap: { maxWords: 150, platform: 'whatsapp', tone: 'warm recap', note: 'Key point + scripture + one action step' },
  sermon_monday_fuel: { maxWords: 80, platform: 'whatsapp', tone: 'voice note script', note: 'Spoken feel — energetic' },
  sermon_quote: { maxWords: 25, platform: 'facebook', tone: 'quotable', note: 'One sentence max — most shareable' },
  sermon_teaser: { maxWords: 65, platform: 'facebook', tone: 'anticipation', note: 'Tease the theme — not the content' },
  sermon_facebook: { maxWords: 120, platform: 'facebook', tone: 'midweek engagement', note: 'Question or challenge to start' },
  sermon_whatsapp: { maxWords: 110, platform: 'whatsapp', tone: 'broadcast', note: 'Scripture + takeaway + blessing' },
  sermon_sms: { maxChars: 160, platform: 'sms', tone: 'condensed', note: 'Core message in one sentence' },
  sermon_summary: { maxWords: 110, platform: 'whatsapp', tone: 'informative warm', note: 'For those who missed — no spoilers' },
  sermon_takeaway: { maxWords: 45, platform: 'print/share', tone: 'memorable', note: 'One clear action or truth to carry' },
  sermon_series_promo: { maxWords: 80, platform: 'facebook', tone: 'series hype', note: 'Build the arc — what is coming' }
};

export function getLengthInstruction(contentType) {
  const rule = CONTENT_RULES[contentType];
  if (!rule) return 'Keep the response concise and appropriate for the platform.';
  if (rule.maxChars) return `STRICT LIMIT: Under ${rule.maxChars} characters total. No exceptions.`;
  if (rule.maxWords) return `STRICT LIMIT: Under ${rule.maxWords} words. Be concise. Cut anything unnecessary.`;
  return 'Keep it appropriately concise.';
}

export function getPlatformNote(contentType) {
  const rule = CONTENT_RULES[contentType];
  if (!rule) return '';
  return rule.note || '';
}
