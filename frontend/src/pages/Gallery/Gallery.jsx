import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, ImageOff, ZoomIn } from "lucide-react";

const YEARS = ["2024", "2025", "2026", "2027"];

const PHOTOS_BY_YEAR = {
  2024: [
    "IMG-20240412-WA0045.jpg",
    "IMG-20240519-WA0053.jpg",
    "IMG-20240528-WA0168.jpg",
    "IMG20240429192709.jpg",
    "IMG_0745.jpg",
  ],
  2025: [
    "1757959241888.jpg",
    "20250619_211825.jpg",
    "20250619_213500.jpg",
    "20250914_181406.jpg",
    "20250914_181835.jpg",
    "20250914_182615(0).jpg",
    "20250914_192119.jpg",
    "20250914_192415.jpg",
    "20260606_152126.jpg",
    "20260606_175517.jpg",
    "3ba0b52b-11c3-4e96-82fa-be36690f92a6.jpg",
    "IMG_0755.jpg",
    "IMG_2051.jpg",
    "IMG_2110.jpg",
    "IMG_2132.jpg",
    "IMG_2135.JPG",
    "IMG_2139.jpg",
    "IMG_2901.jpg",
  ],
  2026: [
    "20260606_174321.jpg",
    "20260606_175216.jpg",
    "20260606_175515.jpg",
    "IMG_0732.jpg",
    "IMG_0737.jpg",
    "IMG_0762.jpg",
    "IMG_0798.jpg",
    "IMG_0839.jpg",
    "IMG_0858.jpg",
    "IMG_2697.jpg",
    "IMG_2733.jpg",
    "IMG_2738.jpg",
    "WhatsApp Image 2026-11-14 at 22.19.34.jpeg",
    "WhatsApp Image 2026-11-14 at 22.19.35.jpeg",
  ],
  2027: [
    "WhatsApp Image 2026-11-14 at 22.14.34.jpeg",
    "WhatsApp Image 2026-11-14 at 22.14.35.jpeg",
    "WhatsApp Image 2026-11-14 at 22.14.36.jpeg",
    "WhatsApp Image 2026-11-14 at 22.14.38.jpeg",
    "WhatsApp Image 2026-11-14 at 22.14.39.jpeg",
    "WhatsApp Image 2026-11-14 at 22.14.40.jpeg",
    "WhatsApp Image 2026-11-14 at 22.14.42.jpeg",
    "WhatsApp Image 2026-11-14 at 22.17.55.jpeg",
  ],
};

const resolveAsset = (path) => {
  const base = import.meta.env.BASE_URL || "/";
  const cleanPath = String(path || "").replace(/^\/+/, "");
  return `${base}${cleanPath}`;
};

