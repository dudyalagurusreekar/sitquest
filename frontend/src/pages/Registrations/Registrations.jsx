import { useEffect, useState } from 'react'

const fakeQr = Array.from({ length: 441 }, (_, index) => ((index * 17 + Math.floor(index / 7) * 11 + (index % 9) * (index % 5)) % 13) < 6)

const inputClass = 'h-12 w-full rounded-lg border border-white/15 bg-[#0d0b13] px-3.5 text-[13px] text-white outline-none placeholder:text-slate-500 focus:border-quest-lavender focus:ring-2 focus:ring-quest-lavender/15 max-[680px]:h-[45px] max-[680px]:text-xs'

function TextField({ label, name, value, onChange, ...props }) {
  return <label className="flex flex-col gap-2 text-xs font-semibold text-violet-100">{label}<input className={inputClass} name={name} value={value} onChange={onChange} {...props}/></label>
}

export default function Registrations({ event, onBack, onRegistrationSubmit }) {
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

  return <main className="min-h-screen bg-[radial-gradient(ellipse_at_70%_0%,#281437_0,transparent_40%),#090711] font-sans text-white">
    <header className={`${detailsWidth} mx-auto flex h-[72px] max-w-[1450px] items-center justify-between border-b border-white/10 max-[680px]:h-[62px]`}>
      <button className="text-left text-xs text-slate-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-quest-lavender" onClick={onBack}><span className="mr-2 font-mono text-lg text-quest-lavender">←</span>All events</button>
      <img className="h-[70px] w-[118px] object-contain [mix-blend-mode:lighten] max-[680px]:h-[58px] max-[680px]:w-[88px]" src="/quest-logo.jpeg" alt="QUEST — A Search Within"/>
      <span className="w-20 max-[680px]:w-10" aria-hidden="true"/>
    </header>

    <section className={`${detailsWidth} mx-auto mt-[34px] grid min-h-[330px] grid-cols-[1fr_.92fr] items-center gap-[54px] max-[900px]:gap-[30px] max-[680px]:mt-[22px] max-[680px]:flex max-[680px]:flex-col max-[680px]:items-stretch max-[680px]:gap-5`}>
      <div className="order-1 max-[680px]:order-2">
        <h1 className="mb-[31px] mt-0 max-w-[750px] text-[clamp(44px,5.7vw,78px)] font-extrabold leading-[1.02] tracking-[-.065em] max-[680px]:mb-[19px] max-[680px]:text-[clamp(34px,9.5vw,52px)]">{event.title}</h1>
        <div className="flex flex-wrap items-center gap-[30px] max-[680px]:gap-x-[22px] max-[680px]:gap-y-[15px]">
          <div className="flex items-center gap-[11px]"><span className="font-mono text-2xl text-quest-lavender max-[680px]:text-xl">◷</span><span className="flex flex-col gap-[5px]"><small className="font-mono text-[8px] tracking-[.15em] text-slate-400">DATE</small><b className="text-[13px] font-semibold text-slate-200 max-[680px]:text-[11px]">{event.eventKey === 'placement-iq' ? '16 Nov 2026 · 5:15 PM' : 'To be announced'}</b></span></div>
          {event.eventKey !== 'quest-test-series' && <div className="flex items-center gap-[11px]"><span className="font-mono text-2xl text-quest-lavender max-[680px]:text-xl">⌖</span><span className="flex flex-col gap-[5px]"><small className="font-mono text-[8px] tracking-[.15em] text-slate-400">LOCATION</small><b className="text-[13px] font-semibold text-slate-200 max-[680px]:text-[11px]">{event.eventKey === 'freshers-event' ? 'Birla Auditorium' : 'Media Centre'}</b></span></div>}
        </div>
      </div>
      <div className="relative order-2 h-[clamp(300px,27vw,430px)] min-h-[300px] overflow-hidden rounded-[18px] border border-white/10 bg-gradient-to-br from-white/[.04] to-white/[.01] shadow-[inset_0_0_55px_#8244b315,0_20px_65px_#0005] max-[680px]:order-1 max-[680px]:h-[clamp(190px,55vw,290px)] max-[680px]:min-h-[190px] max-[680px]:rounded-[13px]">
        {event.eventKey === 'placement-iq' && <img className="h-full w-full bg-white object-contain" src="/placement-iq-poster.jpeg" alt="Placement IQ: Campus to Corporate workshop with Sahana Shanbhag on 16 November 2026 at Media Centre"/>}
      </div>
    </section>

    <section className={`${detailsWidth} mx-auto mb-[70px] mt-[54px] grid grid-cols-[minmax(0,1fr)_360px] grid-rows-[auto_1fr] gap-x-[52px] gap-y-0 max-[900px]:grid-cols-[minmax(0,1fr)_310px] max-[900px]:gap-x-7 max-[680px]:mb-[45px] max-[680px]:mt-[34px] max-[680px]:flex max-[680px]:flex-col max-[680px]:gap-6`}>
      <div className="contents">
        <div className="col-start-1 row-start-1 mb-[27px] flex items-center gap-[15px] max-[680px]:mb-[17px] max-[680px]:gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-quest-lavender/10 font-mono text-[23px] text-quest-lavender shadow-[0_0_25px_#b78fdf12] max-[680px]:h-[41px] max-[680px]:w-[41px]">i</span><span><h2 className="mb-1 mt-0 text-[27px] font-bold tracking-[-.035em] max-[680px]:text-[22px]">Event Details</h2><p className="m-0 text-[11px] text-slate-400">Everything you need to know</p></span>
        </div>
        <article className="col-start-1 row-start-2 self-start rounded-[14px] border border-white/10 bg-gradient-to-br from-white/[.03] to-white/[.01] p-[26px_29px] max-[680px]:p-5">
          <h3 className="mb-[18px] mt-0 border-l-[3px] border-quest-lavender pl-[14px] text-lg font-bold max-[680px]:mb-[13px] max-[680px]:text-base">Description</h3>
          {event.eventKey === 'placement-iq' ? <>
            <p className="m-0 max-w-[880px] text-[15px] leading-[1.9] text-slate-300 max-[680px]:text-xs max-[680px]:leading-[1.8]"><strong>Placement IQ: Campus to Corporate</strong> is a practical QUEST workshop to help students prepare for the move from campus into the workplace.</p>
            <h4 className="mb-2 mt-[22px] text-[15px] font-semibold text-violet-100">Workshop topics</h4>
            <ul className="grid list-none grid-cols-2 gap-x-5 gap-y-2.5 p-0 max-[680px]:grid-cols-1">{['Career strategies and roadmap', 'How to secure high-CTC jobs', 'Resume building and LinkedIn optimization', 'Technical and HR interview preparation'].map((topic) => <li className="rounded-lg border border-quest-lavender/15 bg-quest-lavender/[.04] p-3 text-xs leading-relaxed text-violet-100/85" key={topic}>{topic}</li>)}</ul>
            <article className="mt-5 rounded-xl border border-quest-lavender/20 bg-quest-lavender/[.04] p-4"><span className="font-mono text-[8px] font-bold tracking-[.13em] text-quest-lavender">FEATURED SPEAKER</span><h4 className="mb-1 mt-2 text-lg font-bold">Sahana Shanbhag</h4><p className="m-0 text-xs font-semibold text-violet-200">Senior Analyst · Target Corporation</p></article>
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
      <aside className="sticky top-[25px] col-start-2 row-start-2 self-start rounded-[15px] border border-quest-lavender/30 bg-gradient-to-br from-[#21162e] to-[#14101b] p-7 text-center shadow-[0_20px_55px_#0005] max-[900px]:px-5 max-[900px]:py-[23px] max-[680px]:static max-[680px]:w-full max-[680px]:p-5">
        <h2 className="mb-5 mt-0 text-[23px] font-bold tracking-[-.04em] max-[680px]:mb-[15px] max-[680px]:text-xl">Reserve your spot</h2><button type="button" onClick={() => { setFormOpen(true); setNotice(null) }} className="w-full rounded-[9px] bg-gradient-to-r from-quest-purple to-quest-lavender px-4 py-4 text-sm font-extrabold text-white shadow-[0_9px_25px_#8244b344] transition duration-200 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-quest-lavender max-[680px]:py-[15px] max-[680px]:text-[13px]">Register now <span className="float-right font-mono text-lg text-violet-100">→</span></button>
      </aside>
    </section>

    <footer className={`${detailsWidth} mx-auto flex h-[65px] items-center justify-between border-t border-quest-lavender/15 font-mono text-[9px] tracking-[.12em] text-violet-200/65 max-[680px]:h-[58px] max-[680px]:text-[7px]`}><span>QUEST · EVENT REGISTRATION</span><button className="text-slate-300 transition-colors hover:text-quest-lavender" onClick={onBack}>← Back to events</button></footer>

    {formOpen && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-[#05050b]/90 p-6 backdrop-blur-[9px] animate-overlay-in max-[680px]:p-3 motion-reduce:animate-none" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setFormOpen(false) }}>
      <section className="max-h-[min(92vh,980px)] w-full max-w-[590px] overflow-y-auto rounded-[17px] border border-quest-lavender/40 bg-gradient-to-br from-[#21162e] to-[#100d18] p-[30px] shadow-[0_30px_100px_#000b] animate-modal-in max-[680px]:max-h-[calc(100svh_-_24px)] max-[680px]:rounded-[17px] max-[680px]:px-[18px] max-[680px]:py-[22px] motion-reduce:animate-none" role="dialog" aria-modal="true" aria-labelledby="registration-title">
        <div className="mb-[23px] flex items-start justify-between gap-[15px] max-[680px]:mb-[17px]"><div><p className="mb-2 mt-0 font-mono text-[9px] font-bold tracking-[.12em] text-quest-lavender">{event.title}</p><h2 id="registration-title" className="m-0 text-[25px] font-bold tracking-[-.045em] max-[680px]:text-[21px]">Complete your registration</h2></div><button className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[.03] font-mono text-[23px] transition hover:rotate-90 hover:bg-white/10" type="button" aria-label="Close registration" onClick={() => setFormOpen(false)}>×</button></div>
        {notice && <div className={`mb-3 rounded-lg border px-3 py-3 text-[10px] leading-relaxed ${notice.type === 'error' ? 'border-red-400/25 bg-red-950/30 text-red-200' : 'border-quest-lavender/30 bg-quest-lavender/10 text-violet-100'}`} role={notice.type === 'error' ? 'alert' : 'status'}>{notice.text}{notice.reference && <strong className="mt-1 block font-mono text-xs text-white">{notice.reference}</strong>}</div>}
        <form className="flex flex-col gap-4 max-[680px]:gap-[13px]" onSubmit={submit}>
          <TextField label="Full name" name="fullName" autoComplete="name" placeholder="Enter your full name" value={form.fullName} onChange={setField} minLength="2" maxLength="100" required/>
          <TextField label="Email address" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={setField} maxLength="254" required/>
          <TextField label="Phone number" name="phone" type="tel" autoComplete="tel" placeholder="Enter your phone number" value={form.phone} onChange={setField} minLength="7" maxLength="20" required/>
          <TextField label="USN" name="usn" placeholder="Enter your university seat number" value={form.usn} onChange={setField} maxLength="30" required/>
          {yearRequired && <TextField label="Year of study" name="year" placeholder="e.g., 2nd year" value={form.year} onChange={setField} maxLength="30" required/>}
          <TextField label="Department" name="department" placeholder="e.g., Computer Science" value={form.department} onChange={setField} maxLength="80" required/>
          {paymentRequired && <div className="mt-1 border-t border-white/10 pt-[18px]">
            <div className="mb-[13px] flex items-center justify-between"><div><p className="mb-1 mt-0 font-mono text-[8px] font-bold tracking-[.13em] text-quest-lavender">QTS PAYMENT</p><h3 className="m-0 text-base font-bold">Scan & pay</h3></div><span className="rounded-full border border-amber-300/25 bg-amber-300/[.06] px-2 py-[7px] font-mono text-[8px] tracking-widest text-amber-200">DEMO ONLY</span></div>
            <div className="mb-[13px] flex items-center gap-[15px] rounded-lg border border-white/10 bg-[#0d0b13] p-[13px] max-[680px]:gap-[11px] max-[680px]:p-[10px]"><div className="flex shrink-0 flex-col items-center gap-[5px] rounded bg-white p-2"><div className="grid h-[91px] w-[91px] grid-cols-[repeat(21,minmax(0,1fr))] grid-rows-[repeat(21,minmax(0,1fr))] gap-px bg-white max-[680px]:h-[78px] max-[680px]:w-[78px]" role="img" aria-label="Decorative demo QR code; not scannable">{fakeQr.map((active, index) => <i className={active ? 'bg-[#15111d]' : ''} key={index}/>)}</div><span className="whitespace-nowrap font-mono text-[5px] tracking-[.04em] text-[#aa583f]">DEMO QR · NOT PAYABLE</span></div><div><b className="text-[11px]">Demo payment code</b><p className="mb-0 mt-[5px] text-[9px] leading-relaxed text-slate-300">Placeholder only. It doesn’t accept payments.</p></div></div>
            <label className="relative flex min-h-[61px] cursor-pointer items-center gap-[11px] rounded-lg border border-dashed border-quest-lavender/35 bg-quest-purple/10 px-[13px] py-[10px] transition-colors hover:border-quest-lavender"><span className="grid h-[30px] w-[30px] place-items-center rounded-md bg-quest-lavender/15 font-mono text-[17px] text-violet-200">↑</span><span className="flex min-w-0 flex-1 flex-col gap-1"><b className="text-[10px] text-violet-50">Payment screenshot</b><small className="overflow-hidden text-ellipsis whitespace-nowrap text-[8px] text-slate-400">{snapshot ? snapshot.name : 'PNG, JPG or WEBP · up to 5 MB'}</small></span><input className="absolute inset-0 h-full w-full cursor-pointer opacity-0" type="file" accept="image/png,image/jpeg,image/webp" onChange={setFile} required/><span className="text-[9px] font-bold text-quest-lavender">Browse</span></label>
          </div>}
          <button className="h-[49px] rounded-lg bg-gradient-to-r from-quest-purple to-quest-lavender text-[13px] font-extrabold text-white shadow-[0_8px_25px_#8244b333] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-quest-lavender" type="submit">Register now <span className="float-right mr-4 font-mono">↗</span></button>
          <p className="-mt-1 mb-0 text-center text-[9px] leading-relaxed text-slate-400">Your details will be connected to the QUEST registration sheet.</p>
        </form>
      </section>
    </div>}
  </main>
}
