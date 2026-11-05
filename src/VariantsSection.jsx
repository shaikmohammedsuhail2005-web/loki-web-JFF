import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import './VariantsSection.css';
import LokiLogo from './LokiLogo.jsx';
import useActiveSection from './useActiveSection.js';

const variants = [
  {
    id: 'sylvie',
    number: '01',
    name: 'SYLVIE',
    heading: 'A different Loki.',
    accent: 'A different destiny.',
    description:
      'Born outside the sacred timeline, Sylvie chose her own path and changed the fate of the TVA forever.',
    image: '/images/sylvie-loki.jpg',
    imageAlt: 'Sylvie, a Loki variant wearing her horned headpiece',
    imagePosition: 'center 34%',
  },
  {
    id: 'alligator',
    number: '02',
    name: 'ALLIGATOR LOKI',
    heading: 'A bite-sized Loki.',
    accent: 'With a glorious bite.',
    description:
      'A mischievous alligator from the Void. Never underestimate a variant with horns, teeth, and a taste for trouble.',
    image: '/images/alligator-loki.jpg',
    imageAlt: 'Alligator Loki wearing his small horned crown',
    imagePosition: 'center 48%',
  },
  {
    id: 'kid',
    number: '03',
    name: 'KID LOKI',
    heading: 'Youngest of the Lokis.',
    accent: 'A king in his own right.',
    description:
      'After one fateful choice changed everything, Kid Loki carved out a kingdom among the lost variants of the Void.',
    image: '/images/kid-loki.jpg',
    imageAlt: 'Kid Loki in his TVA variant outfit',
    imagePosition: 'center 35%',
  },
  {
    id: 'classic',
    number: '04',
    name: 'CLASSIC LOKI',
    heading: 'The last illusion.',
    accent: 'A legend in the Void.',
    description:
      'After surviving Thanos with a convincing illusion, Classic Loki lived in isolation for centuries. When the TVA sent him to the Void, he made one final stand against Alioth to give Loki and Sylvie a chance.',
    image: '/images/classic-loki-variant.jpg',
    imageAlt: 'Classic Loki in his golden horned helmet, surrounded by green magic',
    imagePosition: 'center 48%',
  },
  {
    id: 'president',
    number: '05',
    name: 'PRESIDENT LOKI',
    heading: 'A throne in the Void.',
    accent: 'Power has its price.',
    description:
      "In the Void, President Loki rallies a gang of variants and schemes to take Kid Loki's throne. His bid for power collapses when his own followers turn on him, and Alligator Loki bites off his right hand.",
    image: '/images/president-loki-variant.jpg',
    imageAlt: 'President Loki in a green suit and horned crown',
    imagePosition: 'center 48%',
  },
];

const variantCount = String(variants.length).padStart(2, '0');

const navigation = [
  { label: 'HOME', href: '#top', id: 'top' },
  { label: 'MEMORIES', href: '#archive', id: 'archive' },
  { label: 'PROJECTS', href: '#projects', id: 'projects' },
  { label: 'VARIANTS', href: '#variants', id: 'variants' },
];

function ArrowIcon({ direction }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {direction === 'left' ? (
        <path d="M19 12H5m0 0 7-7m-7 7 7 7" />
      ) : (
        <path d="M5 12h14m0 0-7-7m7 7-7 7" />
      )}
    </svg>
  );
}