function photoSrc(year, filename) {
  return encodeURI(resolveAsset(`assets/images/${year}/${filename}`));
}

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(1);
  // Keep photos stable per year; avoid re-shuffling on tab click to prevent unnecessary reloads
  const [galleries] = useState(PHOTOS_BY_YEAR);
  const [lightbox, setLightbox] = useState(null);
  const [failed, setFailed] = useState({});
  const [loaded, setLoaded] = useState({});

  const touchStartRef = useRef({ x: 0, y: 0 });

  const year = YEARS[activeIndex];
  const photos = galleries[year] ?? [];
  const activePhoto = lightbox === null ? null : photos[lightbox];

  const selectYear = useCallback((index) => {
    setActiveIndex(index);
    setLightbox(null);
  }, []);

  const stepYear = useCallback((delta) => {
    setActiveIndex((current) => (current + delta + YEARS.length) % YEARS.length);
    setLightbox(null);
  }, []);

  const stepPhoto = useCallback(
    (delta) => {
      if (!photos.length) return;
      setLightbox((current) => {
        if (current === null) return current;
        return (current + delta + photos.length) % photos.length;
      });
    },
    [photos.length]
  );

  useEffect(() => {
    function onKey(event) {
      if (lightbox !== null) {
        if (event.key === "Escape") setLightbox(null);
        if (event.key === "ArrowRight") stepPhoto(1);
        if (event.key === "ArrowLeft") stepPhoto(-1);
        return;
      }
      if (event.key === "ArrowRight") stepYear(1);
      if (event.key === "ArrowLeft") stepYear(-1);
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, stepPhoto, stepYear]);

  useEffect(() => {
    if (lightbox === null) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [lightbox]);

  // Touch swiping in lightbox
  const handleLightboxTouchStart = (e) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleLightboxTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        stepPhoto(1);
      } else {
        stepPhoto(-1);
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#090711] px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mx-auto mb-10 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#A879E6]/30 bg-[#8244B3]/15 px-3 py-1 text-[11px] font-mono tracking-widest text-[#2EEED0] uppercase mb-4">
            <span>Official Archive</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#2EEED0] animate-pulse" />
          </div>
          <h1 className="font-sans text-5xl font-extrabold tracking-tight sm:text-6xl text-white">
            Moments of QUEST
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
            A visual retrospective of workshops, hackathons, speaker sessions, and community memories.
          </p>
        </header>

        {/* Year Tabs */}
        <div
          className="mx-auto mb-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4"
          role="tablist"
          aria-label="Gallery years"
        >
          {YEARS.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="gallery-photos"
                className={`rounded-2xl border px-5 py-3.5 text-sm font-bold transition duration-200 cursor-pointer ${
                  isActive
                    ? "border-[#b994e4]/80 bg-[#8244b3]/30 text-white shadow-[0_0_24px_rgba(130,68,179,0.3)] scale-[1.02]"
                    : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/25 hover:bg-white/[0.07] hover:text-white"
                }`}
                onClick={() => selectYear(index)}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Photos Grid Section */}
        <section
          id="gallery-photos"
          role="tabpanel"
          aria-label={`${year} photographs`}
          className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-8 shadow-2xl backdrop-blur-md"
        >
          <div className="mb-8 flex items-end justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <p className="text-xs font-mono font-semibold uppercase tracking-[0.24em] text-[#2EEED0]">
                Photo Archive
              </p>
              <h2 className="mt-1 text-3xl font-extrabold text-white">{year}</h2>
            </div>
            <span className="font-mono text-xs text-[#CBD5E1]/60 tracking-wider">
              {photos.length} Photographs
            </span>
          </div>

          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
            {photos.map((filename, index) => {
              const src = photoSrc(year, filename);
              const alt = `QUEST ${year} event photo ${index + 1}`;
              const isLoaded = loaded[src];
              const isFailed = failed[src];

              return (
                <div
                  key={filename}
                  className="group relative mb-5 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-[#160d26]/80 text-left shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-[#b994e4]/60 hover:shadow-[0_16px_40px_rgba(130,68,179,0.25)] cursor-pointer"
                  onClick={() => setLightbox(index)}
                >
                  {isFailed ? (
                    <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2.5 p-6 text-center bg-gradient-to-br from-[#23143E] via-[#1A0F2E] to-[#0B0B14]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#A879E6]">
                        <ImageOff className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-medium text-white/75">Photo Unavailable</span>
                      <span className="text-[10px] text-white/40">{year} Archive</span>
                    </div>
                  ) : (
                    <>
                      {!isLoaded && (
                        <div className="aspect-[4/3] w-full flex items-center justify-center bg-[#170e28] animate-pulse">
                          <div className="h-6 w-6 rounded-full border-2 border-[#A879E6]/30 border-t-[#2EEED0] animate-spin" />
                        </div>
                      )}
                      <img
                        src={src}
                        alt={alt}
                        loading="lazy"
                        decoding="async"
                        className={`block h-auto w-full object-cover transition-all duration-500 ease-out group-hover:scale-105 ${
                          isLoaded ? "opacity-100" : "absolute inset-0 opacity-0"
                        }`}
                        onLoad={() =>
                          setLoaded((current) =>
                            current[src] ? current : { ...current, [src]: true }
                          )
                        }
                        onError={() =>
                          setFailed((current) => ({ ...current, [src]: true }))
                        }
                      />
                    </>
                  )}

                  {/* Hover Zoom Indicator */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                    <span className="flex items-center gap-1.5 rounded-full border border-white/25 bg-black/60 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-md shadow-lg">
                      <ZoomIn className="h-4 w-4 text-[#2EEED0]" />
                      <span>Zoom</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* ==================== FULLSCREEN LIGHTBOX ==================== */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-[1000] flex min-h-[100dvh] items-center justify-center bg-black/95 p-3 sm:p-6 backdrop-blur-xl animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label={`QUEST ${year} photo`}
          onClick={() => setLightbox(null)}
          onTouchStart={handleLightboxTouchStart}
          onTouchEnd={handleLightboxTouchEnd}
        >
          {/* Top Bar */}
          <div
            className="absolute top-0 inset-x-0 z-30 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-mono text-[#2EEED0]">
                {(lightbox ?? 0) + 1} / {photos.length}
              </span>
              <span className="text-sm font-semibold text-white/90">
                QUEST {year}
              </span>
            </div>

            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Close photo (Press Escape)"
              onClick={() => setLightbox(null)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Left Arrow */}
          <button
            type="button"
            className="absolute left-2 sm:left-6 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition hover:bg-[#8244B3]/40 hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="Previous photo (Press Left Arrow)"
            onClick={(event) => {
              event.stopPropagation();
              stepPhoto(-1);
            }}
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          {/* Lightbox Center Image */}
          <figure
            className="flex max-h-[82dvh] max-w-[92vw] flex-col items-center justify-center gap-3"
            onClick={(event) => event.stopPropagation()}
          >
            {failed[photoSrc(year, activePhoto)] ? (
              <div className="flex aspect-[16/10] w-[min(90vw,720px)] flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#1A0F2E] p-8 text-center shadow-2xl">
                <ImageOff className="h-10 w-10 text-[#A879E6]" />
                <p className="text-lg font-bold text-white">Photo Unavailable</p>
                <p className="text-xs text-[#CBD5E1]/60">
                  The image file could not be loaded from the archive.
                </p>
              </div>
            ) : (
              <img
                src={photoSrc(year, activePhoto)}
                alt={`QUEST ${year} event photo ${(lightbox ?? 0) + 1}`}
                className="max-h-[78dvh] max-w-[90vw] rounded-2xl object-contain shadow-[0_25px_70px_rgba(0,0,0,0.85)] border border-white/10"
              />
            )}
            <figcaption className="text-xs font-mono text-white/70">
              QUEST {year} · Photo {(lightbox ?? 0) + 1}
            </figcaption>
          </figure>

          {/* Right Arrow */}
          <button
            type="button"
            className="absolute right-2 sm:right-6 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition hover:bg-[#8244B3]/40 hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="Next photo (Press Right Arrow)"
            onClick={(event) => {
              event.stopPropagation();
              stepPhoto(1);
            }}
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>
      )}
    </main>
  );
}
