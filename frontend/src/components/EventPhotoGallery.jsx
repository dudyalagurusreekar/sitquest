import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2, ImageOff } from 'lucide-react';

/**
 * Public asset URL resolver that safely handles Vite BASE_URL
 * for both local dev ('/') and GitHub Pages subpaths ('/sitquest/').
 */
const resolveAsset = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const base = import.meta.env.BASE_URL || '/';
  const cleanPath = String(path).replace(/^\/+/, '');
  return `${base}${cleanPath}`;
};

/**
 * EventPhotoGallery Component
 *
 * Implements a modern, responsive spotlight photo gallery:
 * - Large, well-spaced spotlight carousel (no cramped/overlapping cards).
 * - Reliable navigation: Prev / Next stage buttons, interactive pagination pills,
 *   smooth touch swiping, and keyboard arrow controls.
 * - Comprehensive Fullscreen Lightbox with Close, Prev, Next, touch swiping,
 *   keyboard navigation, photo counter, and scroll locking.
 * - Robust image loading & graceful fallbacks for missing images.
 * - Performance: Lazy loads non-active slides, avoids unnecessary re-renders.
 */
export default function EventPhotoGallery({
  photos = [],
  eventTitle = 'Event',
  subtitle = 'Highlights from our recent session',
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [failedImages, setFailedImages] = useState({});
  const [loadedImages, setLoadedImages] = useState({});

  const stageRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const lightboxTouchStartRef = useRef({ x: 0, y: 0 });

  const total = photos.length;

  const goTo = useCallback(
    (index) => {
      if (total === 0) return;
      setCurrentIndex(((index % total) + total) % total);
    },
    [total]
  );

  const goNext = useCallback(() => {
    goTo(currentIndex + 1);
  }, [currentIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo(currentIndex - 1);
  }, [currentIndex, goTo]);

  // Lightbox navigation
  const openLightbox = useCallback((index) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const lightboxNext = useCallback(
    (e) => {
      if (e) e.stopPropagation();
      if (total === 0) return;
      setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % total));
    },
    [total]
  );

  const lightboxPrev = useCallback(
    (e) => {
      if (e) e.stopPropagation();
      if (total === 0) return;
      setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + total) % total));
    },
    [total]
  );

  // Auto-play advances every 3.8s when not paused, hovered, or in lightbox
  useEffect(() => {
    if (total <= 1 || isHovered || lightboxIndex !== null) return;
    const timer = setInterval(() => {
      goTo(currentIndex + 1);
    }, 3800);
    return () => clearInterval(timer);
  }, [currentIndex, isHovered, lightboxIndex, total, goTo]);

  // Keyboard navigation for both stage and fullscreen lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex !== null) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') lightboxNext();
        if (e.key === 'ArrowLeft') lightboxPrev();
        return;
      }

      // If stage is focused or active
      if (stageRef.current && stageRef.current.contains(document.activeElement)) {
        if (e.key === 'ArrowRight') goNext();
        if (e.key === 'ArrowLeft') goPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, closeLightbox, lightboxNext, lightboxPrev, goNext, goPrev]);

  // Body scroll lock during fullscreen lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [lightboxIndex]);

  // Touch Swipe handlers for the carousel stage
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  };

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const dt = Date.now() - touchStartRef.current.time;

    // Detect horizontal swipe if deltaX is significant and primarily horizontal
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2 && dt < 600) {
      if (dx < 0) {
        goNext();
      } else {
        goPrev();
      }
    }
  };

  // Touch Swipe handlers for the fullscreen lightbox
  const handleLightboxTouchStart = (e) => {
    const touch = e.touches[0];
    lightboxTouchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleLightboxTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        lightboxNext();
      } else {
        lightboxPrev();
      }
    }
  };

  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <section
      className="relative my-10 sm:my-14 overflow-hidden rounded-3xl border border-white/10 bg-[#0d0a17]/80 p-4 sm:p-7 md:p-8 backdrop-blur-xl shadow-2xl"
      aria-label={`${eventTitle} Photo Gallery`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="mb-4 sm:mb-5 flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#A879E6]/30 bg-[#8244B3]/15 px-3 py-0.5 text-[11px] font-mono tracking-widest text-[#2EEED0] uppercase">
            <span>Photo Archive</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#2EEED0] animate-pulse" />
          </div>
          <h2 className="mt-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Event Photos
          </h2>
          <p className="mt-0.5 text-xs sm:text-sm text-[#CBD5E1]/70">{subtitle}</p>
        </div>
      </div>

      {/* Main Spotlight Stage */}
      <div
        ref={stageRef}
        tabIndex={0}
        aria-label="Event photos carousel. Use Left and Right arrow keys to navigate."
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="group relative flex w-full items-center justify-center outline-none select-none h-[280px] sm:h-[360px] md:h-[420px] lg:h-[450px]"
      >
        {/* Floating Side Nav Arrow Left */}
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous photo slide"
          className="absolute left-1 sm:left-3 z-30 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/15 bg-[#1A0F2E]/85 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-[#A879E6] hover:bg-[#23143E] active:scale-95 shadow-[0_8px_25px_rgba(0,0,0,0.5)] cursor-pointer"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Carousel Cards Container */}
        <div className="relative flex h-full w-full max-w-5xl items-center justify-center">
          {photos.map((photo, i) => {
            let offset = (((i - currentIndex) % total) + total) % total;
            if (offset > total / 2) offset -= total;

            const isCurrent = offset === 0;
            const isLeft = offset === -1;
            const isRight = offset === 1;
            const isVisible = isCurrent || isLeft || isRight;

            const src = resolveAsset(photo.src);
            const isFailed = failedImages[src];
            const isLoaded = loadedImages[src];
            const title = photo.title || photo.name || photo.alt || `Photo ${i + 1}`;

            if (!isVisible) return null;

            return (
              <div
                key={photo.src || i}
                onClick={() => {
                  if (isCurrent) {
                    openLightbox(i);
                  } else {
                    goTo(i);
                  }
                }}
                className={`absolute transition-all duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] cursor-pointer ${
                  isCurrent
                    ? 'z-20 h-full max-w-3xl scale-100 opacity-100 translate-x-0'
                    : isLeft
                    ? 'z-10 h-[88%] -translate-x-[42%] sm:-translate-x-[48%] md:-translate-x-[52%] scale-[0.88] opacity-45 hover:opacity-80 pointer-events-auto'
                    : 'z-10 h-[88%] translate-x-[42%] sm:translate-x-[48%] md:translate-x-[52%] scale-[0.88] opacity-45 hover:opacity-80 pointer-events-auto'
                }`}
                style={{
                  filter: isCurrent ? 'drop-shadow(0 20px 35px rgba(0,0,0,0.65))' : 'none',
                }}
              >
                <div
                  className={`group/card relative aspect-[16/10] h-full overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isCurrent
                      ? 'border-[#A879E6]/60 bg-[#1A0F2E]/70 shadow-[0_0_35px_rgba(168,121,230,0.2)]'
                      : 'border-white/10 bg-[#160d26]/80'
                  }`}
                >
                  {/* Image Skeleton / Loading Placeholder */}
                  {!isLoaded && !isFailed && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#170e28] animate-pulse">
                      <div className="h-8 w-8 rounded-full border-2 border-[#A879E6]/40 border-t-[#2EEED0] animate-spin" />
                    </div>
                  )}

                  {/* Clean Graceful Fallback Card */}
                  {isFailed ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center bg-gradient-to-br from-[#23143E] via-[#1A0F2E] to-[#0B0B14]">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#A879E6]">
                        <ImageOff className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-semibold text-white/90">{title}</p>
                      <span className="text-xs text-[#CBD5E1]/50">{eventTitle} Archive</span>
                    </div>
                  ) : (
                    <img
                      src={src}
                      alt={title}
                      loading={isCurrent ? 'eager' : 'lazy'}
                      decoding="async"
                      className={`h-full w-full object-cover transition-all duration-700 ease-out group-hover/card:scale-105 ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => setLoadedImages((prev) => ({ ...prev, [src]: true }))}
                      onError={() => setFailedImages((prev) => ({ ...prev, [src]: true }))}
                    />
                  )}

                  {/* Discreet Zoom Pill on Active Photo */}
                  {isCurrent && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openLightbox(i);
                        }}
                        aria-label="Zoom photo"
                        className="flex items-center gap-1.5 rounded-full border border-white/25 bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md shadow-lg transition duration-200 hover:scale-105 hover:bg-black/80 hover:border-[#A879E6] active:scale-95"
                      >
                        <Maximize2 className="h-3.5 w-3.5 text-[#2EEED0]" />
                        <span>Zoom</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Side Nav Arrow Right */}
        <button
          type="button"
          onClick={goNext}
          aria-label="Next photo slide"
          className="absolute right-1 sm:right-3 z-30 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/15 bg-[#1A0F2E]/85 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-[#A879E6] hover:bg-[#23143E] active:scale-95 shadow-[0_8px_25px_rgba(0,0,0,0.5)] cursor-pointer"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Interactive Pagination Indicator */}
      <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-2">
        {photos.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Jump to photo ${i + 1}`}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full h-2 ${
              i === currentIndex
                ? 'w-8 bg-gradient-to-r from-[#2EEED0] to-[#A879E6] shadow-[0_0_12px_rgba(46,238,208,0.5)]'
                : 'w-2.5 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* ==================== FULLSCREEN LIGHTBOX MODAL ==================== */}
      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${eventTitle} enlarged photo`}
          onClick={closeLightbox}
          onTouchStart={handleLightboxTouchStart}
          onTouchEnd={handleLightboxTouchEnd}
          className="fixed inset-0 z-[1000] flex min-h-[100dvh] items-center justify-center bg-black/95 p-3 sm:p-6 backdrop-blur-xl animate-in fade-in duration-200"
        >
          {/* Top Bar with Counter and Close button */}
          <div
            className="absolute top-0 inset-x-0 z-30 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-mono text-[#2EEED0]">
                {lightboxIndex + 1} / {total}
              </span>
            </div>

            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close photo viewer (Press Escape)"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 hover:scale-105 active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Left Arrow in Lightbox */}
          <button
            type="button"
            onClick={lightboxPrev}
            aria-label="Previous photo (Press Left Arrow)"
            className="absolute left-2 sm:left-6 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition hover:bg-[#8244B3]/40 hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          {/* Lightbox Center Image / Fallback */}
          <div
            className="relative flex max-h-[82dvh] max-w-[92vw] items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {failedImages[resolveAsset(photos[lightboxIndex]?.src)] ? (
              <div className="flex aspect-[16/10] w-[min(90vw,720px)] flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#1A0F2E] p-8 text-center shadow-2xl">
                <ImageOff className="h-10 w-10 text-[#A879E6]" />
                <p className="text-lg font-bold text-white">
                  {photos[lightboxIndex]?.title || 'Photo Unavailable'}
                </p>
                <p className="text-xs text-[#CBD5E1]/60">
                  The image file could not be loaded from the archive.
                </p>
              </div>
            ) : (
              <img
                src={resolveAsset(photos[lightboxIndex]?.src)}
                alt={photos[lightboxIndex]?.alt || photos[lightboxIndex]?.title || eventTitle}
                className="max-h-[80dvh] max-w-[90vw] rounded-2xl object-contain shadow-[0_25px_70px_rgba(0,0,0,0.85)] border border-white/10"
              />
            )}
          </div>

          {/* Right Arrow in Lightbox */}
          <button
            type="button"
            onClick={lightboxNext}
            aria-label="Next photo (Press Right Arrow)"
            className="absolute right-2 sm:right-6 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition hover:bg-[#8244B3]/40 hover:scale-110 active:scale-95"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>
      )}
    </section>
  );
}
