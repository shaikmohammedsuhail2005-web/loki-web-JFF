import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import './App.css';
import ArchiveSection from './src/ArchiveSection.jsx';
import LokiLogo from './src/LokiLogo.jsx';
import VariantsSection from './src/VariantsSection.jsx';

const initialTitleFonts = {
  l: { family: 'Anton', weight: 400, duration: 0.3 },
  o: { family: 'Playfair Display', weight: 700, strokeWidth: 1.2, duration: 0.3 },
  k: { family: 'Noto Serif JP', weight: 700, strokeWidth: 1.15, duration: 0.3 },
  i: { family: 'Press Start 2P', weight: 400, duration: 0.3 },
};

const titleFontSequence = {
  l: [
    { at: 450, family: 'Oswald', weight: 700 },
    { at: 1050, family: 'Caveat', weight: 700 },
    { at: 1650, family: 'UnifrakturCook', weight: 700 },
    { at: 2250, family: 'Barlow Condensed', weight: 700 },
    { at: 2850, family: 'OCR A Extended', weight: 400 },
    { at: 3450, family: 'Cinzel', weight: 600 },
  ],
  o: [
    { at: 520, family: 'Barlow Condensed', weight: 700, strokeWidth: 1.55 },
    { at: 1120, family: 'Caveat', weight: 700, strokeWidth: 1.35 },
    { at: 1720, family: 'UnifrakturCook', weight: 700, strokeWidth: 1.2 },
    { at: 2320, family: 'Cormorant Garamond', weight: 700, strokeWidth: 1.1 },
    { at: 2920, family: 'OCR A Extended', weight: 400, strokeWidth: 1.4 },
    { at: 3520, family: 'Tangerine', weight: 700, strokeWidth: 1.05 },
  ],
  k: [
    { at: 590, family: 'Cinzel', weight: 600, strokeWidth: 1.2 },
    { at: 1190, family: 'UnifrakturCook', weight: 700, strokeWidth: 1.15 },
    { at: 1790, family: 'Oswald', weight: 700, strokeWidth: 1.5 },
    { at: 2390, family: 'OCR A Extended', weight: 400, strokeWidth: 1.2 },
    { at: 2990, family: 'Playfair Display', weight: 700, strokeWidth: 1.2 },
    { at: 3590, family: 'Cormorant Garamond', weight: 700, strokeWidth: 1.05 },
  ],
  i: [
    { at: 660, family: 'DotGothic16', weight: 400 },
    { at: 1260, family: 'Tangerine', weight: 700 },
    { at: 1860, family: 'Cormorant Garamond', weight: 700 },
    { at: 2460, family: 'OCR A Extended', weight: 400 },
    { at: 3060, family: 'Playfair Display', weight: 700 },
    { at: 3660, family: 'Oswald', weight: 700 },
  ],
};

