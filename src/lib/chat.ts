import type { PortfolioConfig } from '../data/portfolio.config';

export type Intent =
  | 'contact'
  | 'aws'
  | 'projects'
  | 'skills'
  | 'education'
  | 'certs'
  | 'resume'
  | 'availability'
  | 'greeting'
  | 'unknown';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Order matters: the first matching rule wins.
const RULES: { intent: Intent; test: RegExp }[] = [
  { intent: 'contact', test: /\b(hire|hiring|collab\w*|contact|reach|message|email|get in touch|connect|work with (you|him)|talk to (yawar|you|him)|discuss)\b/i },
  { intent: 'aws', test: /\b(aws|cloud|devops|terraform|lambda|ebs|snapshot|finops|infra\w*|cost)\b/i },
  { intent: 'projects', test: /\b(projects?|case stud\w*|portfolio|built|build)\b/i },
  { intent: 'skills', test: /\b(skills?|stack|tech\w*|tools?|kubernetes|k8s|docker|python|github actions|ci\/?cd)\b/i },
  { intent: 'education', test: /\b(education|degree|college|university|cgpa|b\.?\s?tech)\b/i },
  { intent: 'certs', test: /\b(certif\w*|nielit|machine learning|credential)\b/i },
  { intent: 'resume', test: /\b(resume|cv|curriculum)\b/i },
  { intent: 'availability', test: /\b(availab\w*|internship|intern|job|freelance|full[- ]?time)\b/i },
  { intent: 'greeting', test: /^\s*(hi|hello|hey|hola|namaste|good (morning|afternoon|evening))\b/i },
];

export function detectIntent(text: string): Intent {
  for (const rule of RULES) if (rule.test.test(text)) return rule.intent;
  return 'unknown';
}

/** Answers are assembled only from portfolio.config.ts, so nothing is invented. */
export function answerFor(intent: Intent, c: PortfolioConfig): string {
  switch (intent) {
    case 'aws': {
      const p = c.projects.find((x) => x.id === 'ebs-snapshot-cleanup') ?? c.projects[0];
      const top = p.highlights.slice(0, 2).map((h) => `• ${h}`).join('\n');
      return `${p.title}\n${p.summary}\n\n${top}${p.repoUrl ? `\n\nSource: ${p.repoUrl}` : ''}`;
    }
    case 'projects':
      return `Here are the featured projects:\n${c.projects.map((p) => `• ${p.title}`).join('\n')}\n\nYou can open each one in the Projects section for the full case study.`;
    case 'skills':
      return c.skillGroups.map((g) => `${g.title}: ${g.items.join(', ')}`).join('\n');
    case 'education':
      return c.education.map((e) => `${e.title}, ${e.org} (${e.period}${e.detail ? `, ${e.detail}` : ''})`).join('\n');
    case 'certs':
      return c.certifications.map((x) => `• ${x}`).join('\n');
    case 'resume':
      return 'The full resume is in the Resume section, and you can download it as a PDF from there.';
    case 'availability':
      return "Yawar's availability isn't listed on the site yet. Send him a message and he'll reply to you directly.";
    case 'greeting':
      return `Hi there! I'm ${c.name}'s assistant. Ask me about his skills, projects, or education, or send him a message.`;
    case 'contact':
      return "Happy to pass that along. Let's send Yawar your message.";
    default:
      return "I'm not sure about that one. I can tell you about Yawar's skills, AWS and DevOps projects, education, or certifications. You can also send him a message directly.";
  }
}

export interface Inquiry {
  name: string;
  email: string;
  message: string;
}

export type SendResult = { ok: true; mode: 'web3forms' | 'mailto' } | { ok: false; error: string };

export function hasEmailKey(key: string): boolean {
  return key.length > 0 && !key.startsWith('YOUR_');
}

export function mailtoHref(to: string, i: Inquiry): string {
  const subject = `New Portfolio Inquiry from ${i.name}`;
  const body = `Name: ${i.name}\nEmail: ${i.email}\n\n${i.message}`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export async function sendInquiry(c: PortfolioConfig, i: Inquiry): Promise<SendResult> {
  if (!hasEmailKey(c.emailAccessKey)) {
    const a = document.createElement('a');
    a.href = mailtoHref(c.email, i);
    a.click();
    return { ok: true, mode: 'mailto' };
  }
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: c.emailAccessKey,
        subject: `New Portfolio Inquiry from ${i.name}`,
        from_name: 'Portfolio Concierge',
        name: i.name,
        email: i.email,
        replyto: i.email,
        message: i.message,
      }),
    });
    const data: { success?: boolean; message?: string } = await res.json().catch(() => ({ success: false }));
    if (res.ok && data.success) return { ok: true, mode: 'web3forms' };
    return { ok: false, error: data.message ?? 'Something went wrong on the server.' };
  } catch {
    return { ok: false, error: 'Network error. Please try again in a moment.' };
  }
}
