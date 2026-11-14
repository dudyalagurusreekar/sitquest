import { useEffect, useMemo, useState } from 'react'

const events = [
  { eventKey: 'freshers-event', title: 'Freshers Event', category: 'Community', description: 'Start your college journey with the QUEST community.', detail: 'Meet the QUEST community and find your place in the club. Share your details to complete your registration.', tag: 'WELCOME TO QUEST', tone: 'purple', dateLabel: 'Registration open', requiresPayment: false, requiresYear: false, number: '01' },
  { eventKey: 'placement-iq', title: 'Placement IQ', category: 'Career', description: 'Campus to Corporate: career strategy, high-CTC opportunities, resume and LinkedIn skills, and interview preparation.', detail: 'A practical workshop led by Sahana Shanbhag, Senior Analyst at Target Corporation.', tag: 'CAMPUS TO CORPORATE', tone: 'teal', dateLabel: '16 Nov 2026 · 5:15 PM', requiresPayment: false, requiresYear: true, number: '02' },
  { eventKey: 'quest-test-series', title: 'Quest Test Series (QTS)', category: 'Learning', description: 'Practice and challenge yourself with QTS.', detail: 'Join the Quest Test Series and take the next step in your learning journey. Submit your details and payment proof to complete your registration.', tag: 'LEARN BY DOING', tone: 'blue', dateLabel: 'Registration open', requiresPayment: true, requiresYear: true, number: '03' },
]

const categories = ['All events', ...new Set(events.map((event) => event.category))]

function EventArtwork({ eventKey }) {
  if (eventKey === 'freshers-event') return <svg className="absolute inset-0 z-[2] h-full w-full overflow-visible" viewBox="0 0 640 300" aria-hidden="true">
    <g className="animate-confetti fill-violet-300 motion-reduce:animate-none"><path d="M84 54l10 16-10 16-10-16z"/><path d="M520 40l7 12-7 12-7-12z"/><circle cx="150" cy="46" r="5"/><circle cx="475" cy="91" r="4"/><path d="M563 160h13m-6-7v14M74 192h13m-6-7v14"/></g>
    <g className="origin-center [transform-box:fill-box] animate-float-slow motion-reduce:animate-none"><path d="M131 127c-21-34-5-73 21-73s42 39 21 73c-10 16-32 16-42 0z" fill="#bd8bff"/><path d="M152 144q10 24 2 54" fill="none" stroke="#d5b7ff" strokeWidth="2"/><path d="M477 139c-21-34-5-73 21-73s42 39 21 73c-10 16-32 16-42 0z" fill="#a879e6"/><path d="M498 156q-10 18-3 40" fill="none" stroke="#c9a8ef" strokeWidth="2"/></g>
    <g className="origin-bottom [transform-box:fill-box] animate-gentle-rise motion-reduce:animate-none"><circle cx="250" cy="153" r="24" fill="#f4c9a6"/><path d="M210 245q3-66 40-66t40 66" fill="#8244b3"/><circle cx="320" cy="128" r="28" fill="#d7a985"/><path d="M271 245q3-82 49-82t49 82" fill="#a879e6"/><circle cx="390" cy="153" r="24" fill="#f2c7a3"/><path d="M350 245q3-66 40-66t40 66" fill="#7c6aa2"/><path className="origin-center [transform-box:fill-box] animate-gentle-wave motion-reduce:animate-none" d="M290 188l-28-37m70 37l26-38" fill="none" stroke="#f4c9a6" strokeWidth="12" strokeLinecap="round"/></g>
    <g className="animate-sparkle fill-violet-500 motion-reduce:animate-none"><path d="M208 100v22m-11-11h22M427 84v18m-9-9h18M320 48v18m-9-9h18"/></g>
  </svg>

  if (eventKey === 'placement-iq') return <svg className="absolute inset-0 z-[2] h-full w-full overflow-visible" viewBox="0 0 640 300" aria-hidden="true">
    <rect x="371" y="46" width="190" height="139" rx="13" fill="#fff" stroke="#a879e6" strokeOpacity=".85" strokeWidth="3"/><text x="466" y="82" textAnchor="middle" className="fill-violet-950 font-mono text-[12px] font-bold tracking-[2px]">PLACEMENT READY?</text><path d="M401 145h27v-19h27v19h26v-39h27v39h26" fill="none" stroke="#8244b3" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/><path d="M466 185v22m-50 0h100" stroke="#7d68ad" strokeWidth="5" strokeLinecap="round"/>
    <g className="origin-center [transform-box:fill-box] animate-speaker motion-reduce:animate-none"><circle cx="285" cy="103" r="27" fill="#e8b995"/><path d="M258 101q2-43 31-38 22 5 22 38-12-14-53 0" fill="#26202f"/><path d="M245 232q2-94 40-94t43 94" fill="#a879e6"/><path d="M285 152l47-34 28 5" fill="none" stroke="#e8b995" strokeWidth="12" strokeLinecap="round"/><path d="M286 169l-35 27" stroke="#e8b995" strokeWidth="11" strokeLinecap="round"/></g>
    <g className="animate-gentle-rise motion-reduce:animate-none"><circle cx="102" cy="224" r="22" fill="#e7bd9f"/><path d="M66 300q2-53 36-53t37 53" fill="#aa8ec8"/><circle cx="177" cy="235" r="18" fill="#c78f71"/><path d="M146 300q2-45 31-45t31 45" fill="#7c6aa2"/><circle cx="235" cy="231" r="20" fill="#f1c9a6"/><path d="M201 300q2-48 34-48t35 48" fill="#9c6ac5"/></g>
    <path className="animate-signal fill-none stroke-violet-600 [stroke-dasharray:5_7] motion-reduce:animate-none" d="M330 89q22 15 0 30m13-42q35 27 0 54" strokeWidth="4" strokeLinecap="round"/>
  </svg>

  return <svg className="absolute inset-0 z-[2] h-full w-full overflow-visible" viewBox="0 0 640 300" aria-hidden="true">
    <path className="animate-roadmap fill-none stroke-violet-400/70 [stroke-dasharray:7_12] motion-reduce:animate-none" d="M102 151h433" strokeWidth="5"/><path d="M521 137l18 14-18 14" fill="none" stroke="#a879e6" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    <g className="animate-node origin-center [transform-box:fill-box] motion-reduce:animate-none"><circle cx="145" cy="151" r="48" fill="#f1e5ff" stroke="#a879e6" strokeWidth="3"/><text x="145" y="161" textAnchor="middle" className="fill-violet-900 font-mono text-[20px] font-bold">&lt;/&gt;</text><text x="145" y="232" textAnchor="middle" className="fill-slate-700 font-mono text-[9px] font-bold tracking-[1px]">CODING + APTITUDE</text></g>
    <g className="animate-node origin-center [transform-box:fill-box] [animation-delay:1.1s] motion-reduce:animate-none"><circle cx="320" cy="151" r="48" fill="#f1e7fa" stroke="#a879e6" strokeWidth="3"/><path d="M296 139h47v28h-23l-15 12v-12h-9z" fill="none" stroke="#8f69b5" strokeWidth="4" strokeLinejoin="round"/><text x="320" y="232" textAnchor="middle" className="fill-slate-700 font-mono text-[9px] font-bold tracking-[1px]">GROUP DISCUSSION</text></g>
    <g className="animate-node origin-center [transform-box:fill-box] [animation-delay:2.2s] motion-reduce:animate-none"><circle cx="495" cy="151" r="48" fill="#e7ecff" stroke="#a879e6" strokeWidth="3"/><circle cx="495" cy="139" r="12" fill="none" stroke="#8068ae" strokeWidth="4"/><path d="M471 178q2-25 24-25t24 25" fill="none" stroke="#8068ae" strokeWidth="4" strokeLinecap="round"/><text x="495" y="232" textAnchor="middle" className="fill-slate-700 font-mono text-[9px] font-bold tracking-[1px]">PERSONAL INTERVIEW</text></g>
  </svg>
}