function FontMorph({ letter, font, className }) {
  return (
    <span className={`hero__letter ${className}`}>
      <AnimatePresence mode="sync" initial={false}>
        <motion.span
          className="hero__font-morph"
          key={`${font.family}-${font.weight}`}
          initial={{ opacity: 0, filter: 'blur(3px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(2px)' }}
          transition={{ duration: font.duration, ease: 'easeInOut' }}
          style={{ fontFamily: `"${font.family}", sans-serif`, fontWeight: font.weight }}
        >
          {letter}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function CrescentLetter({ font }) {
  return (
    <svg className="hero__letter hero__letter--o" viewBox="0 0 300 400" aria-hidden="true">
      <defs>
        <clipPath id="o-crescent-clip">
          <path d="M154 0 C205 95 205 305 154 400 L300 400 L300 0 Z" />
        </clipPath>
      </defs>
      <AnimatePresence mode="sync" initial={false}>
        <motion.g
          key={`${font.family}-${font.weight}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: font.duration, ease: 'easeInOut' }}
          style={{
            fontFamily: `"${font.family}", sans-serif`,
            fontWeight: font.weight,
            '--hero-outline-width': font.strokeWidth,
          }}
        >
          <text
            className="hero__o-crescent"
            x="150"
            y="350"
            textAnchor="middle"
            textLength="268"
            lengthAdjust="spacingAndGlyphs"
            clipPath="url(#o-crescent-clip)"
          >
            O
          </text>
          <text
            className="hero__o-outline"
            x="150"
            y="350"
            textAnchor="middle"
            textLength="268"
            lengthAdjust="spacingAndGlyphs"
          >
            O
          </text>
        </motion.g>
      </AnimatePresence>
    </svg>
  );
}

function OutlineLetter({ font }) {
  return (
    <span className="hero__letter hero__letter--k">
      <svg viewBox="0 0 300 400" aria-hidden="true">
        <AnimatePresence mode="sync" initial={false}>
          <motion.text
            className="hero__k-glyph"
            key={`${font.family}-${font.weight}`}
            x="150"
            y="350"
            textAnchor="middle"
            textLength="268"
            lengthAdjust="spacingAndGlyphs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: font.duration, ease: 'easeInOut' }}
            style={{
              fontFamily: `"${font.family}", sans-serif`,
              fontWeight: font.weight,
              '--hero-outline-width': font.strokeWidth,
            }}
          >
            K
          </motion.text>
        </AnimatePresence>
      </svg>
    </span>
  );
}

function AnimatedTitle() {
  const [fonts, setFonts] = useState(initialTitleFonts);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    let active = true;
    const timers = [];
    const startSequence = () => {
      if (!active) return;

      Object.entries(titleFontSequence).forEach(([letter, changes]) => {
        changes.forEach(({ at, family, weight, strokeWidth, duration = 0.18 }) => {
          timers.push(window.setTimeout(() => {
            if (!active) return;
            setFonts((currentFonts) => ({
              ...currentFonts,
              [letter]: { family, weight, strokeWidth, duration },
            }));
          }, at));
        });
      });
    };

    startSequence();

    return () => {
      active = false;
      timers.forEach(window.clearTimeout);
    };
  }, [prefersReducedMotion]);

  return (
    <h1 className="hero__title" id="hero-title" aria-label="LOKI">
      <FontMorph letter="L" font={fonts.l} className="hero__letter--l hero__letter--solid" />
      <CrescentLetter font={fonts.o} />
      <OutlineLetter font={fonts.k} />
      <FontMorph letter="I" font={fonts.i} className="hero__letter--last hero__letter--solid" />
    </h1>
  );
}

export default function App() {
  const videoRef = useRef(null);
  const siteRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const [videoFailed, setVideoFailed] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [introPlaying, setIntroPlaying] = useState(false);
  const [introExiting, setIntroExiting] = useState(false);

  useEffect(() => {
    if (!introVisible) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIntroVisible(false);
      return undefined;
    }

    const previousOverflowY = document.body.style.overflowY;
    const site = siteRef.current;
    if (site) site.inert = true;
    document.body.style.overflowY = 'hidden';

    setIntroPlaying(true);
    const exitTimer = window.setTimeout(() => setIntroExiting(true), 1780);
    const removeTimer = window.setTimeout(() => setIntroVisible(false), 2300);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
      document.body.style.overflowY = previousOverflowY;
      if (site) site.inert = false;
    };
  }, [introVisible]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion || introVisible) return;

    // Autoplay starts muted because browsers usually block autoplay with sound.
    const playRequest = video.play();
    if (playRequest?.catch) {
      playRequest.catch(() => {
        // The poster remains visible if the browser blocks autoplay.
      });
    }
  }, [introVisible, prefersReducedMotion]);

  return (
    <>
      <div ref={siteRef} className="site-page" aria-hidden={introVisible}>
        <main className="hero" id="top">
          <LokiLogo className="hero-logo" />
          <div className="hero__poster" aria-hidden="true" />

          {!videoFailed && (
            <video
              ref={videoRef}
              className="hero__video"
              muted
              loop
              playsInline
              preload="none"
              poster="/images/loki-poster.jpg"
              onError={() => setVideoFailed(true)}
              aria-label="Cinematic Loki hero background"
            >
              <source src="/videos/loki-hero.mp4" type="video/mp4" />
            </video>
          )}

          <div className="hero__shade" aria-hidden="true" />
          <div className="hero__ambient" aria-hidden="true" />

          <section className="hero__content" aria-labelledby="hero-title">
            <AnimatedTitle />

            <p className="hero__subtitle">God of Stories</p>
          </section>

        </main>
        <ArchiveSection />
        <VariantsSection />
      </div>
      {introVisible && (
        <div
          className={`loki-intro${introPlaying ? ' loki-intro--playing' : ''}${introExiting ? ' loki-intro--exiting' : ''}`}
          role="status"
          aria-label="Assembling Loki emblem"
        >
          <div className="loki-intro__stage">
            <img className="loki-intro__layer loki-intro__base" src="/assets/loki-base.png" alt="" onError={() => setIntroVisible(false)} />
            <img className="loki-intro__layer loki-intro__horn loki-intro__horn--left" src="/assets/horn-left.png" alt="" onError={() => setIntroVisible(false)} />
            <img className="loki-intro__layer loki-intro__horn loki-intro__horn--right" src="/assets/horn-right.png" alt="" onError={() => setIntroVisible(false)} />
          </div>
        </div>
      )}
    </>
  );
}
