
import React from "react";
import "./Alumni.css";
import alumniData from "../../data/alumniData";

function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function AlumniCard({ alumni }) {
  return (
    <article className={`alumni-card ${alumni.theme || ""}`}>
      <div className="alumni-card__photo-wrap">
        <img
          className="alumni-card__photo"
          src={alumni.image}
          alt={`${alumni.name} portrait`}
          loading="lazy"
        />
      </div>

      <div className="alumni-card__content">
        <div className="alumni-card__info">
          <h2 className="alumni-card__name">
            {alumni.name}
          </h2>

          <p className="alumni-card__role">
            {alumni.role}
          </p>

          <p className="alumni-card__company">
            {alumni.company}
          </p>

          <p className="alumni-card__year">
            Class of {alumni.year}
          </p>
        </div>

        {alumni.linkedin && (
          <a
            className="alumni-card__linkedin"
            href={alumni.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${alumni.name} on LinkedIn`}
            title="Open LinkedIn profile"
          >
            <LinkedInIcon />
          </a>
        )}
      </div>
    </article>
  );
}

export default function Alumni() {
  return (
    <main className="alumni-page">
      <div className="alumni-page__orb alumni-page__orb--one" />
      <div className="alumni-page__orb alumni-page__orb--two" />

      <header className="alumni-heading">
        <div className="alumni-brand" aria-label="QUEST alumni">
          <span>QUEST</span>
        </div>

        <p className="alumni-heading__eyebrow">
          OUR COMMUNITY
        </p>

        <h1>Meet our Alumni</h1>

        <p className="alumni-heading__subtitle">
          Inspiring journeys. Meaningful connections. A community that grows together.
        </p>
      </header>

      <section
        className="alumni-slider"
        aria-label="Alumni profiles"
      >
        <div className="alumni-slider__track">
          <div className="alumni-slider__slide">
            <div className="alumni-grid">
              {alumniData.map((alumni) => (
                <AlumniCard
                  key={alumni.id}
                  alumni={alumni}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
