import { useEffect, useState } from 'react';

const SECTION_IDS = ['archive', 'projects', 'variants'];

export default function useActiveSection() {
  const [activeTarget, setActiveTarget] = useState('archive');

  useEffect(() => {
    const observedSections = SECTION_IDS
      .map((target) => document.getElementById(target))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) setActiveTarget(visibleEntry.target.id);
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.1, 0.25, 0.5] },
    );

    observedSections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return activeTarget;
}
