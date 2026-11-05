import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import './LowerSections.css';
import useActiveSection from './useActiveSection.js';
import LokiLogo from './LokiLogo.jsx';

const archiveItems = [
  {
    number: '01',
    title: 'M1 LOKI',
    className: 'memory-card--m1',
    video: '/videos/m1-loki.mp4',
    poster: '/images/m1-loki-poster.jpg',
  },
  {
    number: '02',
    title: 'M2 LOKI',
    className: 'memory-card--m2',
    video: '/videos/m2-loki.mp4',
    poster: '/images/m2-loki-poster.jpg',
  },
  {
    number: '03',
    title: 'M3 LOKI',
    className: 'memory-card--m3',
    video: '/videos/m3-loki.mp4',
    poster: '/images/m3-loki-poster.jpg',
  },
  {
    number: '04',
    title: 'M4 LOKI',
    className: 'memory-card--m4',
    video: '/videos/m4-loki.mp4',
    poster: '/images/m4-loki-poster.jpg',
  },
  {
    number: '05',
    title: 'M5 LOKI',
    className: 'memory-card--m5',
    video: '/videos/m5-loki.mp4',
    poster: '/images/m5-loki-poster.jpg',
  },
  {
    number: '06',
    title: 'M6 LOKI',
    className: 'memory-card--m6',
    video: '/videos/m6-loki.mp4',
    poster: '/images/m6-loki-poster.jpg',
  },
  {
    number: '07',
    title: 'COOL LOKI',
    className: 'memory-card--cool',
    video: '/videos/cool-loki.mp4',
    poster: '/images/cool-loki-poster.jpg',
  },
  {
    number: '08',
    title: 'THE GLORIOUS PATH',
    className: 'memory-card--glorious',
    video: '/videos/glorious-path.mp4',
    poster: '/images/glorious-path-poster.jpg',
  },
  {
    number: '09',
    title: 'CLASSIC LOKI',
    className: 'memory-card--classic',
    video: '/videos/classic-loki.mp4',
    poster: '/images/classic-loki-poster.jpg',
  },
];

const navigation = [
  { label: 'MEMORIES', target: 'archive' },
  { label: 'PROJECTS', target: 'projects' },
  { label: 'VARIANTS', target: 'variants' },
];

const MAX_ACTIVE_PREVIEWS = 2;

