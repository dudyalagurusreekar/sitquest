
import React from "react";
import alumniData from "../../data/alumniData";

function LinkedInIcon() {
  return (
    <span
      className="flex h-5 w-5 items-center justify-center rounded-[3px] bg-[#0A66C2] font-[Arial] text-base font-extrabold leading-none tracking-[-1px] text-white transition-colors duration-300 group-hover/linkedin:bg-[#2D8CE6]"
      aria-hidden="true"
    >
      in
    </span>
  );
}

/* Font size shrinks as the text gets longer */
function nameSize(text = "") {
  if (text.length > 24) return "text-[13px]";
  if (text.length > 18) return "text-[14px]";
  return "text-[16px]";
}

function companySize(text = "") {
  if (text.length > 40) return "text-[10px]";
  if (text.length > 28) return "text-[11px]";
  if (text.length > 20) return "text-[12px]";
  return "text-[13px]";
}

function roleSize(text = "") {
  if (text.length > 34) return "text-[10px]";
  if (text.length > 24) return "text-[11px]";
  return "text-[12px]";
}

function AlumniCard({ alumni }) {
  return (
    <article className="group relative flex h-full min-w-0 flex-col rounded-[25px] border border-[rgba(180,145,230,0.13)] bg-[rgba(43,29,68,0.42)] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 ease-in-out hover:-translate-y-[6px] hover:border-[rgba(180,145,230,0.35)] hover:bg-[rgba(55,37,83,0.60)]">

      {/* Photo */}
      <div className="aspect-square w-full shrink-0 overflow-hidden rounded-[19px] bg-[#211b30]">
        <img
          src={alumni.image}
          alt={`${alumni.name} portrait`}
          loading="lazy"
          className="block h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      {/* Information */}
      <div className="flex flex-1 flex-col px-[5px] pb-[5px] pt-[12px] text-center">

        {/* Name */}
        <div className="flex h-[26px] items-center justify-center">
          <h3
            className={`break-words font-['Space_Grotesk',sans-serif] font-bold leading-[1.2] text-white ${nameSize(
              alumni.name
            )} max-[760px]:!text-[14px] max-[480px]:!text-[13px]`}
          >
            {alumni.name}
          </h3>
        </div>

        {/* Company: teal highlighted pill */}
        <div className="mt-[2px] flex h-[36px] items-center justify-center overflow-hidden">
          <p
            className={`inline-flex max-w-full items-center justify-center rounded-full border border-[rgba(0,229,195,0.28)] bg-[rgba(0,229,195,0.10)] px-3 py-[5px] text-center font-bold leading-[1.25] text-[#00e5c3] shadow-[0_0_12px_rgba(0,229,195,0.08)] ${companySize(
              alumni.company
            )} max-[760px]:!px-2 max-[760px]:!text-[11px] max-[480px]:!px-[7px] max-[480px]:!text-[10px]`}
          >
            {alumni.company}
          </p>
        </div>

        {/* Role */}
        <div className="mt-[2px] flex h-[30px] items-center justify-center overflow-hidden">
          <p
            className={`break-words font-semibold leading-[1.25] text-[#b995ee] ${roleSize(
              alumni.role
            )} max-[760px]:!text-[11px] max-[480px]:!text-[10px]`}
          >
            {alumni.role}
          </p>
        </div>

        {/* LinkedIn */}
        <div className="mt-auto flex h-6 items-end justify-center pt-2">
          {alumni.linkedin && (
            <a
              href={alumni.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${alumni.name}'s LinkedIn profile`}
              title="View LinkedIn profile"
              className="group/linkedin inline-flex h-6 w-6 items-center justify-center transition-transform duration-300 hover:scale-110"
            >
              <LinkedInIcon />
            </a>
          )}
        </div>

      </div>
    </article>
  );
}

export default function Alumni() {
  const alumniYears = [
    ...new Set(alumniData.map((alumni) => Number(alumni.year))),
  ].sort((a, b) => a - b);

  return (
    <main className="relative isolate min-h-screen w-screen max-w-none overflow-hidden bg-[#090912] px-[5%] pb-[60px] pt-[20px] text-[#f8f7ff] [left:50%] [margin-left:-50vw] [font-family:'Plus_Jakarta_Sans',sans-serif] [background-image:radial-gradient(circle_at_10%_30%,rgba(117,56,185,0.10),transparent_30%),radial-gradient(circle_at_90%_45%,rgba(0,190,170,0.07),transparent_30%)] max-[1050px]:px-[4%] max-[760px]:px-[5%] max-[760px]:pb-[45px] max-[760px]:pt-[16px] max-[480px]:px-4 max-[480px]:pb-[35px] max-[480px]:pt-[12px]">

      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-[260px] top-[240px] -z-10 h-[380px] w-[380px] rounded-full border border-[rgba(157,102,255,0.15)] blur-[1px]" />

      <div className="pointer-events-none absolute -right-[300px] bottom-[100px] -z-10 h-[420px] w-[420px] rounded-full border border-[rgba(0,220,190,0.10)] blur-[1px]" />

      {/* Heading */}
      <header className="relative mx-auto mb-[16px] flex w-full max-w-[900px] flex-col items-center text-center max-[760px]:mb-[12px]">

        <div className="mb-[2px] font-['Space_Grotesk',sans-serif] text-[13px] font-extrabold tracking-[5px] text-white">
          QUEST
        </div>

        <p className="mb-[2px] text-[11px] font-extrabold tracking-[4px] text-[#00e5c3]">
          OUR COMMUNITY
        </p>

        <h1 className="!m-0 !mb-[12px] font-['Outfit',sans-serif] text-[clamp(32px,4.4vw,52px)] font-bold leading-[1.05] tracking-[-1px] text-white max-[480px]:tracking-[-0.5px]">
          Meet our Alumni
        </h1>

        <p className="w-full max-w-[620px] text-center text-sm leading-[1.35] text-[#c3bfd2] max-[480px]:text-[13px]">
          Inspiring journeys. Meaningful connections.
          A community that grows together.
        </p>

      </header>

      {/* Year-wise sections */}
      <div className="mx-auto w-full">

        {alumniYears.map((year) => {
          const yearAlumni = alumniData.filter(
            (alumni) => Number(alumni.year) === year
          );

          return (
            <section key={year} className="mb-[36px] w-full">

              {/* Year heading */}
              <div className="mb-[14px] flex items-center justify-center gap-[22px] max-[480px]:gap-3">

                <span className="h-px w-[85px] bg-gradient-to-r from-transparent to-[rgba(0,229,195,0.65)] max-[480px]:w-[35px]" />

                <h2 className="m-0 whitespace-nowrap font-['Space_Grotesk',sans-serif] text-[clamp(20px,2.5vw,26px)] font-bold text-white">
                  {year} Alumni
                </h2>

                <span className="h-px w-[85px] rotate-180 bg-gradient-to-r from-transparent to-[rgba(0,229,195,0.65)] max-[480px]:w-[35px]" />

              </div>

              {/* Cards */}
              <div className="grid w-full grid-cols-4 gap-[25px] max-[1050px]:grid-cols-3 max-[1050px]:gap-5 max-[760px]:grid-cols-2 max-[760px]:gap-4 max-[480px]:gap-3">

                {yearAlumni.map((alumni) => (
                  <AlumniCard
                    key={alumni.id}
                    alumni={alumni}
                  />
                ))}

              </div>
            </section>
          );
        })}

      </div>
    </main>
  );
}
