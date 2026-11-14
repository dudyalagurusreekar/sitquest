import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#090912] text-white font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top section preview area */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 sm:p-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(130,68,179,0.2)] border border-[rgba(180,145,230,0.35)] backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(130,68,179,0.25)]">
          <span className="h-2 w-2 rounded-full bg-[#00e5c3] shadow-[0_0_8px_#00e5c3] animate-pulse" />
          <span className="font-['Space_Grotesk',sans-serif] text-xs font-extrabold tracking-[3px] text-white uppercase">
            QUEST FOOTER PREVIEW
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold font-['Space_Grotesk',sans-serif] mb-4 text-white">
          Responsive QUEST Footer
        </h1>
        <p className="max-w-xl text-[#CBD5E1] text-sm sm:text-base mb-8">
          Featuring SIT campus architectural line art, glassmorphic social icons, and cosmic neon glows. Scroll down to explore the footer.
        </p>
      </main>

      {/* The QUEST Footer */}
      <Footer />
    </div>
  );
}

export default App;