function cardTransform(position) {
  if (position === 'center') return 'translateX(-50%) translateZ(75px)'
  const direction = position === 'next' ? '+' : '-'
  return `translateX(calc(-50% ${direction} var(--card-side, min(39vw, 580px)))) translateZ(var(--card-depth, -220px)) rotateY(var(--card-rotation)) scale(var(--card-scale, .79))`
}

function StarField() {
  return <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
    <div className="absolute inset-0 bg-[url('/quest-stars.jpg')] bg-cover bg-center opacity-80" />
  </div>
}
function EventList({ onSelect }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All events')
  const filteredEvents = useMemo(() => events.filter((event) => (category === 'All events' || event.category === category) && `${event.title} ${event.description} ${event.category}`.toLowerCase().includes(query.toLowerCase())), [query, category])
  const currentEvent = filteredEvents[activeIndex]

  useEffect(() => {
    if (filteredEvents.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => setActiveIndex((index) => (index + 1) % filteredEvents.length), 2000)
    return () => window.clearInterval(timer)
  }, [filteredEvents.length])

  function move(direction) {
    setActiveIndex((index) => (index + direction + filteredEvents.length) % filteredEvents.length)
  }
  function changeCategory(value) {
    setCategory(value)
    setActiveIndex(0)
  }

  return <main id="events" className="relative isolate flex min-h-screen items-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_-8%,#7a3bab70_0,transparent_38%),radial-gradient(ellipse_at_8%_48%,#4a267044_0,transparent_34%),radial-gradient(ellipse_at_92%_75%,#62368a40_0,transparent_34%),#090711] font-sans text-white">
    <StarField/>
    <section className="relative z-10 mx-auto w-[min(1700px,calc(100%_-_13.4vw))] py-[70px] max-[850px]:w-[calc(100%_-_56px)] max-[560px]:w-[calc(100%_-_32px)] max-[560px]:py-[42px]">
      <div className="relative flex min-h-[92px] items-center justify-between gap-9 max-[850px]:flex-col max-[850px]:items-start">
        <div className="max-[850px]:pr-0 min-[851px]:pr-[520px]">
          <h1 id="events-title" className="m-0 bg-gradient-to-r from-white via-violet-100 to-quest-lavender bg-clip-text text-[clamp(38px,4vw,66px)] font-extrabold leading-[1.04] tracking-[-.065em] text-transparent drop-shadow-[0_0_30px_#a879e633] max-[560px]:text-[37px]">A Search Within.</h1>
        </div>
        <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center justify-end gap-3 max-[850px]:static max-[850px]:mt-6 max-[850px]:w-full max-[850px]:translate-y-0 max-[560px]:gap-2">
          <label className="flex h-[54px] w-[clamp(220px,22vw,360px)] items-center gap-3 rounded-[12px] border border-quest-lavender/25 bg-[#171120]/80 px-[17px] shadow-[0_8px_34px_#0005,0_0_24px_#8244b322] transition focus-within:border-quest-lavender/70 focus-within:ring-2 focus-within:ring-quest-lavender/20 max-[850px]:w-auto max-[850px]:flex-1 max-[560px]:h-[46px] max-[560px]:gap-2 max-[560px]:px-[11px]">
            <span aria-hidden="true" className="-rotate-12 font-mono text-[27px] text-quest-lavender">⌕</span><input aria-label="Search events" placeholder="Search events" value={query} onChange={(e) => { setQuery(e.target.value); setActiveIndex(0) }} className="w-full border-0 bg-transparent text-[13px] text-white outline-none placeholder:text-slate-500 max-[560px]:text-[10px]"/>
          </label>
          <label className="flex h-[54px] items-center gap-3 rounded-[12px] border border-quest-lavender/25 bg-[#171120]/80 px-4 font-mono text-[9px] tracking-[.13em] text-slate-400 shadow-[0_8px_34px_#0005,0_0_24px_#8244b322] transition hover:border-quest-lavender/50 max-[560px]:h-[46px] max-[560px]:gap-1 max-[560px]:px-[11px] max-[560px]:text-[7px]">
            <span>SHOW</span><select value={category} onChange={(e) => changeCategory(e.target.value)} className="max-w-none cursor-pointer border-0 bg-transparent font-sans text-xs text-white outline-none max-[560px]:max-w-[96px] max-[560px]:text-[10px]">{categories.map((item) => <option className="bg-violet-950" key={item}>{item}</option>)}</select>
          </label>
        </div>
      </div>

      {filteredEvents.length ? <>
        <div className="relative mt-[34px] h-[clamp(500px,45vw,635px)] rounded-[36px] bg-[radial-gradient(ellipse_at_50%_50%,#a879e610,transparent_68%)] [perspective:1600px] [perspective-origin:50%_46%] [--card-side:min(39vw,580px)] [--card-depth:-220px] [--card-scale:.79] max-[850px]:h-[550px] max-[850px]:[--card-side:min(38vw,400px)] max-[850px]:[--card-scale:.76] max-[560px]:mt-[14px] max-[560px]:h-[470px] max-[560px]:[perspective:1000px] max-[560px]:[--card-side:43vw] max-[560px]:[--card-depth:-200px] max-[560px]:[--card-scale:.71]" aria-label="Opportunity carousel" onKeyDown={(e) => { if (e.key === 'ArrowRight') { e.preventDefault(); move(1) } if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1) } }} tabIndex="0">
          {filteredEvents.map((event, index) => {
            const offset = (index - activeIndex + filteredEvents.length) % filteredEvents.length
            const position = offset === 0 ? 'center' : offset === 1 ? 'next' : 'previous'
            const center = position === 'center'
            const artBackground = event.tone === 'purple' ? 'bg-[radial-gradient(ellipse_at_50%_105%,#d9b5ffb0,transparent_68%),linear-gradient(145deg,#fff7ff,#f1e8fa)]' : event.tone === 'teal' ? 'bg-[radial-gradient(ellipse_at_50%_105%,#d9c4f8b8,transparent_68%),linear-gradient(145deg,#fff8ff,#eee5f8)]' : 'bg-[radial-gradient(ellipse_at_50%_105%,#c8b5eab8,transparent_68%),linear-gradient(145deg,#fbf7ff,#eee8f7)]'
            const rotationClass = position === 'next' ? '[--card-rotation:-24deg] max-[560px]:[--card-rotation:-28deg]' : position === 'previous' ? '[--card-rotation:24deg] max-[560px]:[--card-rotation:28deg]' : ''
            return <button type="button" className={`absolute left-1/2 top-[13px] flex h-[calc(100%_-_22px)] w-[min(680px,54vw)] flex-col overflow-hidden rounded-[17px] border border-white/15 bg-gradient-to-br from-[#171020] to-[#0f0d15] p-0 text-left text-white shadow-[0_24px_70px_#0008] transition-[transform,opacity,filter,box-shadow,border-color] duration-[900ms] ease-[cubic-bezier(.18,.72,.22,1)] will-change-transform max-[850px]:w-[min(610px,70vw)] max-[560px]:top-2 max-[560px]:h-[calc(100%_-_34px)] max-[560px]:w-[min(400px,84vw)] max-[560px]:rounded-[13px] ${rotationClass} ${center ? 'z-20 border-quest-lavender/70 opacity-100 shadow-[0_32px_90px_#000a,0_0_70px_#a879e666,0_0_130px_#8244b344]' : 'z-10 border-white/10 opacity-[.65] blur-[3px] saturate-[.65] hover:opacity-[.83] hover:blur-[1.5px] max-[560px]:opacity-50'} focus-visible:outline-2 focus-visible:outline-quest-lavender`} style={{ transform: cardTransform(position) }} data-position={position} aria-label={`Open ${event.title}`} aria-current={center ? 'true' : undefined} key={event.eventKey} onClick={() => onSelect(event)}>
              <div className={`relative isolate grid h-[56%] shrink-0 place-items-center overflow-hidden max-[560px]:h-[51%] ${artBackground}`}>
                <div className="absolute inset-0 z-0 bg-[linear-gradient(#5039680b_1px,transparent_1px),linear-gradient(90deg,#5039680b_1px,transparent_1px)] [background-size:34px_34px] [mask-image:linear-gradient(transparent,#000)]"/>
                <div className="pointer-events-none absolute left-1/2 top-[49%] z-[1] aspect-square w-[min(68%,390px)] -translate-x-1/2 -translate-y-1/2 rotate-[-16deg] scale-y-[.52] rounded-full border border-violet-900/15 animate-art-orbit motion-reduce:animate-none"/>
                <div className="pointer-events-none absolute left-1/2 top-[49%] z-[1] aspect-square w-[min(54%,310px)] -translate-x-1/2 -translate-y-1/2 rotate-[34deg] scale-y-[.48] rounded-full border border-quest-lavender/20 animate-art-orbit-reverse motion-reduce:animate-none"/>
                <EventArtwork eventKey={event.eventKey}/>
                <span className="absolute bottom-[19px] left-6 z-[3] font-mono text-[9px] tracking-[.16em] text-violet-950 max-[560px]:left-4 max-[560px]:text-[7px]">{event.tag}</span><span aria-hidden="true" className="absolute bottom-[14px] right-6 z-[3] font-mono text-[21px] text-violet-950 max-[560px]:bottom-[11px] max-[560px]:right-4 max-[560px]:text-[17px]">↗</span>
              </div>
              <div className="flex h-[44%] flex-col bg-[radial-gradient(ellipse_at_50%_0%,#8244b322,transparent_65%)] p-[clamp(20px,2.1vw,32px)] max-[560px]:h-[49%] max-[560px]:p-[17px]">
                <div className="flex justify-between gap-2 font-mono text-[10px] text-violet-200 max-[560px]:text-[8px]"><span>{event.category}</span></div>
                <div className="mt-[17px] mb-[10px] w-fit max-w-full max-[560px]:mb-[7px] max-[560px]:mt-[13px]">
                  <h2 className="m-0 bg-gradient-to-r from-white via-violet-100 to-quest-lavender bg-clip-text text-[clamp(25px,2.4vw,37px)] font-extrabold tracking-[-.05em] text-transparent drop-shadow-[0_0_22px_#c59cffaa] max-[560px]:text-[23px]">{event.title}</h2>
                </div>
                <p className="m-0 text-[clamp(13px,1.1vw,16px)] leading-[1.7] text-slate-300 max-[560px]:text-[11px]">{event.description}</p>
                <span className="mt-auto block border-t border-white/15 pt-[17px] text-xs font-bold max-[560px]:pt-3 max-[560px]:text-[10px]">View event details <i className="float-right font-mono text-[19px] not-italic text-quest-lavender">↗</i></span>
              </div>
            </button>
          })}
          {filteredEvents.length > 1 && <><button type="button" className="absolute left-0 top-[46%] z-30 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-[#11101add] font-mono text-[27px] text-white shadow-lg transition hover:scale-105 hover:border-quest-lavender hover:bg-quest-purple focus-visible:outline-2 focus-visible:outline-quest-lavender max-[560px]:-left-2 max-[560px]:h-[41px] max-[560px]:w-[41px] max-[560px]:text-xl" aria-label="Previous event" onClick={() => move(-1)}>←</button><button type="button" className="absolute right-0 top-[46%] z-30 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-[#11101add] font-mono text-[27px] text-white shadow-lg transition hover:scale-105 hover:border-quest-lavender hover:bg-quest-purple focus-visible:outline-2 focus-visible:outline-quest-lavender max-[560px]:-right-2 max-[560px]:h-[41px] max-[560px]:w-[41px] max-[560px]:text-xl" aria-label="Next event" onClick={() => move(1)}>→</button></>}
        </div>
        <div className="mx-auto mt-[-2px] flex w-[min(680px,54vw)] items-center gap-[11px] font-mono text-[9px] tracking-[.06em] text-slate-400 max-[850px]:w-[min(610px,70vw)] max-[560px]:w-[calc(100%_-_14px)] max-[560px]:gap-2 max-[560px]:text-[8px]">
          <span className="text-quest-lavender">{currentEvent?.title}</span><span className="flex-1"/>{filteredEvents.map((event, index) => <button type="button" key={event.eventKey} className={`h-[7px] rounded-full p-0 transition-all ${index === activeIndex ? 'w-[23px] bg-quest-lavender shadow-[0_0_11px_#b78fdf]' : 'w-[7px] bg-white/25'}`} aria-label={`Show ${event.title}`} aria-pressed={index === activeIndex} onClick={() => setActiveIndex(index)}/>)}</div>
      </> : <div className="mt-6 rounded-xl border border-dashed border-white/20 p-14 text-center text-slate-400"><span className="text-4xl text-quest-lavender">⌕</span><h2 className="text-white">No events found</h2><p>Try a different search or category.</p><button className="text-quest-lavender" onClick={() => { setQuery(''); changeCategory('All events') }}>Reset filters</button></div>}
    </section>
  </main>
}


