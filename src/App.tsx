import { VideoText } from "@/components/ui/video-text";

function App() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#d5573b] px-4 py-12 text-center">
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      <h1 className="text-[clamp(2.5rem,12vw,9rem)] font-black leading-none tracking-tighter text-white">
        CHOOSE
      </h1>

      <div className="mt-2 h-[13vw] w-full">
        <VideoText src="/videos/waves.mp4" fontSize="11vw" fontWeight="900" fontFamily="sans-serif">
          PERSEVERE
        </VideoText>
      </div>

      <h2 className="mt-6 text-white ">Coming Soon.</h2>
    </div>
  );
}

export default App;
