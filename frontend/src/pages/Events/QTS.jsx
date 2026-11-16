import { useEffect } from "react";
import EventPhotoGallery from "../../components/EventPhotoGallery";

const PHOTOS = [
  {
    src: "images_events/quest_test_series/photo1.jpeg",
    title: "Day 1 — Quantitative & Logical Aptitude",
    alt: "Quest Test Series photo 1",
    sub: "Day 1",
  },
  {
    src: "images_events/quest_test_series/photo2.jpeg",
    title: "Day 2 — Technical & Core Domain Test",
    alt: "Quest Test Series photo 2",
    sub: "Day 2",
  },
  {
    src: "images_events/quest_test_series/photo3.jpeg",
    title: "Day 3 — Group Discussion Simulation",
    alt: "Quest Test Series photo 3",
    sub: "Day 3",
  },
  {
    src: "images_events/quest_test_series/photo4.jpeg",
    title: "Day 4 — Personal Technical & HR Interview",
    alt: "Quest Test Series photo 4",
    sub: "Day 4",
  },
  {
    src: "images_events/quest_test_series/photo5.jpeg",
    title: "Mentor Evaluation & Direct Feedback",
    alt: "Quest Test Series photo 5",
    sub: "Evaluation",
  },
  {
    src: "images_events/quest_test_series/photo6.jpeg",
    title: "Felicitation of Top Performers",
    alt: "Quest Test Series photo 6",
    sub: "Winners",
  },
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
.facts{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;max-width:320px;margin:20px auto 0}
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

/* 3b. Three separate day sections */
.days{margin:28px auto 0;max-width:1000px;display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.day{padding:18px 18px 20px;border-radius:18px;background:var(--glass-card-bg);border:1px solid var(--glass-border);display:flex;flex-direction:column;gap:8px;position:relative;overflow:hidden;transition:border-color .25s,transform .25s,box-shadow .25s}
.day:hover{border-color:var(--glass-border-hover);transform:translateY(-4px);box-shadow:0 16px 36px rgba(130,68,179,.25)}
.day::before{content:"";position:absolute;top:0;left:0;right:0;height:2px;background:var(--purple-gradient)}
.day-tag{align-self:flex-start;font:600 11px var(--font-mono);color:var(--accent-teal);letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:6px;background:rgba(46,238,208,.1);border:1px solid rgba(46,238,208,.25)}
.day-venue{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:var(--text-dim)}
.day-venue svg{width:12px;height:12px;stroke:var(--color-secondary);fill:none;stroke-width:1.8}
.day h3{margin:4px 0 0;font-size:17px;color:var(--text-main);font-weight:700}
.day p{margin:0;color:var(--text-muted);line-height:1.6;font-size:13px}

.page{min-height:100vh;min-height:100dvh;display:flex;flex-direction:column;padding-bottom:40px}
.page>.wrap{flex:1 0 auto;width:100%}
@media(max-width:700px){
  .facts{gap:6px}
  .fact{padding:6px;column-gap:6px}
  .days{grid-template-columns:1fr;gap:10px}
}
@media(max-width:359px){
  .facts{grid-template-columns:1fr}
  .fact{justify-content:start;padding:6px 12px;column-gap:10px}
}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{transition:none!important;animation:none!important}}
`;

export default function QuestTestSeries() {
  useEffect(() => {
    document.title = "Quest Test Series | QUEST Events";
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div className="page">
        <div className="wrap">
          <main>
            <section className="title">
              <h1>Quest Test Series</h1>
            </section>

            {/* Date and time */}
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

            {/* Responsive Event Photo Gallery */}
            <EventPhotoGallery
              photos={PHOTOS}
              eventTitle="Quest Test Series"
              subtitle="Highlights from our 4-day intensive placement assessment series"
            />
          </main>
        </div>
      </div>
    </>
  );
}