const fakeQr = Array.from({ length: 441 }, (_, index) => ((index * 17 + Math.floor(index / 7) * 11 + (index % 9) * (index % 5)) % 13) < 6)

const inputClass = 'h-12 w-full rounded-lg border border-white/15 bg-[#0d0b13] px-3.5 text-[13px] text-white outline-none placeholder:text-slate-500 focus:border-quest-lavender focus:ring-2 focus:ring-quest-lavender/15 max-[680px]:h-[45px] max-[680px]:text-xs'

function TextField({ label, name, value, onChange, ...props }) {
  return <label className="flex flex-col gap-2 text-xs font-semibold text-violet-100"><span>{label} <span className="text-quest-lavender" aria-hidden="true">*</span></span><input className={inputClass} name={name} value={value} onChange={onChange} {...props}/></label>
}

function EventRegistration({ event, onBack, onRegistrationSubmit }) {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', usn: '', year: '', department: '' })
  const [snapshot, setSnapshot] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    if (!formOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOnEscape = (e) => { if (e.key === 'Escape') setFormOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', closeOnEscape) }
  }, [formOpen])

  const paymentRequired = event.requiresPayment
  const yearRequired = event.requiresYear
  const registrationClosed = event.eventKey === 'freshers-event'
  const setField = (e) => setForm((current) => ({ ...current, [e.target.name]: e.target.value }))

  function setFile(e) {
    const file = e.target.files?.[0]
    if (file && file.size > 5 * 1024 * 1024) {
      setSnapshot(null)
      setNotice({ type: 'error', text: 'The image must be 5 MB or smaller.' })
      e.target.value = ''
      return
    }
    setSnapshot(file || null)
    setNotice(null)
  }

  function submit(e) {
    e.preventDefault()
    setNotice(null)
    if (registrationClosed) {
      setNotice({ type: 'error', text: 'Registrations for this event are closed.' })
      return
    }
    if (paymentRequired && !snapshot) {
      setNotice({ type: 'error', text: 'Upload your payment screenshot to continue.' })
      return
    }
    const registration = { ...form, eventKey: event.eventKey, eventTitle: event.title, paymentSnapshot: snapshot }
    onRegistrationSubmit?.(registration)
    window.dispatchEvent(new CustomEvent('quest:registration-submit', { detail: registration }))
    setNotice({ type: 'success', text: 'Your details are ready. The QUEST team will connect this form to its registration sheet.' })
  }

  const description = 'A new chapter begins! Meet your people, celebrate fresh starts, and make unforgettable memories with the QUEST community. We can’t wait to welcome you.'
  const detailsWidth = 'w-[min(1450px,calc(100%_-_72px))] max-[900px]:w-[calc(100%_-_48px)] max-[680px]:w-[calc(100%_-_36px)]'

  return <main className="relative isolate min-h-screen bg-[radial-gradient(ellipse_at_70%_0%,#51287255_0,transparent_42%),radial-gradient(ellipse_at_8%_70%,#32195430_0,transparent_35%),#090711] font-sans text-white">
    <StarField/>
    <header className={`${detailsWidth} relative z-10 mx-auto flex h-[72px] max-w-[1450px] items-center justify-between border-b border-white/10 max-[680px]:h-[62px]`}>
      <button className="text-left text-xs text-slate-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-quest-lavender" onClick={onBack}><span className="mr-2 font-mono text-lg text-quest-lavender">←</span>All events</button>
      <img className="h-[70px] w-[118px] object-contain max-[680px]:h-[58px] max-[680px]:w-[88px]" style={{ mixBlendMode: 'screen' }} src="/quest-logo.jpeg" alt="QUEST — A Search Within"/>
      <span className="w-20 max-[680px]:w-10" aria-hidden="true"/>
    </header>

    <section className={`${detailsWidth} relative z-10 mx-auto mt-[34px] grid min-h-[330px] grid-cols-[1fr_.92fr] items-center gap-[54px] rounded-[22px] border border-quest-lavender/15 bg-white/[.015] p-6 shadow-[0_0_60px_#58297922,inset_0_1px_0_#ffffff0a] max-[900px]:gap-[30px] max-[680px]:mt-[22px] max-[680px]:flex max-[680px]:flex-col max-[680px]:items-stretch max-[680px]:gap-5 max-[680px]:p-3`}>
      <div className="event-detail-copy order-1 max-[680px]:order-2" data-event-key={event.eventKey}>
        <style>{`@media screen and (min-width: 901px) and (orientation: landscape) { .event-detail-copy[data-event-key="freshers-event"], .event-detail-copy[data-event-key="placement-iq"] { transform: translateY(-18px); } .event-detail-copy[data-event-key="freshers-event"] .event-detail-meta, .event-detail-copy[data-event-key="placement-iq"] .event-detail-meta { flex-direction: column; align-items: flex-start; gap: 15px; } }`}</style>
        <div className="relative z-0 mb-[31px] mt-0 w-fit max-w-full px-2 py-1 max-[680px]:mb-[19px]">
          <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[155%] w-[112%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-quest-lavender/45 shadow-[0_0_16px_#b994e466] animate-art-orbit motion-reduce:animate-none"/>
          <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[135%] w-[120%] -translate-x-1/2 -translate-y-1/2 rotate-[35deg] rounded-[50%] border border-violet-300/30 shadow-[0_0_18px_#8244b355] animate-art-orbit-reverse motion-reduce:animate-none"/>
          <h1 className="m-0 bg-gradient-to-r from-white via-violet-100 to-quest-lavender bg-clip-text text-[clamp(44px,5.7vw,78px)] font-extrabold leading-[1.02] tracking-[-.065em] text-transparent drop-shadow-[0_0_22px_#a879e655] max-[680px]:text-[clamp(34px,9.5vw,52px)]">{event.title}</h1>
        </div>
        <div className="event-detail-meta flex flex-wrap items-center gap-[30px] max-[680px]:gap-x-[22px] max-[680px]:gap-y-[15px]">
          <div className="flex items-center gap-[11px]"><span className="font-mono text-2xl text-quest-lavender max-[680px]:text-xl">◷</span><span className="flex flex-col gap-[5px]"><small className="font-mono text-[8px] tracking-[.15em] text-slate-400">DATE</small><b className="text-[13px] font-semibold text-slate-200 max-[680px]:text-[11px]">{event.eventKey === 'placement-iq' ? '16 Nov 2026 · 5:15 PM' : event.eventKey === 'freshers-event' ? '5 Oct 2026 · 5:15 PM' : 'To be announced'}</b></span></div>
          {event.eventKey !== 'quest-test-series' && <div className="flex items-center gap-[11px]"><span className="font-mono text-2xl text-quest-lavender max-[680px]:text-xl">⌖</span><span className="flex flex-col gap-[5px]"><small className="font-mono text-[8px] tracking-[.15em] text-slate-400">LOCATION</small><b className="text-[13px] font-semibold text-slate-200 max-[680px]:text-[11px]">{event.eventKey === 'freshers-event' ? 'Birla Auditorium' : 'Media Centre'}</b></span></div>}
        </div>
      </div>
      <div className="relative order-2 h-[clamp(300px,27vw,430px)] min-h-[300px] overflow-hidden rounded-[18px] border border-white/10 bg-gradient-to-br from-white/[.04] to-white/[.01] shadow-[inset_0_0_55px_#8244b315,0_20px_65px_#0005] max-[680px]:order-1 max-[680px]:h-[clamp(190px,55vw,290px)] max-[680px]:min-h-[190px] max-[680px]:rounded-[13px]">
        {event.eventKey === 'placement-iq' && <img className="h-full w-full bg-white object-contain" src="/placement-iq-poster.jpeg" alt="Placement IQ workshop poster"/>}
        {event.eventKey === 'quest-test-series' && <img className="h-full w-full bg-white object-contain" src="/qts-poster.png" alt="Quest Test Series placement readiness poster"/>}
        {event.eventKey === 'freshers-event' && <img className="h-full w-full bg-white object-contain" src="/freshers-poster.png" alt="Luna Freshers event poster, 5 October 2026 at Birla Auditorium"/>}
      </div>
    </section>

    <section className={`${detailsWidth} relative z-10 mx-auto mb-[70px] mt-[54px] grid grid-cols-[minmax(0,1fr)_360px] grid-rows-[auto_1fr] gap-x-[52px] gap-y-0 max-[900px]:grid-cols-[minmax(0,1fr)_310px] max-[900px]:gap-x-7 max-[680px]:mb-[45px] max-[680px]:mt-[34px] max-[680px]:flex max-[680px]:flex-col max-[680px]:gap-6`}>
      <div className="contents">
        <div className="col-start-1 row-start-1 mb-[27px] flex items-center gap-[15px] max-[680px]:mb-[17px] max-[680px]:gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-quest-lavender/10 font-mono text-[23px] text-quest-lavender shadow-[0_0_25px_#b78fdf12] max-[680px]:h-[41px] max-[680px]:w-[41px]">i</span><span><h2 className="mb-1 mt-0 text-[27px] font-bold tracking-[-.035em] max-[680px]:text-[22px]">Event Details</h2><p className="m-0 text-[11px] text-slate-400">Everything you need to know</p></span>
        </div>
      <article className="col-start-1 row-start-2 self-start rounded-[18px] border border-quest-lavender/20 bg-gradient-to-br from-[#1b1226]/90 to-[#0f0c16]/95 p-[26px_29px] shadow-[0_0_32px_#8244b322,inset_0_1px_0_#ffffff0a] max-[680px]:p-5">
          <h3 className="mb-[18px] mt-0 border-l-[3px] border-quest-lavender pl-[14px] text-lg font-bold max-[680px]:mb-[13px] max-[680px]:text-base">Description</h3>
          {event.eventKey === 'placement-iq' ? <>
            <p className="m-0 max-w-[880px] text-[15px] leading-[1.9] text-slate-300 max-[680px]:text-xs max-[680px]:leading-[1.8]"><strong>Placement IQ: Campus to Corporate</strong> is a practical QUEST workshop to help students prepare for the move from campus into the workplace.</p>
            <h4 className="mb-2 mt-[22px] text-[15px] font-semibold text-violet-100">Workshop topics</h4>
            <ul className="grid list-none grid-cols-2 gap-x-5 gap-y-2.5 p-0 max-[680px]:grid-cols-1">{['Career strategies and roadmap', 'How to secure high-CTC jobs', 'Resume building and LinkedIn optimization', 'Technical and HR interview preparation'].map((topic) => <li className="rounded-lg border border-quest-lavender/15 bg-quest-lavender/[.04] p-3 text-xs leading-relaxed text-violet-100/85" key={topic}>{topic}</li>)}</ul>
            <article className="mt-5 rounded-xl border border-quest-lavender/20 bg-quest-lavender/[.04] p-4"><span className="font-mono text-[8px] font-bold tracking-[.13em] text-quest-lavender">SPEAKER</span><h4 className="mb-1 mt-2 text-lg font-bold">Sahana Shanbhag</h4><p className="m-0 text-xs font-semibold text-violet-200">Senior Analyst · Target Corporation</p></article>
          </> : event.eventKey === 'quest-test-series' ? <>
            <p className="m-0 max-w-[880px] text-[15px] leading-[1.9] text-slate-300 max-[680px]:text-xs max-[680px]:leading-[1.8]">Quest Test Series (QTS) is a three-day event featuring:</p>
            <ul className="m-0 flex list-none flex-col p-0">{[
              ['Coding and aptitude test', 'A common aptitude test, with separate coding tests for IT branches and circuit branches.', 'Day 1'],
              ['Group discussion', 'Share ideas on a topic, listen actively, and communicate clearly with the group.', 'Day 2'],
              ['Personal interview', 'Discuss your interests, strengths, and goals in a one-to-one interview.', 'Day 3'],
            ].map(([title, detail, day], index) => <li className="flex items-start gap-[15px] border-t border-white/10 px-[3px] py-4 max-[680px]:gap-3 max-[680px]:py-[13px]" key={title}><span className="pt-1 font-mono text-[10px] text-quest-lavender">0{index + 1}</span><div className="flex min-w-0 flex-col gap-1.5"><b className="text-sm font-semibold text-violet-100 max-[680px]:text-xs">{title}</b><p className="m-0 text-xs leading-relaxed text-slate-300 max-[680px]:text-[10px]">{detail}</p><div className="mt-1 flex flex-wrap gap-2"><span className="rounded border border-white/10 bg-white/[.03] px-2 py-1 font-mono text-[8px] text-slate-300">{day} · Date to be announced</span><span className="rounded border border-white/10 bg-white/[.03] px-2 py-1 font-mono text-[8px] text-slate-300">Location to be announced</span></div></div></li>)}</ul>
          </> : <p className="m-0 max-w-[880px] text-[15px] leading-[1.9] text-slate-300 max-[680px]:text-xs max-[680px]:leading-[1.8]">{description}</p>}
        </article>
      </div>
      <aside className="sticky top-[25px] col-start-2 row-start-2 self-start rounded-[20px] border border-quest-lavender/40 bg-gradient-to-br from-[#29183a] via-[#1b1226] to-[#100d18] p-7 text-center shadow-[0_20px_55px_#0005,0_0_36px_#8244b32e,inset_0_1px_0_#ffffff12] max-[900px]:px-5 max-[900px]:py-[23px] max-[680px]:static max-[680px]:w-full max-[680px]:p-5">
        <h2 className="mb-5 mt-0 text-[23px] font-bold tracking-[-.04em] max-[680px]:mb-[15px] max-[680px]:text-xl">Reserve your spot</h2><button type="button" onClick={() => { setFormOpen(true); setNotice(null) }} className={`w-full rounded-[9px] px-4 py-4 text-sm font-extrabold transition duration-200 focus-visible:outline-2 focus-visible:outline-quest-lavender max-[680px]:py-[15px] max-[680px]:text-[13px] ${registrationClosed ? 'cursor-pointer bg-slate-700/70 text-slate-300 shadow-[0_0_14px_#ffffff12]' : 'bg-gradient-to-r from-quest-purple to-quest-lavender text-white shadow-[0_9px_25px_#8244b344] hover:-translate-y-0.5 hover:brightness-110'}`}>{registrationClosed ? 'Registrations closed' : 'Register now'} <span className="float-right font-mono text-lg">→</span></button>
      </aside>
    </section>

    <footer className={`${detailsWidth} relative z-10 mx-auto flex h-[65px] items-center justify-between border-t border-quest-lavender/15 font-mono text-[9px] tracking-[.12em] text-violet-200/65 max-[680px]:h-[58px] max-[680px]:text-[7px]`}><span>QUEST · EVENT REGISTRATION</span><button className="fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full border border-quest-lavender/40 bg-[#1a1028]/90 text-2xl text-quest-lavender shadow-[0_0_28px_#8244b366] transition hover:-translate-y-1 hover:bg-quest-purple" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">↑</button></footer>

    {formOpen && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-[#05050b]/90 p-6 backdrop-blur-[9px] animate-overlay-in max-[680px]:p-3 motion-reduce:animate-none" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setFormOpen(false) }}>
      <section className="max-h-[min(92vh,980px)] w-full max-w-[590px] overflow-y-auto rounded-[20px] border border-quest-lavender/50 bg-[radial-gradient(ellipse_at_100%_0%,#8244b32a,transparent_42%),linear-gradient(145deg,#21162e,#100d18)] p-[30px] shadow-[0_30px_100px_#000b,0_0_48px_#8244b333,inset_0_1px_0_#ffffff12] animate-modal-in max-[680px]:max-h-[calc(100svh_-_24px)] max-[680px]:rounded-[17px] max-[680px]:px-[18px] max-[680px]:py-[22px] motion-reduce:animate-none" role="dialog" aria-modal="true" aria-labelledby="registration-title">
        <div className="mb-[23px] flex items-start justify-between gap-[15px] max-[680px]:mb-[17px]"><div><p className="mb-2 mt-0 font-mono text-[9px] font-bold tracking-[.12em] text-quest-lavender">{event.title}</p><h2 id="registration-title" className="m-0 text-[25px] font-bold tracking-[-.045em] max-[680px]:text-[21px]">Complete your registration</h2></div><button className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[.03] font-mono text-[23px] transition hover:rotate-90 hover:bg-white/10" type="button" aria-label="Close registration" onClick={() => setFormOpen(false)}>×</button></div>
        {notice && <div className={`mb-3 rounded-lg border px-3 py-3 text-[10px] leading-relaxed ${notice.type === 'error' ? 'border-red-400/25 bg-red-950/30 text-red-200' : 'border-quest-lavender/30 bg-quest-lavender/10 text-violet-100'}`} role={notice.type === 'error' ? 'alert' : 'status'}>{notice.text}{notice.reference && <strong className="mt-1 block font-mono text-xs text-white">{notice.reference}</strong>}</div>}
        <form className="flex flex-col gap-4 max-[680px]:gap-[13px]" onSubmit={submit}>
          <TextField label="Full name" name="fullName" autoComplete="name" placeholder="Enter your full name" value={form.fullName} onChange={setField} minLength="2" maxLength="100" disabled={registrationClosed} required/>
          <TextField label="Email address" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={setField} maxLength="254" disabled={registrationClosed} required/>
          <TextField label="Phone number" name="phone" type="tel" autoComplete="tel" inputMode="numeric" placeholder="10 digit phone number" value={form.phone} onChange={setField} pattern="[0-9]{10}" minLength="10" maxLength="10" title="Enter a 10 digit phone number" disabled={registrationClosed} required/>
          <TextField label="USN" name="usn" placeholder="Enter your university seat number" value={form.usn} onChange={setField} maxLength="30" disabled={registrationClosed} required/>
          {yearRequired && <label className="flex flex-col gap-2 text-xs font-semibold text-violet-100"><span>Year of study <span className="text-quest-lavender" aria-hidden="true">*</span></span><select className={inputClass} name="year" value={form.year} onChange={setField} disabled={registrationClosed} required><option value="">Select year</option>{['1st Year', '2nd Year', '3rd Year', '4th Year'].map((year) => <option className="bg-[#15101b]" key={year}>{year}</option>)}</select></label>}
          <label className="flex flex-col gap-2 text-xs font-semibold text-violet-100"><span>Department <span className="text-quest-lavender" aria-hidden="true">*</span></span><select className={inputClass} name="department" value={form.department} onChange={setField} disabled={registrationClosed} required><option value="">Select department</option>{['CSE', 'ISE', 'AIML', 'AIDS', 'EC', 'ET', 'EEE', 'EI', 'IM', 'ME', 'BT', 'CH'].map((department) => <option className="bg-[#15101b]" key={department}>{department}</option>)}</select></label>
          {paymentRequired && <div className="mt-1 border-t border-white/10 pt-[18px]">
            <div className="mb-[13px] flex items-center justify-between"><div><p className="mb-1 mt-0 font-mono text-[8px] font-bold tracking-[.13em] text-quest-lavender">QTS PAYMENT</p><h3 className="m-0 text-base font-bold">Scan & pay</h3></div></div>
            <div className="mb-[13px] flex items-center gap-[15px] rounded-lg border border-quest-lavender/20 bg-[#0d0b13] p-[13px] shadow-[0_0_24px_#8244b32b] max-[680px]:gap-[11px] max-[680px]:p-[10px]"><div className="flex shrink-0 flex-col items-center gap-[5px] rounded bg-white p-2"><div className="grid h-[91px] w-[91px] grid-cols-[repeat(21,minmax(0,1fr))] grid-rows-[repeat(21,minmax(0,1fr))] gap-px bg-white max-[680px]:h-[78px] max-[680px]:w-[78px]" role="img" aria-label="Payment QR code">{fakeQr.map((active, index) => <i className={active ? 'bg-[#15111d]' : ''} key={index}/>)}</div></div><div><b className="text-[11px]">Payment QR code</b><p className="mb-0 mt-[5px] text-[9px] leading-relaxed text-slate-300">Scan to complete your QTS payment, then upload the receipt.</p></div></div>
            <label className="relative flex min-h-[61px] cursor-pointer items-center gap-[11px] rounded-lg border border-dashed border-quest-lavender/35 bg-quest-purple/10 px-[13px] py-[10px] transition-colors hover:border-quest-lavender"><span className="grid h-[30px] w-[30px] place-items-center rounded-md bg-quest-lavender/15 font-mono text-[17px] text-violet-200">↑</span><span className="flex min-w-0 flex-1 flex-col gap-1"><b className="text-[10px] text-violet-50">Payment screenshot</b><small className="overflow-hidden text-ellipsis whitespace-nowrap text-[8px] text-slate-400">{snapshot ? snapshot.name : 'PNG, JPG or WEBP · up to 5 MB'}</small></span><input className="absolute inset-0 h-full w-full cursor-pointer opacity-0" type="file" accept="image/png,image/jpeg,image/webp" onChange={setFile} disabled={registrationClosed} required/><span className="text-[9px] font-bold text-quest-lavender">Browse</span></label>
          </div>}
          {!registrationClosed && <button className="h-[49px] rounded-lg bg-gradient-to-r from-quest-purple to-quest-lavender text-[13px] font-extrabold text-white shadow-[0_8px_25px_#8244b333] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-quest-lavender" type="submit">Register now <span className="float-right mr-4 font-mono">↗</span></button>}
          {registrationClosed && <p className="m-0 rounded-lg border border-slate-500/30 bg-slate-800/40 p-3 text-center text-xs font-semibold text-slate-300">Registrations are closed for this event.</p>}
          <p className="-mt-1 mb-0 text-center text-[9px] leading-relaxed text-slate-400">Your details will be connected to the QUEST registration sheet.</p>
        </form>
      </section>
    </div>}
  </main>
}


export default function Registrations() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  if (selectedEvent) return <EventRegistration event={selectedEvent} onBack={() => setSelectedEvent(null)} />
  return <EventList onSelect={setSelectedEvent} />
}