export default function VariantsSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hingeArtRevealed, setHingeArtRevealed] = useState(false);
  const [hingeArtOpen, setHingeArtOpen] = useState(true);
  const hingeRevealRef = useRef(null);
  const activeTarget = useActiveSection();
  const reduceMotion = useReducedMotion();
  const selectedVariant = variants[selectedIndex];
  const transition = reduceMotion
    ? { duration: 0.01 }
    : { duration: 0.5, ease: [0.22, 0.68, 0.2, 1] };

  useEffect(() => {
    if (reduceMotion) {
      setHingeArtRevealed(true);
      return undefined;
    }

    const section = hingeRevealRef.current;
    if (!section) {
      setHingeArtRevealed(true);
      return undefined;
    }

    const revealWhenVisible = () => {
      const bounds = section.getBoundingClientRect();
      if (bounds.top < window.innerHeight * 0.95 && bounds.bottom > window.innerHeight * 0.05) {
        setHingeArtRevealed(true);
        window.removeEventListener('scroll', revealWhenVisible);
      }
    };

    window.addEventListener('scroll', revealWhenVisible, { passive: true });
    revealWhenVisible();
    return () => window.removeEventListener('scroll', revealWhenVisible);
  }, [reduceMotion]);

  function selectVariant(index) {
    setSelectedIndex((index + variants.length) % variants.length);
  }

  return (
    <section
      ref={hingeRevealRef}
      className={`variants-showcase variants-showcase--${selectedVariant.id}`}
      id="variants"
      aria-labelledby="variants-title"
    >
      <div className="variants-showcase__orbit variants-showcase__orbit--one" aria-hidden="true" />
      <div className="variants-showcase__orbit variants-showcase__orbit--two" aria-hidden="true" />
      <img
        className="variants-wall-art"
        src="/images/loki-left-wall.png"
        alt="Loki in profile wearing his horned helmet"
      />

      <div className="variants-showcase__shell">
        <header className="variants-header">
          <LokiLogo className="variants-header__brand" />

          <nav className="variants-header__nav" aria-label="Section navigation">
            {navigation.map(({ label, href, id }) => (
              <a
                className={activeTarget === id ? 'is-active' : ''}
                href={href}
                key={id}
                aria-current={activeTarget === id ? 'location' : undefined}
              >
                {label}
              </a>
            ))}
          </nav>

          <a className="variants-header__cta" href="#archive">
            TVA ARCHIVE <span aria-hidden="true">↗</span>
          </a>
        </header>

        <div className="variants-showcase__body">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              className="variants-copy"
              key={selectedVariant.id}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -10 }}
              transition={transition}
              aria-live="polite"
            >
              <p className="variants-copy__eyebrow">A TVA FILE / {selectedVariant.number}</p>
              <h2 className="variants-title" id="variants-title">
                <span>{selectedVariant.heading}</span>
                <span className="variants-title__accent">{selectedVariant.accent}</span>
              </h2>
              <p className="variants-description">{selectedVariant.description}</p>

              <div className="variants-actions">
                <a className="variants-button variants-button--primary" href="#archive">
                  EXPLORE MEMORIES <span aria-hidden="true">→</span>
                </a>
                <a className="variants-button variants-button--secondary" href="#projects">
                  <span className="variants-button__play" aria-hidden="true">↗</span>
                  TVA ARCHIVE
                </a>
              </div>

            </motion.div>
          </AnimatePresence>

          <div className="variants-stage" aria-live="polite">
            <div className="variants-stage__glow" aria-hidden="true" />
            <div className="variants-stage__shape" aria-hidden="true" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                className="variants-portrait"
                key={selectedVariant.id}
                initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96, x: reduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.98, x: reduceMotion ? 0 : -14 }}
                transition={transition}
              >
                <img
                  src={selectedVariant.image}
                  alt={selectedVariant.imageAlt}
                  style={{ objectPosition: selectedVariant.imagePosition }}
                />
                <span className="variants-portrait__shade" aria-hidden="true" />
                <figcaption className="variants-portrait__caption">
                  <span>LOKI VARIANTS</span>
                  <span>{selectedVariant.number} / {variantCount}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="variants-switcher" role="group" aria-label="Choose a Loki variant">
            <button
              className="variants-switcher__step"
              type="button"
              onClick={() => selectVariant(selectedIndex - 1)}
              aria-label="Previous Loki variant"
            >
              <span aria-hidden="true">⌃</span>
            </button>
            {variants.map((variant, index) => (
              <button
                className={`variants-switcher__thumb ${index === selectedIndex ? 'is-active' : ''}`}
                key={variant.id}
                type="button"
                onClick={() => selectVariant(index)}
                aria-label={`Show ${variant.name}`}
                aria-pressed={index === selectedIndex}
              >
                <img src={variant.image} alt="" />
                <span>{variant.number}</span>
              </button>
            ))}
            <button
              className="variants-switcher__step variants-switcher__step--down"
              type="button"
              onClick={() => selectVariant(selectedIndex + 1)}
              aria-label="Next Loki variant"
            >
              <span aria-hidden="true">⌄</span>
            </button>
          </div>
        </div>

        <footer className="variants-footer">
          <div className="variants-pagination" role="group" aria-label="Choose a variant">
            {variants.map((variant, index) => (
              <button
                className={index === selectedIndex ? 'is-active' : ''}
                key={variant.id}
                type="button"
                onClick={() => selectVariant(index)}
                aria-label={`Go to ${variant.name}`}
                aria-current={index === selectedIndex ? 'step' : undefined}
              />
            ))}
          </div>
          <div className="variants-footer__controls">
            <span>{selectedVariant.number} <span>/ {variantCount}</span></span>
            <button type="button" onClick={() => selectVariant(selectedIndex - 1)} aria-label="Previous Loki variant">
              <ArrowIcon direction="left" />
            </button>
            <button type="button" onClick={() => selectVariant(selectedIndex + 1)} aria-label="Next Loki variant">
              <ArrowIcon direction="right" />
            </button>
          </div>
        </footer>
      </div>
      <div className="variants-hinge-art">
        <motion.img
          className="variants-hinge-art__image"
          src="/images/loki-hinge-reveal.png"
          alt=""
          initial={reduceMotion ? false : { opacity: 0, rotateX: -88, y: 48 }}
          animate={!hingeArtRevealed
            ? { opacity: 0, rotateX: -88, y: 48, scale: 0.94 }
            : hingeArtOpen
              ? { opacity: 1, rotateX: 0, y: 0, scale: 1 }
              : { opacity: 0.84, rotateX: -72, y: 22, scale: 0.86 }}
          transition={{ duration: reduceMotion ? 0.01 : 1.05, ease: [0.2, 0.8, 0.2, 1] }}
          style={{ transformPerspective: 900, transformOrigin: '50% 100%' }}
        />
        <button
          className="variants-hinge-art__toggle"
          type="button"
          disabled={!hingeArtRevealed}
          onClick={() => setHingeArtOpen((open) => !open)}
          aria-label={hingeArtOpen ? 'Fold Loki artwork down' : 'Hinge Loki artwork up'}
          aria-pressed={hingeArtOpen}
        />
      </div>
    </section>
  );
}
