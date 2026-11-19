import { useId, useRef } from 'react';
import { gsap } from '../lib/gsap';

/** Image with a liquid displacement distortion that ripples on hover. */
export default function LiquidImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const filterId = `liquid-${useId().replace(/:/g, '')}`;
  const displacement = useRef<SVGFEDisplacementMapElement>(null);

  const onEnter = () => {
    if (displacement.current) gsap.to(displacement.current, { attr: { scale: 42 }, duration: 0.6, ease: 'power2.out' });
  };
  const onLeave = () => {
    if (displacement.current) gsap.to(displacement.current, { attr: { scale: 0 }, duration: 1, ease: 'power3.out' });
  };

  return (
    <>
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={2} seed={3} result="noise" />
            <feDisplacementMap ref={displacement} in="SourceGraphic" in2="noise" scale={0} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <img
        src={src}
        alt={alt}
        loading="eager"
        data-cursor="VIEW"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        style={{ filter: `url(#${filterId})` }}
        className={`ken-burns h-full w-full object-cover ${className}`}
      />
    </>
  );
}
