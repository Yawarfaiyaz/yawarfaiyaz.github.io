import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useConfig } from '../context/ConfigContext';
import { answerFor, detectIntent, EMAIL_RE, sendInquiry } from '../lib/chat';

type Role = 'bot' | 'user';
type Step = 'idle' | 'name' | 'email' | 'message' | 'confirm' | 'sending';

interface Msg {
  id: number;
  role: Role;
  text: string;
  chips?: string[];
  card?: boolean;
}

const QUICK_PROMPTS = [
  'I want to hire / collaborate with you',
  'Tell me about your AWS & DevOps work',
  'Send a direct message to Yawar',
];
const SEND_LABEL = 'Send Email to Yawar';
const CANCEL_LABEL = 'Cancel';
const MIN_SECONDS_TO_SUBMIT = 3;
const MAX_MESSAGES_PER_SESSION = 3;

export default function ChatWidget() {
  const { config } = useConfig();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState<Step>('idle');
  const [typing, setTyping] = useState(false);
  const [honeypot, setHoneypot] = useState(''); // hidden; humans never see or fill it
  const draft = useRef<{ name?: string; email?: string; message?: string }>({});
  const flowStart = useRef(0);
  const sentCount = useRef(0);
  const idRef = useRef(0);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const greeted = useRef(false);

  const push = (m: Omit<Msg, 'id'>) => {
    const id = ++idRef.current;
    setMsgs((prev) => [...prev, { ...m, id }]);
  };

  const botSay = (text: string, chips?: string[]) => {
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      push({ role: 'bot', text, chips });
    }, 450);
  };

  // Greet on first open (and again after "clear").
  useEffect(() => {
    if (open && msgs.length === 0 && !greeted.current) {
      greeted.current = true;
      botSay(
        `Hi, I'm ${config.name}'s assistant. Ask me about his skills, AWS and DevOps projects, or education. I can also pass a message to him directly.`,
        QUICK_PROMPTS,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, msgs.length]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [msgs, typing]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open, step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const startFlow = () => {
    flowStart.current = Date.now();
    draft.current = {};
    setStep('name');
    botSay("Happy to pass that along. What's your name?");
  };

  const reset = () => {
    draft.current = {};
    setStep('idle');
  };

  const finish = (text: string) => {
    reset();
    botSay(text, QUICK_PROMPTS);
  };

  const send = async () => {
    const d = draft.current;
    if (!d.name || !d.email || !d.message) return;

    // Spam checks: a filled honeypot or a too-fast submit is silently treated as success.
    const tooFast = Date.now() - flowStart.current < MIN_SECONDS_TO_SUBMIT * 1000;
    if (honeypot.trim() || tooFast) {
      finish('Thanks! Your message has been sent to Yawar.');
      return;
    }
    if (sentCount.current >= MAX_MESSAGES_PER_SESSION) {
      botSay(`You've reached the message limit for this session. Please email Yawar directly at ${config.email}.`);
      return;
    }

    setStep('sending');
    const result = await sendInquiry(config, { name: d.name, email: d.email, message: d.message });
    if (result.ok) {
      sentCount.current += 1;
      finish(
        result.mode === 'web3forms'
          ? `Sent! Yawar will receive your message at ${d.email} and can reply to you there.`
          : "I've opened your email app with the message filled in. Just press send. If nothing opened, write to " + config.email + " directly.",
      );
    } else {
      setStep('confirm');
      botSay(`Sorry, that didn't send. ${result.error}`, [SEND_LABEL, CANCEL_LABEL]);
    }
  };

  const cancel = () => {
    finish('No problem, nothing was sent. Anything else I can answer?');
  };

  const route = (text: string) => {
    switch (step) {
      case 'idle': {
        const intent = detectIntent(text);
        if (intent === 'contact') return startFlow();
        const reply = answerFor(intent, config);
        return botSay(reply, intent === 'unknown' || intent === 'greeting' ? QUICK_PROMPTS : undefined);
      }
      case 'name':
        if (text.length < 2) return botSay('Could you share your name? At least two characters, please.');
        draft.current.name = text;
        setStep('email');
        return botSay(`Thanks, ${text}. What's the best email to reply to?`);
      case 'email':
        if (!EMAIL_RE.test(text)) return botSay("That doesn't look like a valid email. Could you double-check it?");
        draft.current.email = text;
        setStep('message');
        return botSay('Great. What would you like to tell Yawar? A sentence or two is perfect.');
      case 'message':
        if (text.length < 10) return botSay('Could you add a little more detail? At least 10 characters, please.');
        draft.current.message = text;
        setStep('confirm');
        return push({ role: 'bot', text: 'Here is your message. Ready to send?', card: true });
      case 'confirm':
        if (/^send/i.test(text)) return void send();
        if (/cancel|no/i.test(text)) return cancel();
        return botSay('Use the buttons below to send or cancel.', [SEND_LABEL, CANCEL_LABEL]);
      default:
        return;
    }
  };

  const submitText = (raw: string) => {
    const text = raw.trim();
    if (!text || step === 'sending') return;
    push({ role: 'user', text });
    setInput('');
    route(text);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitText(input);
  };

  const clearHistory = () => {
    reset();
    greeted.current = false;
    setMsgs([]);
  };

  const handleChip = (chip: string) => {
    if (chip === SEND_LABEL) return void send();
    if (chip === CANCEL_LABEL) return cancel();
    submitText(chip);
  };

  const placeholder =
    step === 'name' ? 'Your name' : step === 'email' ? 'you@example.com' : step === 'message' ? 'Your message' : 'Type a message…';

  return (
    <div className="no-print">
      {/* Floating action button */}
      <div className="group fixed bottom-6 right-6 z-[85]">
        <span className="pointer-events-none absolute bottom-full right-0 mb-3 whitespace-nowrap rounded-full border border-gold/30 bg-obsidian-2 px-4 py-2 font-mono text-[11px] text-gold-soft opacity-0 transition duration-300 group-hover:opacity-100">
          Chat with Yawar's Assistant
        </span>
        <motion.button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close chat' : 'Open chat with Yawar’s assistant'}
          aria-expanded={open}
          data-cursor="EXPLORE"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gold text-obsidian shadow-[0_0_30px_rgba(212,175,55,0.45)]"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-gold/30" aria-hidden="true" />
          <svg viewBox="0 0 24 24" className="relative h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 5h16v11H9l-5 4V5z" />}
          </svg>
        </motion.button>
      </div>

      {/* Chat drawer */}
      <AnimatePresence>
        {open && (
          <motion.section
            role="dialog"
            aria-label={`Chat with ${config.name}'s assistant`}
            data-lenis-prevent
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 bottom-24 z-[85] flex h-[min(38rem,72vh)] flex-col overflow-hidden rounded-[1.75rem] border border-gold/25 bg-obsidian-2/90 shadow-2xl backdrop-blur-xl sm:inset-x-auto sm:right-6 sm:w-[380px]"
          >
            <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold" />
                </span>
                <div>
                  <p className="font-display text-xl leading-none text-champagne">{config.name.split(' ')[0]}’s Assistant</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ash">Online · replies instantly</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={clearHistory} aria-label="Clear chat history" className="rounded-full p-2 text-ash transition hover:bg-white/5 hover:text-gold">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" /></svg>
                </button>
                <button type="button" onClick={() => setOpen(false)} aria-label="Minimize chat" className="rounded-full p-2 text-ash transition hover:bg-white/5 hover:text-gold">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14" /></svg>
                </button>
              </div>
            </header>

            <div role="log" aria-live="polite" className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {msgs.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === 'user' ? 'rounded-br-sm bg-gold text-obsidian' : 'rounded-bl-sm border border-white/10 bg-white/[0.04] text-champagne/90'
                    }`}
                  >
                    {m.text}
                  </div>

                  {m.card && (
                    <div className="mt-2 w-[85%] rounded-2xl border border-gold/30 bg-white/[0.03] p-4 text-xs text-champagne/85">
                      <p><span className="text-ash">Name:</span> {draft.current.name}</p>
                      <p><span className="text-ash">Email:</span> {draft.current.email}</p>
                      <p className="mt-2 whitespace-pre-line"><span className="text-ash">Message:</span> {draft.current.message}</p>
                      <div className="mt-3 flex gap-2">
                        <button type="button" onClick={() => handleChip(SEND_LABEL)} className="btn-gold !px-4 !py-2 text-xs" disabled={step !== 'confirm'}>
                          {SEND_LABEL}
                        </button>
                        <button type="button" onClick={() => handleChip(CANCEL_LABEL)} className="btn-ghost !px-4 !py-2 text-xs" disabled={step !== 'confirm'}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {m.chips && m.role === 'bot' && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.chips.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => handleChip(c)}
                          className="rounded-full border border-gold/40 px-3 py-1.5 text-left text-xs text-gold-soft transition hover:bg-gold hover:text-obsidian"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {typing && (
                <div className="flex gap-1.5 px-2" aria-label="Assistant is typing">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-white/10 p-4">
              {/* Honeypot: hidden from people, often auto-filled by spam bots */}
              <input
                type="text"
                name="company_website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder}
                aria-label="Message"
                disabled={step === 'sending'}
                maxLength={1500}
                type={step === 'email' ? 'email' : 'text'}
                className="flex-1 rounded-full border border-white/10 bg-obsidian px-4 py-2.5 text-sm text-champagne outline-none transition placeholder:text-ash focus:border-gold disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || step === 'sending'}
                aria-label="Send"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-obsidian transition hover:bg-gold-soft disabled:opacity-40"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
