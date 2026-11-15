import { Link, useInRouterContext } from 'react-router-dom';
import { intro, whoWeAre, mission, impact } from './aboutData';

// Fonts used across the QUEST site. React 19 moves this <link> into <head>
// and loads it only once, even if another page requests the same file.
const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap';

const headingFont = "font-['Space_Grotesk',system-ui,sans-serif]";

// Frosted-glass button: translucent lavender fill, blurred backdrop,
// a soft light border and a thin highlight along the top edge.
const glassButton =
  'border-white/20 bg-[linear-gradient(135deg,rgba(183,143,223,0.26),rgba(130,68,179,0.12))] text-white backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_24px_rgba(0,0,0,0.3)] hover:border-[#b78fdf]/70 hover:bg-[linear-gradient(135deg,rgba(183,143,223,0.38),rgba(130,68,179,0.2))]';

// Uses a router <Link> when the page is rendered inside the app's router,
// and a plain <a> otherwise, so the page never crashes on its own.
function PageLink({ to, className, children }) {
  const inRouter = useInRouterContext();
  if (inRouter) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={to} className={className}>
      {children}
    </a>
  );
}

function Section({ id, title, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <h2
        id={`${id}-title`}
        className={`${headingFont} m-0 mb-6 text-[clamp(34px,5vw,48px)] font-bold leading-[1.1] tracking-[-0.03em] text-white`}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function Paragraphs({ items }) {
  return items.map((text) => (
    <p key={text} className="m-0 mb-[18px] text-base leading-[1.7] last:mb-0 sm:text-lg">
      {text}
    </p>
  ));
}

function Subheading({ className = 'mt-12 mb-4', children }) {
  return (
    <h3
      className={`${headingFont} text-xl font-semibold tracking-[-0.01em] text-white ${className}`}
    >
      {children}
    </h3>
  );
}

function Divider() {
  return <hr className="my-[52px] h-px border-0 bg-white/12 sm:my-[72px]" />;
}

export default function About() {
  return (
    <main className="min-h-screen w-full bg-[#0c0816] text-left font-['Plus_Jakarta_Sans',system-ui,sans-serif] text-[#c9c4d8]">
      <link rel="stylesheet" href={FONTS_URL} precedence="default" />

      <div className="mx-auto w-full max-w-[840px] px-4 pt-10 pb-20 sm:px-6 sm:pt-16 sm:pb-28">
        {/* Intro */}
        <header className="text-center">
          <p
            className={`${headingFont} m-0 mb-5 text-[clamp(20px,2.6vw,26px)] font-bold uppercase tracking-[0.18em] text-[#b78fdf]`}
          >
            {intro.eyebrow}
          </p>
          <p className={`${headingFont} m-0 mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-yellow-400`}>
            Our Motto
          </p>
          <h1
            className={`${headingFont} m-0 mb-6 text-[clamp(44px,7vw,72px)] font-bold leading-[1.02] tracking-[-0.035em] text-white`}
          >
            {intro.title}
          </h1>
          <p className="mx-auto my-0 max-w-[680px] text-[clamp(18px,2.2vw,21px)] leading-[1.6]">
            {intro.lead}
          </p>
        </header>

        <Divider />

        {/* Who we are */}
        <Section id={whoWeAre.id} title={whoWeAre.title}>
          <Paragraphs items={whoWeAre.paragraphs} />
        </Section>

        <Divider />

        {/* Mission */}
        <Section id={mission.id} title={mission.title}>
          <Paragraphs items={[...mission.paragraphs, mission.pillarsIntro]} />
          <ul className="mt-2 mb-0 list-none border-l-[3px] border-[#b78fdf] bg-white/[0.035] px-4 py-1 sm:px-6 sm:py-2">
            {mission.pillars.map((pillar) => (
              <li
                key={pillar.title}
                className="relative border-t border-white/12 py-3.5 pl-5 text-base leading-[1.6] first:border-t-0 before:absolute before:top-[25px] before:left-0 before:size-1.5 before:rounded-full before:bg-[#b78fdf] before:content-[''] sm:text-[17px]"
              >
                <strong className="font-bold text-white">{pillar.title}</strong> {pillar.text}
              </li>
            ))}
          </ul>
        </Section>

        <Divider />

        {/* Impact */}
        <Section id={impact.id} title={impact.title}>
          <Paragraphs items={impact.paragraphs} />

          <Subheading>{impact.programmesTitle}</Subheading>
          <ul className="m-0 list-none p-0">
            {impact.programmes.map((programme) => (
              <li key={programme.title} className="border-t border-white/12 py-[18px] last:border-b">
                <strong className="mb-1 block text-[17px] font-bold text-white">
                  {programme.title}
                </strong>
                <p className="m-0 text-[15px] leading-[1.6]">{programme.text}</p>
              </li>
            ))}
          </ul>

          {/* Logos keep their brand colours, so they sit on light tiles. */}
          <Subheading className="mt-14 mb-6 text-center">{impact.companiesTitle}</Subheading>
          <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 md:grid-cols-5">
            {impact.companies.map((company) => (
              <li
                key={company.name}
                className="flex h-[72px] items-center justify-center rounded-lg border border-white/60 bg-[#f6f4fa] px-[18px] py-4 transition duration-200 hover:shadow-[0_0_0_2px_#b78fdf] motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none sm:h-[84px]"
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  title={company.name}
                  decoding="async"
                  className="block h-10 w-full object-contain"
                />
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {impact.actions.map((action) => (
              <PageLink
                key={action.to}
                to={action.to}
                className={`group inline-flex items-center justify-between gap-2.5 rounded-md border px-[22px] py-3.5 text-[15px] font-bold no-underline transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#b78fdf] motion-reduce:transition-none sm:justify-start ${glassButton}`}
              >
                {action.label}
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 motion-safe:group-hover:translate-x-[3px] motion-reduce:transition-none"
                >
                  →
                </span>
              </PageLink>
            ))}
          </div>
        </Section>
      </div>
    </main>
  );
}
