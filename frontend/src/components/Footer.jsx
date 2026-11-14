import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail } from 'lucide-react';

const FOOTER_EVENTS = [
  { name: 'Freshers Day', to: '/events' },
  { name: 'Recruitments', to: '/registrations' },
  { name: 'Placement IQ', to: '/events' },
  { name: 'QUEST Test Series', to: '/events' },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.08] bg-[#0B0B14]/90 text-[#CBD5E1] backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <img
              src="/quest-logo.png"
              alt="QUEST Logo"
              className="h-14 w-auto object-contain"
            />
            <div>
              <p className="text-base font-bold tracking-[0.14em] text-white">QUEST</p>
              <p className="font-mono-quest text-xs tracking-[0.2em] text-[#A879E6]">
                A SEARCH WITHIN
              </p>
              <p className="mt-1 text-xs text-[#94A3B8]">
                Siddaganga Institute of Technology
              </p>
            </div>
          </div>

          {/* Events */}
          <div>
            <h3 className="text-sm font-bold tracking-wide text-white">Our Events</h3>
            <div className="mt-1.5 mb-3 h-[2px] w-8 rounded-full bg-gradient-to-r from-[#8244B3] to-[#A879E6]" />
            <div className="flex flex-wrap gap-2">
              {FOOTER_EVENTS.map((ev) => (
                <Link
                  key={ev.name}
                  to={ev.to}
                  className="quest-glass-card inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-[#CBD5E1] hover:text-white"
                >
                  <span>{ev.name}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#A879E6]" />
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold tracking-wide text-white">Connect With Us</h3>
            <div className="mt-1.5 mb-3 h-[2px] w-8 rounded-full bg-gradient-to-r from-[#8244B3] to-[#A879E6]" />
            <a
              href="mailto:quest.official.sit@gmail.com"
              className="quest-glass-card inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs text-[#CBD5E1] hover:text-white"
            >
              <Mail className="h-4 w-4 text-[#A879E6]" />
              <span>quest.official.sit@gmail.com</span>
            </a>
          </div>
        </div>

        <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

        <p className="text-center text-xs text-[#94A3B8]">
          @2026 QUEST · All rights reserved
        </p>
      </div>
    </footer>
  );
}
