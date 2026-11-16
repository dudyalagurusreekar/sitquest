import { useState, useEffect } from "react";
import EventPhotoGallery from "../../components/EventPhotoGallery";

/* Public asset helper */
const assetUrl = (path) => `${import.meta.env.BASE_URL}${String(path || '').replace(/^\/+/, '')}`;

const PHOTOS = [
  {
    src: "images_events/placement_iq/bpnoosoxtp6tvtozortc.webp",
    title: "Round 1 — Aptitude & Analysis",
    alt: "Placement IQ Round 1",
    sub: "Round 1",
  },
  {
    src: "images_events/placement_iq/IMG_2135.JPG",
    title: "Round 2 — Technical Screening",
    alt: "Placement IQ Round 2",
    sub: "Round 2",
  },
  {
    src: "images_events/placement_iq/ngbf4uy9sqbo6mikii2n.webp",
    title: "Round 3 — Group Discussion",
    alt: "Placement IQ Round 3",
    sub: "Round 3",
  },
  {
    src: "images_events/placement_iq/xgsaxebl7oulw9miiob4.webp",
    title: "Keynote & Corporate Insights",
    alt: "Sahana Shanbhag Session",
    sub: "Speaker Session",
  },
  {
    src: "images_events/placement_iq/doavnn7isbmprgnpajrz.webp",
    title: "Participants & Mock Interviews",
    alt: "Mock interview practice",
    sub: "Mocks",
  },
  {
    src: "images_events/placement_iq/IMG_20260425_143931128.jpg",
    title: "Closing Felicitation & Awards",
    alt: "Closing felicitation",
    sub: "Felicitation",
  },
];

/* ---- SPEAKER DETAILS ---- */
const SPEAKER = {
  name: "Sahana Shanbhag",
  role: "Senior Analyst",
  company: "Target Corporation",
  photo: assetUrl("images_events/speaker/speaker.jpg"),
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

/* 1. Centered title */
.title{text-align:center;padding:36px 0 4px}
.title h1{color:var(--text-main)!important;font-size:clamp(34px,6vw,60px);line-height:1.05;font-weight:700;margin:0 0 8px;letter-spacing:-.01em}

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

/* 3b. Speaker card */
.speaker{margin:24px auto 0;max-width:680px;padding:24px;border-radius:20px;background:var(--glass-card-bg);border:1px solid var(--glass-border);display:grid;grid-template-columns:auto 1fr;gap:24px;align-items:center}
.sp-label{grid-column:1/-1;margin:0;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--color-secondary);font-weight:600}
.sp-photo{width:110px;height:110px;border-radius:50%;border:2px solid var(--glass-border-hover);overflow:hidden;background:var(--surface-color);display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative}
.sp-photo img{width:100%;height:100%;object-fit:cover;object-position:center top;display:block}
.sp-photo span{font:700 32px var(--font-mono);color:var(--color-secondary)}
.sp-body h3{margin:0 0 4px;font-size:22px;color:var(--text-main);font-weight:700}
.sp-role{margin:0 0 12px;font-size:14px;color:var(--text-muted)}
.sp-role b{color:var(--text-main)}
.sp-exp{margin:0 0 12px;padding-left:18px;color:var(--text-dim);font-size:13px;line-height:1.55}
.sp-topics{display:flex;flex-wrap:wrap;gap:6px;list-style:none;padding:0;margin:0}
.sp-topics li{padding:4px 10px;border-radius:999px;background:rgba(168,121,230,.12);border:1px solid rgba(168,121,230,.25);color:var(--text-main);font-size:11.5px;font-weight:500}

.page{min-height:100vh;min-height:100dvh;display:flex;flex-direction:column}
.page>.wrap{flex:1 0 auto;width:100%}
@media(max-width:700px){
  .facts{gap:6px}
  .fact{padding:6px 6px;column-gap:6px}
  .fact b{font-size:10.5px}
  .speaker{grid-template-columns:1fr;justify-items:center;text-align:center}
  .sp-topics{justify-content:center}
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
/* ---- Visual enhancements ---- */
html{scroll-behavior:smooth}
::selection{background:rgba(168,121,230,.4);color:#fff}
body::before,body::after{content:"";position:fixed;z-index:0;pointer-events:none;border-radius:50%}
body::before{top:-140px;right:-140px;width:520px;height:520px;background:radial-gradient(circle,rgba(46,238,208,.14),transparent 65%);animation:drift 14s ease-in-out infinite alternate}
body::after{bottom:-180px;left:-160px;width:620px;height:620px;background:radial-gradient(circle,rgba(130,68,179,.3),transparent 65%);animation:drift 18s ease-in-out infinite alternate-reverse}
.wrap{position:relative;z-index:1}
@keyframes drift{from{transform:translate3d(0,0,0)}to{transform:translate3d(50px,36px,0)}}
@keyframes rise{from{opacity:0;transform:translateY(18px)}}
@keyframes shine{0%,55%{left:-60%}100%{left:140%}}
.title{animation:rise .8s cubic-bezier(.2,.7,.2,1) both}
.facts{animation:rise .8s .12s cubic-bezier(.2,.7,.2,1) both}
.cta{animation:rise .8s .24s cubic-bezier(.2,.7,.2,1) both}
.about{animation:rise .8s .36s cubic-bezier(.2,.7,.2,1) both}
.speaker{animation:rise .8s .48s cubic-bezier(.2,.7,.2,1) both}
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
@media(prefers-reduced-motion:reduce){*,*::before,*::after{transition:none!important;animation:none!important}}
`;

const PIN = (
  <>
    <path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </>
);

export default function PlacementIQ() {
  const [speakerImgFailed, setSpeakerImgFailed] = useState(false);

  useEffect(() => {
    document.title = "Placement IQ | QUEST Events";
  }, []);

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

            {/* 2. Event details */}
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
                {!speakerImgFailed && SPEAKER.photo ? (
                  <img
                    src={SPEAKER.photo}
                    alt={SPEAKER.name}
                    onError={() => setSpeakerImgFailed(true)}
                  />
                ) : (
                  <span aria-hidden="true">{initials}</span>
                )}
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

            {/* 4. Responsive Event Photo Gallery */}
            <EventPhotoGallery
              photos={PHOTOS}
              eventTitle="Placement IQ"
              subtitle="Glimpses into aptitude rounds, speaker insights, and placement simulations"
            />
          </main>
        </div>
      </div>
    </>
  );
}
