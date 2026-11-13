import React from "react";
import alumniData from "../../data/alumniData";

function LinkedInIcon() {
  return (
    <span
      className="flex h-5 w-5 items-center justify-center rounded-[3px] bg-[#b8b6c2] font-[Arial] text-base font-extrabold leading-none tracking-[-1px] text-[#17131d] transition-colors duration-300 group-hover/linkedin:bg-white"
      aria-hidden="true"
    >
      in
    </span>
  );
}

function AlumniCard({ alumni }) {
  return (
    <article className="group relative min-w-0 rounded-[25px] border border-[rgba(180,145,230,0.13)] bg-[rgba(43,29,68,0.42)] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 ease-in-out hover:-translate-y-[6px] hover:border-[rgba(180,145,230,0.35)] hover:bg-[rgba(55,37,83,0.60)]">

      {/* Photo */}
      <div className="aspect-square w-full overflow-hidden rounded-[19px] bg-[#211b30]">
        <img
          src={alumni.image}
          alt={`${alumni.name} portrait`}
          loading="lazy"
          className="block h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      {/* Information */}
      <div className="px-[5px] pb-[5px] pt-[18px] text-center">

        <h3 className="mb-[9px] break-words font-['Space_Grotesk',sans-serif] text-[18px] font-bold leading-[1.4] text-white max-[760px]:text-base max-[480px]:text-sm">
          {alumni.name}
        </h3>

        <p className="mb-[6px] break-words text-[15px] font-bold leading-[1.5] text-[#ded6ed] max-[760px]:text-[13px] max-[480px]:text-xs">
          {alumni.company}
        </p>

        <p className="mb-3 break-words text-[13px] font-semibold leading-[1.6] text-[#b995ee] max-[760px]:text-xs max-[480px]:text-[11px]">
          {alumni.role}
        </p>

        {alumni.linkedin && (
          <a
            href={alumni.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${alumni.name}'s LinkedIn profile`}
            title="View LinkedIn profile"
            className="group/linkedin mt-[2px] inline-flex h-6 w-6 items-center justify-center transition-transform duration-300 hover:scale-110"
          >
            <LinkedInIcon />
          </a>
        )}

      </div>
    </article>
  );
}

export default function Alumni() {
  const alumniYears = [
    ...new Set(alumniData.map((alumni) => Number(alumni.year))),
  ].sort((a, b) => a - b);

  return (
    <main className="relative isolate min-h-screen w-screen max-w-none overflow-hidden bg-[#090912] px-[5%] pb-[90px] pt-[55px] text-[#f8f7ff] [left:50%] [margin-left:-50vw] [font-family:'Plus_Jakarta_Sans',sans-serif] [background-image:radial-gradient(circle_at_10%_30%,rgba(117,56,185,0.10),transparent_30%),radial-gradient(circle_at_90%_45%,rgba(0,190,170,0.07),transparent_30%)] max-[1050px]:px-[4%] max-[760px]:px-[5%] max-[760px]:pb-[65px] max-[760px]:pt-[45px] max-[480px]:px-4 max-[480px]:pb-[50px] max-[480px]:pt-[35px]">

      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-[260px] top-[240px] -z-10 h-[380px] w-[380px] rounded-full border border-[rgba(157,102,255,0.15)] blur-[1px]" />

      <div className="pointer-events-none absolute -right-[300px] bottom-[100px] -z-10 h-[420px] w-[420px] rounded-full border border-[rgba(0,220,190,0.10)] blur-[1px]" />

      {/* Heading */}
      <header className="relative mx-auto mb-[40px] flex w-full max-w-[900px] flex-col items-center text-center max-[760px]:mb-[30px]">

        <div className="mb-[12px] font-['Space_Grotesk',sans-serif] text-[15px] font-extrabold tracking-[5px] text-white">
          QUEST
        </div>

        <p className="mb-[14px] text-[13px] font-extrabold tracking-[4px] text-[#00e5c3]">
          OUR COMMUNITY
        </p>

        <h1 className="mb-[12px] font-['Space_Grotesk',sans-serif] text-[clamp(38px,5.5vw,68px)] font-bold leading-[1.1] tracking-[-2.5px] text-white max-[480px]:tracking-[-1.5px]">
          Meet our Alumni
        </h1>

        <p className="w-full max-w-[620px] text-center text-base leading-[1.6] text-[#c3bfd2] max-[480px]:text-sm">
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
            <section key={year} className="mb-[60px] w-full">

              {/* Year heading */}
              <div className="mb-[25px] flex items-center justify-center gap-[22px] max-[480px]:gap-3">

                <span className="h-px w-[85px] bg-gradient-to-r from-transparent to-[rgba(0,229,195,0.65)] max-[480px]:w-[35px]" />

                <h2 className="m-0 whitespace-nowrap font-['Space_Grotesk',sans-serif] text-[clamp(23px,3vw,32px)] font-bold text-white">
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