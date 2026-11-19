import Reveal from './Reveal';

export default function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal className="mb-16 max-w-3xl">
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2 className="display text-5xl md:text-7xl">{title}</h2>
    </Reveal>
  );
}
