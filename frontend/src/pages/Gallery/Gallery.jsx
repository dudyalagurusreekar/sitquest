import { useCallback, useEffect, useState } from "react";

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

const publicAsset = (path) => `${import.meta.env.BASE_URL}${String(path || '').replace(/^\/+/, '')}`;

function photoSrc(year, filename) {
  return encodeURI(publicAsset(`assets/images/${year}/${filename}`));
}

function shufflePhotos(photos) {
  const shuffled = [...photos];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [galleries, setGalleries] = useState(() => Object.fromEntries(
    Object.entries(PHOTOS_BY_YEAR).map(([year, photos]) => [year, shufflePhotos(photos)]),
  ));
  const [lightbox, setLightbox] = useState(null);
  const [failed, setFailed] = useState({});
  const [loaded, setLoaded] = useState({});

  const year = YEARS[activeIndex];
  const photos = galleries[year] ?? [];
  const activePhoto = lightbox === null ? null : photos[lightbox];

  const selectYear = useCallback((index) => {
    const selectedYear = YEARS[index];
    setActiveIndex(index);
    setLightbox(null);
    setGalleries((current) => ({
      ...current,
      [selectedYear]: shufflePhotos(current[selectedYear] ?? []),
    }));
  }, []);

  const stepYear = useCallback((delta) => {
    setActiveIndex((current) => (current + delta + YEARS.length) % YEARS.length);
    setLightbox(null);
  }, []);

  const stepPhoto = useCallback((delta) => {
    if (!photos.length) return;
    setLightbox((current) => {
      if (current === null) return current;
      return (current + delta + photos.length) % photos.length;
    });
  }, [photos.length]);

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

  return (
    <main className="min-h-screen bg-[#090711] px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#b994e4]">
            Moments from QUEST
          </p>
          <h1 className="font-sans text-5xl font-extrabold tracking-tight sm:text-6xl">
            Gallery
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
            A collection of the people, ideas, and memories that make QUEST.
          </p>
        </header>

        <div
          className="mx-auto mb-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4"
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
                className={`rounded-xl border px-5 py-3 text-sm font-bold transition duration-200 ${
                  isActive
                    ? "border-[#b994e4]/70 bg-[#8244b3]/30 text-white shadow-[0_0_24px_rgba(130,68,179,0.2)]"
                    : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/25 hover:bg-white/[0.07] hover:text-white"
                }`}
                onClick={() => selectYear(index)}
              >
                {item}
              </button>
            );
          })}
        </div>

        <section
          id="gallery-photos"
          role="tabpanel"
          aria-label={`${year} photographs`}
          className="rounded-3xl border border-white/10 bg-white/[0.025] p-4 shadow-2xl shadow-black/20 sm:p-6"
        >
          <div className="mb-6 flex items-end justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b994e4]">
                Photo archive
              </p>
              <h2 className="mt-1 text-2xl font-bold">{year}</h2>
            </div>
          </div>

          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
            {photos.map((filename, index) => {
              const src = photoSrc(year, filename);
              const alt = `QUEST ${year} event photo ${index + 1}`;
              return (
                <button
                  key={filename}
                  type="button"
                  aria-label={`View ${alt}`}
                  className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl border border-white/10 bg-white/5 text-left shadow-lg transition duration-300 hover:-translate-y-1 hover:border-[#b994e4]/50 hover:shadow-[0_12px_36px_rgba(0,0,0,0.35)]"
                  onClick={() => setLightbox(index)}
                >
                  {failed[src] ? (
                    <span className="flex aspect-[4/3] items-center justify-center px-4 text-center text-sm text-white/50">
                      Photo could not be loaded
                    </span>
                  ) : (
                    <>
                      {!loaded[src] && (
                        <span className="absolute inset-0 flex min-h-32 items-center justify-center text-xs text-white/35">
                          Loading photo…
                        </span>
                      )}
                      <img
                        src={src}
                        alt={alt}
                        loading="lazy"
                        decoding="async"
                        className={`block h-auto w-full transition duration-500 group-hover:scale-[1.03] ${
                          loaded[src] ? "opacity-100" : "opacity-0"
                        }`}
                        onLoad={() => setLoaded((current) => (
                          current[src] ? current : { ...current, [src]: true }
                        ))}
                        onError={() => setFailed((current) => ({ ...current, [src]: true }))}
                      />
                    </>
                  )}
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 pb-3 pt-8 text-left text-xs font-medium text-white/90 opacity-0 transition group-hover:opacity-100">
                    Photo {index + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {activePhoto && (
        <div
          className="fixed inset-0 z-[100] flex min-h-[100dvh] items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={`QUEST ${year} photo`}
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl text-white transition hover:bg-white/20"
            aria-label="Close photo"
            onClick={() => setLightbox(null)}
          >
            ×
          </button>
          <button
            type="button"
            className="absolute left-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-2xl text-white transition hover:bg-white/20 sm:left-6"
            aria-label="Previous photo"
            onClick={(event) => {
              event.stopPropagation();
              stepPhoto(-1);
            }}
          >
            ‹
          </button>
          <figure
            className="flex max-h-[calc(100dvh-4rem)] w-full max-w-6xl flex-col items-center justify-center gap-3"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={photoSrc(year, activePhoto)}
              alt={`QUEST ${year} event photo ${(lightbox ?? 0) + 1}`}
              className="max-h-[calc(100dvh-120px)] max-w-full rounded-xl object-contain shadow-2xl"
            />
            <figcaption className="text-sm text-white/75">
              QUEST {year}
            </figcaption>
          </figure>
          <button
            type="button"
            className="absolute right-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-2xl text-white transition hover:bg-white/20 sm:right-6"
            aria-label="Next photo"
            onClick={(event) => {
              event.stopPropagation();
              stepPhoto(1);
            }}
          >
            ›
          </button>
        </div>
      )}
    </main>
  );
}
