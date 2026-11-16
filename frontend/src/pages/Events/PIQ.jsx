import { useState, useEffect, useRef } from "react";

/* Add your real photos: replace src:null with a path like "photos/1.jpg" */
const PHOTOS = [
  { src:"public/images_events/placement_iq/bpnoosoxtp6tvtozortc.webp", name: "", sub: "Round 1", art: "a1" },
  { src: "public/images_events/placement_iq/IMG_2135.JPG", name: "", sub: "Round 2", art: "a2" },
  { src: "public/images_events/placement_iq/ngbf4uy9sqbo6mikii2n.webp", name: "", sub: "Round 3", art: "a3" },
  { src: "public/images_events/placement_iq/xgsaxebl7oulw9miiob4.webp", name: "", sub: "Results", art: "a1" },
  { src: "public/images_events/placement_iq/doavnn7isbmprgnpajrz.webp", name: "", sub: "Participants", art: "a2" },
  { src: "public/images_events/placement_iq/IMG_20260425_143931128.jpg", name: "", sub: "Closing", art: "a3" },
];

/* ---- EDIT SPEAKER DETAILS HERE ----
   photo: put the speaker's picture at this path (initials show until it exists).
   experience: add 3-4 short lines from the speaker's LinkedIn; the list is hidden while empty. */
const SPEAKER = {
  name: "Sahana Shanbhag",
  role: "Senior Analyst",
  company: "Target Corporation",
  photo: "public/images_events/speaker/speaker.jpg",
  experience: [],
  topics: [
    "Career planning",
    "High-CTC job strategies",
    "Resume building",
    "LinkedIn optimization",
    "Technical & HR interview prep",
  ],
};

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
html{background:var(--bg-color);scroll-padding-top:env(safe-area-inset-top,0px)}
body{margin:0;display:block;place-items:normal;width:100%;min-width:0;min-height:100vh;min-height:100dvh;background-color:var(--bg-color);background-repeat:no-repeat;color:var(--text-main);font-family:var(--font-primary);overflow-x:hidden;
  background-image:radial-gradient(60% 50% at 50% 30%,rgba(130,68,179,.28),transparent 70%),radial-gradient(40% 40% at 90% 10%,rgba(124,155,255,.08),transparent 70%)}