export default function ArchiveSection() {
  const sectionRef = useRef(null);
  const collageRef = useRef(null);
  const openerRef = useRef(null);
  const [activeMemory, setActiveMemory] = useState(null);
  const activeTarget = useActiveSection();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    if (!('IntersectionObserver' in window)) {
      section.classList.add('is-visible');
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        section.classList.add('is-visible');
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const collage = collageRef.current;
    if (!collage || reduceMotion || activeMemory || !('IntersectionObserver' in window)) {
      collage?.querySelectorAll('video[data-memory-preview]').forEach((video) => video.pause());
      return undefined;
    }

    const videos = [...collage.querySelectorAll('video[data-memory-preview]')];
    const visibleVideos = new Set();
    const syncPlayback = () => {
      const { innerHeight, innerWidth } = window;
      const centerX = innerWidth / 2;
      const centerY = innerHeight / 2;
      const activeVideos = [...visibleVideos]
        .sort((a, b) => {
          const aFeatured = a.closest('.memory-card')?.classList.contains('memory-card--glorious') ? 1 : 0;
          const bFeatured = b.closest('.memory-card')?.classList.contains('memory-card--glorious') ? 1 : 0;
          if (aFeatured !== bFeatured) return bFeatured - aFeatured;

          const aRect = a.getBoundingClientRect();
          const bRect = b.getBoundingClientRect();
          const aDistance = Math.hypot(aRect.x + aRect.width / 2 - centerX, aRect.y + aRect.height / 2 - centerY);
          const bDistance = Math.hypot(bRect.x + bRect.width / 2 - centerX, bRect.y + bRect.height / 2 - centerY);
          return aDistance - bDistance;
        })
        .slice(0, MAX_ACTIVE_PREVIEWS);
      const activeSet = new Set(activeVideos);

      videos.forEach((video) => {
        if (activeSet.has(video)) {
          if (video.paused) {
            video.play().catch(() => {
              // Browsers can deny preview autoplay; the poster remains visible.
            });
          }
        } else if (!video.paused) {
          video.pause();
        }
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          visibleVideos.add(video);
        } else {
          visibleVideos.delete(video);
        }
      });
      syncPlayback();
    }, { threshold: 0.01 });

    videos.forEach((video) => observer.observe(video));
    return () => observer.disconnect();
  }, [activeMemory, reduceMotion]);

  useEffect(() => {
    if (!activeMemory) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setActiveMemory(null);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
      openerRef.current?.focus();
    };
  }, [activeMemory]);

  function openMemory(memory, event) {
    openerRef.current = event.currentTarget;
    collageRef.current?.querySelectorAll('video[data-memory-preview]').forEach((video) => video.pause());
    setActiveMemory(memory);
  }

  return (
    <section className="lower-section archive-section" id="archive" ref={sectionRef} aria-labelledby="archive-title">
      <div className="section-frame">
        <div className="section-topline">
          <LokiLogo className="section-brand" />
          <nav className="section-nav" aria-label="Section navigation">
            {navigation.map(({ label, target }) => (
              <a
                key={target}
                href={`#${target}`}
                className={activeTarget === target ? 'is-active' : ''}
                aria-current={activeTarget === target ? 'location' : undefined}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        <div className="archive-collage" id="projects" ref={collageRef}>
          <img
            className="archive-collage__art"
            src="/images/memories-frame-collage.png"
            alt=""
            aria-hidden="true"
          />
          <div className="archive-copy">
            <p className="section-kicker">LOKI THROUGH THE YEARS</p>
            <h2 className="lower-heading" id="archive-title">MEMORIES</h2>
            <p className="archive-description">
              Relive the moments and variants that shaped Loki&apos;s journey across the multiverse.
            </p>
            <a className="outline-cta" href="#projects">
              EXPLORE THE ARCHIVE <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="archive-cards">
            {archiveItems.map((memory, index) => (
              <button
                className={`memory-card ${memory.className}`}
                key={memory.number}
                type="button"
                style={{ '--memory-order': index }}
                onClick={(event) => openMemory(memory, event)}
                aria-label={`Open archive ${memory.number}: ${memory.title}`}
              >
                <video
                  src={memory.video}
                  poster={memory.poster}
                  muted
                  loop
                  playsInline
                  preload="none"
                  data-memory-preview
                  aria-hidden="true"
                />
                <span className="memory-card__veil" aria-hidden="true" />
                <img
                  className="memory-card__frame"
                  src="/images/memories-video-frame-v2.png"
                  alt=""
                  aria-hidden="true"
                />
                <span className="memory-card__number">ARCHIVE / {memory.number}</span>
                <span className="memory-card__title">{memory.title}</span>
                <span className="memory-card__open" aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {activeMemory && (
          <motion.div
            className="memory-modal"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.22 }}
            onClick={(event) => {
              if (event.target === event.currentTarget) setActiveMemory(null);
            }}
          >
            <motion.div
              className="memory-modal__panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="memory-modal-title"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 18, scale: reduceMotion ? 1 : 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : 12, scale: reduceMotion ? 1 : 0.98 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.28 }}
            >
              <button
                className="memory-modal__close"
                type="button"
                onClick={() => setActiveMemory(null)}
                aria-label="Close memory"
                autoFocus
              >
                ×
              </button>
              <p className="memory-modal__eyebrow">ARCHIVE / {activeMemory.number}</p>
              <h2 className="memory-modal__title" id="memory-modal-title">{activeMemory.title}</h2>
              <video
                className="memory-modal__video"
                key={activeMemory.video}
                src={activeMemory.video}
                poster={activeMemory.poster}
                controls
                autoPlay
                playsInline
                preload="metadata"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
