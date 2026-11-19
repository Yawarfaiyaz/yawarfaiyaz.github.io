import { useCallback, useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './lib/gsap';
import { ConfigProvider } from './context/ConfigContext';
import { ToastProvider } from './context/ToastContext';
import { UiProvider, useUi } from './context/UiContext';
import Preloader from './components/Preloader';
import Cursor from './components/Cursor';
import MovieBackground from './components/MovieBackground';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Learning from './components/Learning';
import Resume from './components/Resume';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import DevCustomizer from './components/DevCustomizer';

function Site() {
  const { fx } = useUi();
  const [ready, setReady] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);

  // Inertial smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync.
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.25, smoothWheel: true, anchors: true });
    lenis.on('scroll', () => ScrollTrigger.update());
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (ready) ScrollTrigger.refresh();
  }, [ready]);

  return (
    <>
      <MovieBackground />
      {fx && <div className="grain" aria-hidden="true" />}
      <Cursor />
      {!ready && <Preloader onDone={handleReady} />}
      <Nav />
      <main>
        <Hero ready={ready} />
        <About />
        <Skills />
        <Projects />
        <Learning />
        <Resume />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
      {import.meta.env.DEV && <DevCustomizer />}
    </>
  );
}

export default function App() {
  return (
    <UiProvider>
      <ConfigProvider>
        <ToastProvider>
          <Site />
        </ToastProvider>
      </ConfigProvider>
    </UiProvider>
  );
}