#root{width:100%;max-width:none;margin:0;padding:0;border:0;text-align:initial;display:block;min-height:0}
a{color:var(--color-secondary);text-decoration:none;transition:color .2s}
a:hover{color:#fff}
:focus-visible{outline:2px solid var(--color-secondary);outline-offset:3px;border-radius:8px}
.wrap{max-width:1080px;margin:0 auto;padding:0 var(--pad)}
.page header{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:16px 0;flex-wrap:wrap}
.brand{display:flex;align-items:center;gap:12px;font-weight:800;font-size:17px;letter-spacing:.04em;color:#fff}
.mark{width:34px;height:34px;border-radius:50%;background:var(--purple-gradient);display:grid;place-items:center;font-weight:800;box-shadow:0 0 0 3px rgba(168,121,230,.25)}
.page nav{display:flex;gap:22px}
.page nav a{display:flex;flex-direction:column;align-items:center;gap:5px;font-size:11px;color:var(--text-muted)}
.page nav a svg{width:18px;height:18px;stroke:var(--color-secondary);fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.page nav a:hover{color:#fff}

/* 1. Centered title */
.title{text-align:center;padding:36px 0 4px}
.title h1{color:var(--text-main)!important;font-size:clamp(34px,6vw,60px);line-height:1.05;font-weight:700;margin:0 0 8px;letter-spacing:-.01em}
.title p{margin:0 auto;color:var(--text-muted);font-size:clamp(13px,1.6vw,15px)}

/* 2. Event details */
.facts{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:400px;margin:20px auto 0}
.fact{display:grid;grid-template-columns:auto auto;column-gap:8px;align-items:center;justify-content:center;text-align:left;padding:6px 10px;border-radius:12px;background:var(--glass-card-bg);border:1px solid var(--glass-border)}
.fact svg{width:13px;height:13px;stroke:var(--color-secondary);fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;grid-row:1/3;display:block;margin:0}
.fact small{display:block;color:var(--text-dim);font-size:9px;line-height:1.2;margin:0}
.fact b{display:block;font-size:11.5px;line-height:1.25;font-weight:600;color:var(--text-main);white-space:nowrap}
.cta{text-align:center;margin-top:20px}
.btn{display:inline-flex;align-items:center;gap:10px;padding:15px 40px;border:0;border-radius:999px;background:var(--purple-gradient);color:#fff;font:600 17px var(--font-primary);cursor:pointer;transition:transform .2s,box-shadow .2s}
.btn:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(130,68,179,.45);color:#fff}

/* 3. About */
.about{margin:32px auto 0;max-width:680px;padding:20px 22px;border-radius:18px;background:var(--glass-card-bg);border:1px solid var(--glass-border);display:grid;gap:10px}
.about h2{margin:0;font-size:18px;color:var(--text-main)}
.about p{margin:0;color:var(--text-muted);line-height:1.65;font-size:14px}
.about ul{margin:6px 0 0;padding:0;list-style:none;display:flex;gap:10px;flex-wrap:wrap}
.about li{padding:5px 12px;border-radius:999px;border:1px solid var(--glass-border);font-size:12px;color:var(--text-muted)}
.about li:first-child{border-color:rgba(46,238,208,.4);color:var(--accent-teal)}

/* 3b. Speaker */
.speaker{margin:20px auto 0;max-width:680px;padding:20px 22px;border-radius:18px;background:var(--glass-card-bg);border:1px solid var(--glass-border);display:grid;grid-template-columns:auto 1fr;gap:8px 22px;align-items:center}
.speaker .sp-label{grid-column:1/-1;margin:0;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--accent-teal)}
.sp-photo{position:relative;width:112px;height:112px;border-radius:50%;overflow:hidden;display:grid;place-items:center;background:var(--purple-gradient);font-weight:800;font-size:34px;color:#fff;box-shadow:0 0 0 3px rgba(168,121,230,.3),0 14px 34px rgba(130,68,179,.4)}
.sp-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.sp-body{display:grid;gap:6px;min-width:0}
.sp-body h3{margin:0;font-size:20px;color:var(--text-main)}
.sp-role{margin:0;font-size:14px;color:var(--text-muted)}
.sp-role b{color:var(--color-secondary);font-weight:600}
.sp-exp{margin:6px 0 0;padding:0;list-style:none;display:grid;gap:6px}
.sp-exp li{position:relative;padding-left:16px;font-size:13px;line-height:1.55;color:var(--text-muted)}
.sp-exp li::before{content:"";position:absolute;left:0;top:.6em;width:6px;height:6px;border-radius:50%;background:var(--purple-gradient)}
.sp-topics{margin:8px 0 0;padding:0;list-style:none;display:flex;gap:8px;flex-wrap:wrap}
.sp-topics li{padding:4px 11px;border-radius:999px;border:1px solid var(--glass-border);font-size:11.5px;color:var(--text-muted)}

/* 4. Photo coverflow (auto-scrolling) */
.gallery{margin-top:34px;overflow-x:clip;container-type:inline-size}
.gallery h2{text-align:center;font-size:18px;margin:0 0 4px;color:var(--text-main)}
.gstage{position:relative;max-width:1000px;height:calc(min(380px,34cqw)*.625 + 84px);margin:0 auto;perspective:1400px;touch-action:pan-y}
.gcard{position:absolute;top:50%;left:50%;width:min(300px,26cqw);aspect-ratio:8/5;margin:0;border-radius:20px;overflow:hidden;border:1px solid var(--glass-border);cursor:pointer;opacity:0;pointer-events:none;
  transform:translate(-50%,-50%) scale(.5);transition:transform .8s cubic-bezier(.2,.7,.2,1),opacity .6s,border-color .3s;transform-style:preserve-3d}
.gcard img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.gcard::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,11,20,.15) 0%,rgba(11,11,20,.1) 45%,rgba(11,11,20,.88) 100%)}
.gcard .gtag{position:absolute;z-index:2;top:12px;left:12px;display:flex;align-items:center;gap:6px;font-weight:600;font-size:13px}
.gcard .gtag small{display:block;color:var(--text-muted);font-weight:400;font-size:11px}
.gcard .gtag svg{width:15px;height:15px;stroke:var(--color-secondary);fill:none;stroke-width:2}
.gcard[data-pos="0"]{opacity:1;pointer-events:auto;z-index:5;width:min(380px,34cqw);transform:translate(-50%,-50%) translateZ(60px);border-color:var(--glass-border-hover);box-shadow:0 30px 70px rgba(0,0,0,.55),0 0 0 1px rgba(168,121,230,.15)}
.gcard[data-pos="-1"]{opacity:.9;pointer-events:auto;z-index:4;transform:translate(calc(-50% - min(240px,21cqw)),-50%) rotateY(32deg) scale(.85)}
.gcard[data-pos="1"]{opacity:.9;pointer-events:auto;z-index:4;transform:translate(calc(-50% + min(240px,21cqw)),-50%) rotateY(-32deg) scale(.85)}
.gcard[data-pos="-2"]{opacity:.65;pointer-events:auto;z-index:3;transform:translate(calc(-50% - min(380px,33cqw)),-50%) rotateY(38deg) scale(.72)}
.gcard[data-pos="2"]{opacity:.65;pointer-events:auto;z-index:3;transform:translate(calc(-50% + min(380px,33cqw)),-50%) rotateY(-38deg) scale(.72)}
.gcard[data-pos="-1"]:hover,.gcard[data-pos="1"]:hover,.gcard[data-pos="-2"]:hover,.gcard[data-pos="2"]:hover{border-color:var(--glass-border-hover);opacity:1}
.a1{background:radial-gradient(70% 50% at 70% 20%,rgba(46,238,208,.55),transparent 70%),linear-gradient(160deg,#23143E,#8244B3 60%,#1A0F2E)}
.a2{background:radial-gradient(60% 50% at 30% 25%,rgba(124,155,255,.6),transparent 70%),linear-gradient(160deg,#1A0F2E,#5b3a9a 55%,#0B0B14)}
.a3{background:radial-gradient(60% 50% at 50% 30%,rgba(168,121,230,.5),transparent 70%),linear-gradient(160deg,#23143E,#1A0F2E 70%)}

/* 5. Lightbox (click any photo) */
.lb{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:max(20px,env(safe-area-inset-top,0px)) 20px max(20px,env(safe-area-inset-bottom,0px));background:rgba(5,5,12,.88);backdrop-filter:blur(10px);animation:fade .25s ease both;cursor:zoom-out}
.lb-img{display:block;max-width:min(94vw,1200px);max-height:84vh;width:auto;height:auto;object-fit:contain;border-radius:16px;border:1px solid var(--glass-border-hover);box-shadow:0 30px 90px rgba(0,0,0,.65),0 0 60px rgba(168,121,230,.25);cursor:default;animation:pop .3s cubic-bezier(.2,.7,.2,1) both}
.lb-ph{width:min(90vw,720px);aspect-ratio:8/5;border-radius:16px;border:1px solid var(--glass-border-hover);cursor:default}
.lb-close{position:absolute;top:max(14px,env(safe-area-inset-top,0px));right:14px;width:40px;height:40px;border-radius:50%;border:1px solid var(--glass-border);background:var(--glass-bg);backdrop-filter:blur(10px);color:#fff;font-size:24px;line-height:1;cursor:pointer;display:grid;place-items:center;padding:0}
.lb-close:hover{border-color:var(--glass-border-hover)}
@keyframes pop{from{opacity:0;transform:scale(.92)}}

.page{min-height:100vh;min-height:100dvh;display:flex;flex-direction:column}
.page>.wrap{flex:1 0 auto;width:100%}
@media(max-width:700px){
  .facts{gap:6px}
  .fact{padding:6px 6px;column-gap:6px}
  .fact b{font-size:10.5px}
  .gallery{margin-left:calc(-1*var(--pad));margin-right:calc(-1*var(--pad));margin-top:28px}
  .speaker{grid-template-columns:1fr;justify-items:center;text-align:center}
  .sp-body{justify-items:center}
  .sp-exp li{text-align:left}
  .sp-topics{justify-content:center}
}
@container (max-width:700px){
  .gstage{height:calc(56cqw*.625 + 56px)}
  .gcard{width:40cqw}
  .gcard[data-pos="0"]{width:56cqw}
  .gcard[data-pos="-1"]{transform:translate(calc(-50% - 24cqw),-50%) rotateY(30deg) scale(.85)}
  .gcard[data-pos="1"]{transform:translate(calc(-50% + 24cqw),-50%) rotateY(-30deg) scale(.85)}
  .gcard[data-pos="-2"]{transform:translate(calc(-50% - 34cqw),-50%) rotateY(36deg) scale(.7)}
  .gcard[data-pos="2"]{transform:translate(calc(-50% + 34cqw),-50%) rotateY(-36deg) scale(.7)}
}
@media(max-width:359px){
  .facts{grid-template-columns:1fr}
  .fact{justify-content:start;padding:6px 12px;column-gap:10px}
  .fact b{font-size:12px}
}
@media(max-height:500px) and (orientation:landscape){
  .title{padding:16px 0 0}
  .facts{margin-top:14px}
}
/* ---- Visual enhancements (decorative only) ---- */
html{scroll-behavior:smooth}
::selection{background:rgba(168,121,230,.4);color:#fff}
body::before,body::after{content:"";position:fixed;z-index:0;pointer-events:none;border-radius:50%}
body::before{top:-140px;right:-140px;width:520px;height:520px;background:radial-gradient(circle,rgba(46,238,208,.14),transparent 65%);animation:drift 14s ease-in-out infinite alternate}
body::after{bottom:-180px;left:-160px;width:620px;height:620px;background:radial-gradient(circle,rgba(130,68,179,.3),transparent 65%);animation:drift 18s ease-in-out infinite alternate-reverse}
.wrap{position:relative;z-index:1}
@keyframes drift{from{transform:translate3d(0,0,0)}to{transform:translate3d(50px,36px,0)}}
@keyframes rise{from{opacity:0;transform:translateY(18px)}}
@keyframes fade{from{opacity:0}}
@keyframes shine{0%,55%{left:-60%}100%{left:140%}}
.title{animation:rise .8s cubic-bezier(.2,.7,.2,1) both}
.facts{animation:rise .8s .12s cubic-bezier(.2,.7,.2,1) both}
.cta{animation:rise .8s .24s cubic-bezier(.2,.7,.2,1) both}
.about{animation:rise .8s .36s cubic-bezier(.2,.7,.2,1) both}
.speaker{animation:rise .8s .48s cubic-bezier(.2,.7,.2,1) both}
.gallery{animation:fade 1s .6s ease both}
.title h1{background:linear-gradient(135deg,#FFFFFF 0%,#A879E6 60%,#7C9BFF 100%)!important;-webkit-background-clip:text!important;background-clip:text!important;color:transparent!important;-webkit-text-fill-color:transparent!important;filter:drop-shadow(0 6px 26px rgba(130,68,179,.5))}
.title::after{content:"";display:block;width:72px;height:3px;margin:14px auto 0;border-radius:3px;background:var(--teal-gradient)}
.fact{backdrop-filter:blur(10px);transition:transform .25s,border-color .25s,box-shadow .25s}
.fact:hover{transform:translateY(-3px);border-color:var(--glass-border-hover);box-shadow:0 10px 24px rgba(130,68,179,.28)}
.fact svg{box-sizing:content-box;padding:3px;border-radius:50%;background:rgba(168,121,230,.16)}
.btn{position:relative;overflow:hidden;box-shadow:0 8px 28px rgba(130,68,179,.45)}
.btn::after{content:"";position:absolute;top:0;left:-60%;width:40%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.35),transparent);transform:skewX(-20deg);animation:shine 3.6s ease-in-out infinite;pointer-events:none}
.about,.speaker{position:relative;isolation:isolate;overflow:hidden;backdrop-filter:blur(12px);box-shadow:0 20px 50px rgba(0,0,0,.35)}
.about::before,.speaker::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--purple-gradient)}
.about::after,.speaker::after{content:"";position:absolute;z-index:-1;right:-60px;top:-60px;width:200px;height:200px;background:radial-gradient(circle,rgba(168,121,230,.24),transparent 70%);pointer-events:none}
.gallery h2::after{content:"";display:block;width:40px;height:3px;margin:8px auto 0;border-radius:3px;background:var(--purple-gradient)}
.gstage::after{content:"";position:absolute;left:50%;bottom:4%;width:46%;height:34px;transform:translateX(-50%);background:radial-gradient(ellipse,rgba(130,68,179,.4),transparent 70%);filter:blur(8px);pointer-events:none}
.gcard::before{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(115deg,rgba(255,255,255,.14),transparent 35%);pointer-events:none}
.gcard[data-pos="0"]{box-shadow:0 30px 70px rgba(0,0,0,.55),0 0 44px rgba(168,121,230,.35),0 0 0 1px rgba(168,121,230,.3)}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{transition:none!important;animation:none!important}}
`;

const PIN = (
  <>
    <path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </>
);

export default function QuestEvents() {
  const N = PHOTOS.length;
  const [cur, setCur] = useState(0);
  const [lightbox, setLightbox] = useState(null); // index of the enlarged photo, or null
  const touchX = useRef(0);

  useEffect(() => {
    document.title = "Placement IQ | QUEST Events";
  }, []);

  // Auto-scroll: advance every 2.8s, timer restarts after any manual change; paused while a photo is enlarged
  useEffect(() => {
    if (lightbox !== null) return;
    const t = setInterval(() => setCur((c) => (c + 1) % N), 2800);
    return () => clearInterval(t);
  }, [cur, N, lightbox]);

  // Lightbox: close on Escape, lock page scroll while open
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox]);

  const go = (i) => setCur(((i % N) + N) % N);

  const initials = SPEAKER.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      <style>{CSS}</style>
      <div className="page">
      <div className="wrap">

        <main id="top">
          {/* 1. Heading, centered at the top */}
          <section className="title">
            <h1>Placement IQ</h1>
          </section>

          {/* 2. Event details: edit these three values */}
          <section className="facts" aria-label="Event details">
            <div className="fact">
              <svg viewBox="0 0 24 24">
                <rect x="4" y="5" width="16" height="15" rx="2" />
                <path d="M4 10h16M9 3v4M15 3v4" />
              </svg>
              <small>Date</small>
              <b id="f-date">16th NOV</b>
            </div>
            <div className="fact">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" />
                <path d="M12 8v4l3 2" />
              </svg>
              <small>Time</small>
              <b id="f-time">5:15 PM</b>
            </div>
            <div className="fact">
              <svg viewBox="0 0 24 24">{PIN}</svg>
              <small>Place</small>
              <b id="f-place">Media Centre</b>
            </div>
          </section>
          <div className="cta">
            <a className="btn" id="register" href="#register">
              Register
            </a>
          </div>

          {/* 3. About the event */}
          <section className="about" id="about">
            <h2>About the event</h2>
            <p>
              Placement IQ is an insightful career development session aimed at helping students understand the corporate world and prepare for future placement opportunities. The session covers career planning, strategies for securing high-CTC jobs, resume building, LinkedIn optimization, and technical and HR interview preparation. The event features Sahana Shanbhag, Senior Analyst at Target Corporation, who will share industry insights and guidance on developing the skills needed to succeed in the corporate world.
            </p>
          </section>

          {/* 3b. Speaker */}
          <section className="speaker" id="speaker" aria-label="Speaker">
            <p className="sp-label">Meet the speaker</p>
            <div className="sp-photo">
              <span aria-hidden="true">{initials}</span>
              {SPEAKER.photo ? (
                <img
                  src={SPEAKER.photo}
                  alt={SPEAKER.name}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : null}
            </div>
            <div className="sp-body">
              <h3>{SPEAKER.name}</h3>
              <p className="sp-role">
                {SPEAKER.role} at <b>{SPEAKER.company}</b>
              </p>
              {SPEAKER.experience.length > 0 && (
                <ul className="sp-exp">
                  {SPEAKER.experience.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              )}
              <ul className="sp-topics" aria-label="Session topics">
                {SPEAKER.topics.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* 4. Scrolling photos */}
          <section className="gallery" id="gallery" aria-label="Event photos">
            <h2>Event photos</h2>
            <div
              className="gstage"
              id="gstage"
              role="region"
              aria-roledescription="carousel"
              onTouchStart={(e) => {
                touchX.current = e.touches[0].clientX;
              }}
              onTouchEnd={(e) => {
                const dx = e.changedTouches[0].clientX - touchX.current;
                if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1));
              }}
              aria-label="Event photos"
            >
              {PHOTOS.map((p, i) => {
                let d = (((i - cur) % N) + N) % N;
                if (d > N / 2) d -= N;
                return (
                  <figure
                    key={i}
                    className={`gcard ${p.art}`}
                    data-i={i}
                    data-pos={d}
                    aria-hidden={d !== 0}
                    onClick={() => {
                      go(i);
                      setLightbox(i);
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

      {/* 5. Enlarged photo, centered on screen */}
      {lightbox !== null && (
        <div
          className="lb"
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged photo"
          onClick={() => setLightbox(null)}
        >
          <button
            className="lb-close"
            aria-label="Close photo"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
            }}
          >
            ×
          </button>
          {PHOTOS[lightbox].src ? (
            <img
              className="lb-img"
              src={PHOTOS[lightbox].src}
              alt={PHOTOS[lightbox].name}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div
              className={`lb-ph ${PHOTOS[lightbox].art}`}
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </>
  );
}