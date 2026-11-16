import { useEffect } from "react";
import EventPhotoGallery from "../../components/EventPhotoGallery";

/* ---- EVENT DETAILS ---- */
const EVENT = {
  title: "Quest Freshers",
  date: "5th October",
  time: "5:15PM",
  place: "Birla Auditorium",
  registerLink: "#register",
  about:
    "Quest Freshers is our welcome event for the incoming batch. Meet your seniors, get to know what QUEST does, and spend the day with aptitude challenges, interactive games, performances, and your new classmates.",
};

const PHOTOS = [
  {
    src: "images_events/freshers/1ea02787-2b62-40d3-b5e6-e132048cc209.jpg",
    title: "Quest Freshers 2026",
    alt: "Quest Freshers poster",
    sub: "Grand Welcome",
  },
  {
    src: "images_events/freshers/c9575510-f6b4-4258-800f-5059fca87eaf.jpg",
    title: "Welcome & Senior Interaction",
    alt: "Welcome session",
    sub: "Orientation",
  },
  {
    src: "images_events/freshers/e3492114-2692-41c8-984a-a2e1fad7d064.jpg",
    title: "Icebreaker & Aptitude Games",
    alt: "Icebreaker games",
    sub: "Team Games",
  },
  {
    src: "images_events/freshers/6e05aa11-08ed-40ec-b9eb-42f52c8e6399.jpg",
    title: "Live Stage Performances",
    alt: "Performances",
    sub: "Stage",
  },
  {
    src: "images_events/freshers/7dd45f87-93ca-44df-b722-b4da89f037b4.jpg",
    title: "Club Showcase & Mentorship",
    alt: "Club showcase",
    sub: "Roadmap",
  },
  {
    src: "images_events/freshers/bcf75357-24b8-4f80-9f7e-5f6156373b8c.jpg",
    title: "Batch Celebration & Group Photo",
    alt: "Freshers together",
    sub: "Memories",
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

.page{min-height:100vh;min-height:100dvh;display:flex;flex-direction:column;padding-bottom:40px}
.page>.wrap{flex:1 0 auto;width:100%}
@media(max-width:700px){
  .facts{gap:6px}
  .fact{padding:6px 6px;column-gap:6px}
  .fact b{font-size:10.5px}
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
.title h1{background:linear-gradient(135deg,#FFFFFF 0%,#A879E6 60%,#7C9BFF 100%)!important;-webkit-background-clip:text!important;background-clip:text!important;color:transparent!important;-webkit-text-fill-color:transparent!important;filter:drop-shadow(0 6px 26px rgba(130,68,179,.5))}
.title::after{content:"";display:block;width:72px;height:3px;margin:14px auto 0;border-radius:3px;background:var(--teal-gradient)}
.fact{backdrop-filter:blur(10px);transition:transform .25s,border-color .25s,box-shadow .25s}
.fact:hover{transform:translateY(-3px);border-color:var(--glass-border-hover);box-shadow:0 10px 24px rgba(130,68,179,.28)}
.fact svg{box-sizing:content-box;padding:3px;border-radius:50%;background:rgba(168,121,230,.16)}
.btn{position:relative;overflow:hidden;box-shadow:0 8px 28px rgba(130,68,179,.45)}
.btn::after{content:"";position:absolute;top:0;left:-60%;width:40%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.35),transparent);transform:skewX(-20deg);animation:shine 3.6s ease-in-out infinite;pointer-events:none}
.about{position:relative;isolation:isolate;overflow:hidden;backdrop-filter:blur(12px);box-shadow:0 20px 50px rgba(0,0,0,.35)}
.about::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--purple-gradient)}
.about::after{content:"";position:absolute;z-index:-1;right:-60px;top:-60px;width:200px;height:200px;background:radial-gradient(circle,rgba(168,121,230,.24),transparent 70%);pointer-events:none}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{transition:none!important;animation:none!important}}
`;

const PIN = (
  <>
    <path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </>
);

export default function QuestFreshers() {
  useEffect(() => {
    document.title = `${EVENT.title} | QUEST Events`;
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div className="page">
        <div className="wrap">
          <main id="top">
            {/* 1. Heading, centered at the top */}
            <section className="title">
              <h1>{EVENT.title}</h1>
            </section>

            {/* 2. Event details */}
            <section className="facts" aria-label="Event details">
              <div className="fact">
                <svg viewBox="0 0 24 24">
                  <rect x="4" y="5" width="16" height="15" rx="2" />
                  <path d="M4 10h16M9 3v4M15 3v4" />
                </svg>
                <small>Date</small>
                <b>{EVENT.date}</b>
              </div>
              <div className="fact">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="8" />
                  <path d="M12 8v4l3 2" />
                </svg>
                <small>Time</small>
                <b>{EVENT.time}</b>
              </div>
              <div className="fact">
                <svg viewBox="0 0 24 24">{PIN}</svg>
                <small>Place</small>
                <b>{EVENT.place}</b>
              </div>
            </section>
            <div className="cta">
              <a className="btn" id="register" href={EVENT.registerLink} target="_blank" rel="noopener noreferrer">
                Register
              </a>
            </div>

            {/* 3. About the event */}
            <section className="about" id="about">
              <h2>About the event</h2>
              <p>{EVENT.about}</p>
            </section>

            {/* 4. Responsive Event Photo Gallery */}
            <EventPhotoGallery
              photos={PHOTOS}
              eventTitle={EVENT.title}
              subtitle="Highlights from our campus welcome and senior induction session"
            />
          </main>
        </div>
      </div>
    </>
  );
}
