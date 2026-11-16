import { useState, useEffect, useRef } from "react";

/* Put your photos in public/images_events/quest_test_series/ and edit the names below */
const PHOTOS = [
  { src: "/images_events/quest_test_series/photo1.jpeg", name: "Quest Test Series photo 1", art: "a1" },
  { src: "/images_events/quest_test_series/photo2.jpeg", name: "Quest Test Series photo 2", art: "a2" },
  { src: "/images_events/quest_test_series/photo3.jpeg", name: "Quest Test Series photo 3", art: "a3" },
  { src: "/images_events/quest_test_series/photo4.jpeg", name: "Quest Test Series photo 4", art: "a1" },
  { src: "/images_events/quest_test_series/photo5.jpeg", name: "Quest Test Series photo 5", art: "a2" },
  { src: "/images_events/quest_test_series/photo6.jpeg", name: "Quest Test Series photo 6", art: "a3" },
];

/* Edit the text of each day here */
const DAYS = [
  {
    day: "Day 1 & Day 2",
    venue: "CSE Labs",
    title: "Aptitude Test",
    text: "Sharpen your problem-solving and logical thinking skills through challenging aptitude questions. Test your speed, accuracy, and analytical abilities while preparing for placement opportunities.",
  },
  {
    day: "Day 3",
    venue: "Seminar Hall",
    title: "Group Discussion",
    text: "Enhance your communication, teamwork, and critical thinking skills. Express your ideas, participate in meaningful discussions, and learn to present your opinions with confidence.",
  },
  {
    day: "Day 4",
    venue: "Interview Panels",
    title: "Personal Interview",
    text: "Build confidence and develop essential interview skills. Practice answering questions, presenting yourself professionally, and making a lasting impression on recruiters.",
  },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500&display=swap');
:root{
  --font-primary:'Plus Jakarta Sans',system-ui,-apple-system,sans-serif;
  --font-mono:'Space Grotesk',monospace;
  --color-primary:#8244B3;--color-secondary:#A879E6;
  --accent-teal:#2EEED0;--accent-blue:#7C9BFF;
  --bg-color:#0B0B14;--surface-color:#1A0F2E;--surface-hover:#23143E;
  --glass-bg:rgba(26,15,46,.65);--glass-card-bg:rgba(255,255,255,.035);
  --glass-border:rgba(255,255,255,.09);--glass-border-hover:rgba(168,121,230,.4);
  --text-main:#FFFFFF;--text-muted:#CBD5E1;--text-dim:#94A3B8;
  --purple-gradient:linear-gradient(135deg,#8244B3 0%,#A879E6 100%);
  --teal-gradient:linear-gradient(135deg,#2EEED0 0%,#7C9BFF 100%);
  --pad:clamp(16px,4vw,24px);
  color-scheme:dark;box-sizing:border-box;
  padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);
}
*,*::before,*::after{box-sizing:inherit}
html{background:var(--bg-color);scroll-behavior:smooth}
body{margin:0;display:block;width:100%;min-width:0;min-height:100dvh;background-color:var(--bg-color);background-repeat:no-repeat;color:var(--text-main);font-family:var(--font-primary);overflow-x:hidden;
  background-image:radial-gradient(60% 50% at 50% 30%,rgba(130,68,179,.28),transparent 70%),radial-gradient(40% 40% at 90% 10%,rgba(124,155,255,.08),transparent 70%)}
#root{width:100%;max-width:none;margin:0;padding:0;border:0;text-align:initial;display:block}
a{color:var(--color-secondary);text-decoration:none;transition:color .2s}
a:hover{color:#fff}
:focus-visible{outline:2px solid var(--color-secondary);outline-offset:3px;border-radius:8px}
::selection{background:rgba(168,121,230,.4);color:#fff}
.wrap{max-width:1080px;margin:0 auto;padding:0 var(--pad);position:relative;z-index:1}
.page{min-height:100dvh;display:flex;flex-direction:column}
.page>.wrap{flex:1 0 auto;width:100%}

/* Title */
.title{text-align:center;padding:36px 0 4px;animation:rise .8s cubic-bezier(.2,.7,.2,1) both}
.title h1{font-size:clamp(34px,6vw,60px);line-height:1.05;font-weight:700;margin:0 0 8px;letter-spacing:-.01em;
  background:linear-gradient(135deg,#FFFFFF 0%,#A879E6 60%,#7C9BFF 100%);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;filter:drop-shadow(0 6px 26px rgba(130,68,179,.5))}
.title::after{content:"";display:block;width:72px;height:3px;margin:14px auto 0;border-radius:3px;background:var(--teal-gradient)}

/* Facts */
.facts{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;max-width:320px;margin:20px auto 0;animation:rise .8s .12s cubic-bezier(.2,.7,.2,1) both}
.fact{display:grid;grid-template-columns:auto auto;column-gap:8px;align-items:center;justify-content:center;text-align:left;padding:6px 10px;border-radius:12px;background:var(--glass-card-bg);border:1px solid var(--glass-border);backdrop-filter:blur(10px);transition:transform .25s,border-color .25s,box-shadow .25s}
.fact:hover{transform:translateY(-3px);border-color:var(--glass-border-hover);box-shadow:0 10px 24px rgba(130,68,179,.28)}
.fact svg{width:13px;height:13px;stroke:var(--color-secondary);fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;grid-row:1/3;display:block;box-sizing:content-box;padding:3px;border-radius:50%;background:rgba(168,121,230,.16)}
.fact small{display:block;color:var(--text-dim);font-size:9px;line-height:1.2}
.fact b{display:block;font-size:11.5px;line-height:1.25;font-weight:600;white-space:nowrap}

/* Register */
.cta{text-align:center;margin-top:20px;animation:rise .8s .24s cubic-bezier(.2,.7,.2,1) both}
.btn{position:relative;overflow:hidden;display:inline-flex;align-items:center;gap:10px;padding:15px 40px;border:0;border-radius:999px;background:var(--purple-gradient);color:#fff;font:600 17px var(--font-primary);cursor:pointer;box-shadow:0 8px 28px rgba(130,68,179,.45);transition:transform .2s,box-shadow .2s}
.btn:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(130,68,179,.45);color:#fff}
.btn::after{content:"";position:absolute;top:0;left:-60%;width:40%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.35),transparent);transform:skewX(-20deg);animation:shine 3.6s ease-in-out infinite;pointer-events:none}

/* About */
.about{position:relative;isolation:isolate;overflow:hidden;margin:32px auto 0;max-width:680px;padding:22px 24px;border-radius:18px;background:var(--surface-color);border:1px solid var(--glass-border-hover);display:grid;gap:10px;backdrop-filter:blur(12px);box-shadow:0 20px 50px rgba(0,0,0,.35);animation:rise .8s .36s cubic-bezier(.2,.7,.2,1) both}
.about::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--purple-gradient)}
.about h2{margin:0;font-size:22px;color:var(--text-main)}
.about p{margin:0;color:var(--text-main);line-height:1.7;font-size:16px}
.about ul{margin:6px 0 0;padding:0;list-style:none;display:flex;gap:10px;flex-wrap:wrap}
.about li{padding:5px 12px;border-radius:999px;border:1px solid var(--glass-border);font-size:12px;color:var(--text-muted)}

/* Day sections */
.days{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;max-width:720px;margin:24px auto 0;animation:rise .8s .45s cubic-bezier(.2,.7,.2,1) both}
.day{position:relative;overflow:hidden;display:flex;flex-direction:column;min-height:200px;padding:16px 14px;border-radius:14px;background:var(--glass-card-bg);border:1px solid var(--glass-border);backdrop-filter:blur(12px);transition:transform .25s,border-color .25s,box-shadow .25s}
.day::before{content:"";position:absolute;left:0;top:0;right:0;height:3px;background:var(--purple-gradient)}
.day:hover{transform:translateY(-4px);border-color:var(--glass-border-hover);box-shadow:0 14px 30px rgba(130,68,179,.28)}
.day-tag{display:inline-block;align-self:flex-start;padding:2px 10px;border-radius:999px;border:1px solid var(--glass-border-hover);background:rgba(168,121,230,.12);color:var(--color-secondary);font:500 11px var(--font-mono)}
.day-venue{display:flex;align-items:center;gap:6px;margin-top:10px;font-size:12px;font-weight:600;color:var(--text-muted)}
.day-venue svg{width:13px;height:13px;flex-shrink:0;stroke:var(--color-secondary);fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.day h3{margin:6px 0 5px;font-size:16px;font-weight:700}
.day p{margin:0;color:var(--text-muted);font-size:12px;line-height:1.55}
@media(max-width:700px){.days{grid-template-columns:1fr}.day{min-height:0}}

/* Coverflow gallery */
.gallery{margin-top:34px;overflow-x:clip;container-type:inline-size;animation:fade 1s .5s ease both}
.gallery h2{text-align:center;font-size:18px;margin:0 0 4px}
.gallery h2::after{content:"";display:block;width:40px;height:3px;margin:8px auto 0;border-radius:3px;background:var(--purple-gradient)}
.gstage{position:relative;max-width:1000px;height:calc(min(380px,34cqw)*.625 + 84px);margin:0 auto;perspective:1400px;touch-action:pan-y}
.gcard{position:absolute;top:50%;left:50%;width:min(300px,26cqw);aspect-ratio:8/5;margin:0;border-radius:20px;overflow:hidden;border:1px solid var(--glass-border);cursor:pointer;opacity:0;pointer-events:none;
  transform:translate(-50%,-50%) scale(.5);transition:transform .8s cubic-bezier(.2,.7,.2,1),opacity .6s,border-color .3s;transform-style:preserve-3d}
.gcard img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.gcard::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,11,20,.15) 0%,rgba(11,11,20,.1) 45%,rgba(11,11,20,.88) 100%)}
.gcard .ginfo{position:absolute;z-index:2;left:14px;right:14px;bottom:14px;display:none}
.gbar{display:flex;align-items:center;gap:12px;font:12px var(--font-mono);color:var(--text-muted);padding-right:38px;position:relative;min-height:30px}
.gbar i{flex:1;height:2px;background:var(--glass-border);border-radius:2px;overflow:hidden}
.gbar i b{display:block;height:100%;background:var(--purple-gradient);transition:width .6s}
.gcard[data-pos="0"]{opacity:1;pointer-events:auto;z-index:5;width:min(380px,34cqw);transform:translate(-50%,-50%) translateZ(60px);border-color:var(--glass-border-hover);box-shadow:0 30px 70px rgba(0,0,0,.55),0 0 44px rgba(168,121,230,.35),0 0 0 1px rgba(168,121,230,.3)}
.gcard[data-pos="0"] .ginfo{display:block}
.gcard[data-pos="-1"]{opacity:.9;pointer-events:auto;z-index:4;transform:translate(calc(-50% - min(240px,21cqw)),-50%) rotateY(32deg) scale(.85)}
.gcard[data-pos="1"]{opacity:.9;pointer-events:auto;z-index:4;transform:translate(calc(-50% + min(240px,21cqw)),-50%) rotateY(-32deg) scale(.85)}
.gcard[data-pos="-2"]{opacity:.65;pointer-events:auto;z-index:3;transform:translate(calc(-50% - min(380px,33cqw)),-50%) rotateY(38deg) scale(.72)}
.gcard[data-pos="2"]{opacity:.65;pointer-events:auto;z-index:3;transform:translate(calc(-50% + min(380px,33cqw)),-50%) rotateY(-38deg) scale(.72)}
.gcard[data-pos="-1"]:hover,.gcard[data-pos="1"]:hover,.gcard[data-pos="-2"]:hover,.gcard[data-pos="2"]:hover{border-color:var(--glass-border-hover);opacity:1}
.gnext{position:absolute;right:0;bottom:0;width:30px;height:30px;border-radius:50%;border:1px solid var(--glass-border);background:var(--glass-bg);backdrop-filter:blur(10px);color:#fff;font-size:20px;cursor:pointer;display:grid;place-items:center;padding:0}
.gnext:hover{border-color:var(--glass-border-hover)}
.a1{background:radial-gradient(70% 50% at 70% 20%,rgba(46,238,208,.55),transparent 70%),linear-gradient(160deg,#23143E,#8244B3 60%,#1A0F2E)}
.a2{background:radial-gradient(60% 50% at 30% 25%,rgba(124,155,255,.6),transparent 70%),linear-gradient(160deg,#1A0F2E,#5b3a9a 55%,#0B0B14)}
.a3{background:radial-gradient(60% 50% at 50% 30%,rgba(168,121,230,.5),transparent 70%),linear-gradient(160deg,#23143E,#1A0F2E 70%)}

/* Centre photo viewer */
.lb{position:fixed;inset:0;z-index:100;display:grid;place-items:center;padding:24px;background:rgba(11,11,20,.88);backdrop-filter:blur(8px);cursor:zoom-out;animation:fade .25s ease both}
.lb img{max-width:min(92vw,1000px);max-height:86dvh;object-fit:contain;border-radius:16px;border:1px solid var(--glass-border-hover);box-shadow:0 30px 80px rgba(0,0,0,.6);cursor:default;animation:pop .3s cubic-bezier(.2,.7,.2,1) both}
.lb-x{position:absolute;top:calc(16px + env(safe-area-inset-top,0px));right:16px;width:40px;height:40px;border-radius:50%;border:1px solid var(--glass-border);background:var(--glass-bg);color:#fff;font-size:26px;line-height:1;cursor:pointer;display:grid;place-items:center;padding:0}
.lb-x:hover{border-color:var(--glass-border-hover)}
@keyframes pop{from{opacity:0;transform:scale(.92)}}

@keyframes rise{from{opacity:0;transform:translateY(18px)}}
@keyframes fade{from{opacity:0}}
@keyframes shine{0%,55%{left:-60%}100%{left:140%}}

@media(max-width:700px){
  .facts{gap:6px}
  .fact{padding:6px;column-gap:6px}
  .fact b{font-size:10.5px}
  .gallery{margin-left:calc(-1*var(--pad));margin-right:calc(-1*var(--pad));margin-top:28px}
}
@container (max-width:700px){
  .gstage{height:calc(56cqw*.625 + 56px)}
  .gcard{width:40cqw}
  .gcard[data-pos="0"]{width:56cqw}
  .gcard[data-pos="-1"]{transform:translate(calc(-50% - 24cqw),-50%) rotateY(30deg) scale(.85)}
  .gcard[data-pos="1"]{transform:translate(calc(-50% + 24cqw),-50%) rotateY(-30deg) scale(.85)}
  .gcard[data-pos="-2"]{transform:translate(calc(-50% - 34cqw),-50%) rotateY(36deg) scale(.7)}
  .gcard[data-pos="2"]{transform:translate(calc(-50% + 34cqw),-50%) rotateY(-36deg) scale(.7)}
  .gcard .ginfo{left:10px;right:10px;bottom:10px}
  .gnext{width:26px;height:26px;font-size:16px}
  .gbar{gap:8px;font-size:10px;padding-right:32px;min-height:26px}
}
@media(max-width:359px){
  .facts{grid-template-columns:1fr}
  .fact{justify-content:start;padding:6px 12px;column-gap:10px}
}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{transition:none!important;animation:none!important}}
`;

export default function QuestTestSeries() {
  const N = PHOTOS.length;
  const [cur, setCur] = useState(0);
  const touchX = useRef(0);
  const [open, setOpen] = useState(null); // index of the photo shown in the centre viewer

  useEffect(() => {
    document.title = "Quest Test Series | QUEST Events";
  }, []);

  // Auto-scroll every 2.8s; timer restarts after any manual change
  useEffect(() => {
    if (open !== null) return;
    const t = setInterval(() => setCur((c) => (c + 1) % N), 2800);
    return () => clearInterval(t);
  }, [cur, N, open]);

  // Close the photo viewer with the Escape key
  useEffect(() => {
    if (open === null) return;
    const onKey = (e) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (i) => setCur(((i % N) + N) % N);

  return (
    <>
      <style>{CSS}</style>
      <div className="page">
        <div className="wrap">
          <main>
            <section className="title">
              <h1>Quest Test Series</h1>
            </section>

            {/* Edit date, time and place here */}
            <section className="facts" aria-label="Event details">
              <div className="fact">
                <svg viewBox="0 0 24 24">
                  <rect x="4" y="5" width="16" height="15" rx="2" />
                  <path d="M4 10h16M9 3v4M15 3v4" />
                </svg>
                <small>Date</small>
                <b>Upcoming</b>
              </div>
              <div className="fact">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="8" />
                  <path d="M12 8v4l3 2" />
                </svg>
                <small>Time</small>
                <b>Upcoming</b>
              </div>
            </section>

            <div className="cta">
              <a className="btn" href="#" target="_blank" rel="noopener noreferrer">
                Register
              </a>
            </div>

            <section className="about">
              <h2>About the event</h2>
              <p>
                Quest Test Series is a four-day event designed to prepare you for placements.
                The aptitude test is held on the first two days, the group discussion is on the
                third day, and the personal interviews are conducted on the fourth day.
              </p>
            </section>

            {/* Three separate day sections */}
            <section className="days" aria-label="Event schedule">
              {DAYS.map((d) => (
                <article className="day" key={d.day}>
                  <span className="day-tag">{d.day}</span>
                  <span className="day-venue">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                    {d.venue}
                  </span>
                  <h3>{d.title}</h3>
                  <p>{d.text}</p>
                </article>
              ))}
            </section>

            <section className="gallery" aria-label="Event photos">
              <h2>Event photos</h2>
              <div
                className="gstage"
                role="region"
                aria-roledescription="carousel"
                aria-label="Event photos"
                onTouchStart={(e) => {
                  touchX.current = e.touches[0].clientX;
                }}
                onTouchEnd={(e) => {
                  const dx = e.changedTouches[0].clientX - touchX.current;
                  if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1));
                }}
              >
                {PHOTOS.map((p, i) => {
                  let d = (((i - cur) % N) + N) % N;
                  if (d > N / 2) d -= N;
                  return (
                    <figure
                      key={i}
                      className={`gcard ${p.art}`}
                      data-pos={d}
                      aria-hidden={d !== 0}
                      onClick={() => {
                        go(i);
                        if (p.src) setOpen(i);
                      }}
                    >
                      {p.src ? <img src={p.src} alt={p.name} /> : null}
                    </figure>
                  );
                })}
              </div>
            </section>
          </main>
        </div>
      </div>

      {open !== null && (
        <div
          className="lb"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={() => setOpen(null)}
        >
          <button className="lb-x" aria-label="Close photo" onClick={() => setOpen(null)}>
            ×
          </button>
          <img
            src={PHOTOS[open].src}
            alt={PHOTOS[open].name}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}