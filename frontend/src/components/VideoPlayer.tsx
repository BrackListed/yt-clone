import { useState, useRef } from "react";

interface Props {
  src: string;
  poster?: string;
}

function VolumeIcon({ muted, volume }: { muted: boolean; volume: number }) {
  if (muted || volume === 0)
    return (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
      </svg>
    );
  if (volume < 0.5)
    return (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
        <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}

export default function VideoPlayer({ src, poster }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState(0);

  const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  const fmt = (s: number) => {
    if (isNaN(s)) return "0:00";
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  const resetTimer = () => {
    setShowControls(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setShowControls(false);
    }, 3000);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = progressRef.current!.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    videoRef.current!.currentTime = pct * duration;
  };

  const pct = duration ? (currentTime / duration) * 100 : 0;
  const buffPct = duration ? (buffered / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black select-none"
      style={{ aspectRatio: "16/9" }}
      onMouseMove={resetTimer}
      onMouseLeave={() => { if (playing) setShowControls(false); }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        onTimeUpdate={() => {
          const v = videoRef.current;
          if (!v) return;
          setCurrentTime(v.currentTime);
          if (v.buffered.length > 0) setBuffered(v.buffered.end(v.buffered.length - 1));
        }}
        onLoadedMetadata={() => { if (videoRef.current) setDuration(videoRef.current.duration); }}
        onEnded={() => setPlaying(false)}
      />

      {/* Gradient */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: showControls ? 1 : 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Controls */}
      <div
        className="absolute bottom-0 left-0 right-0 px-3 pb-2 transition-opacity duration-300"
        style={{ opacity: showControls ? 1 : 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress */}
        <div
          ref={progressRef}
          className="relative mb-3 cursor-pointer group/bar"
          style={{ height: "3px" }}
          onClick={handleProgressClick}
          onMouseMove={(e) => {
            const rect = progressRef.current!.getBoundingClientRect();
            const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            setHoverTime(p * duration);
            setHoverX(e.clientX - rect.left);
          }}
          onMouseLeave={() => setHoverTime(null)}
        >
          <div className="absolute inset-0 -top-2 -bottom-2" />
          <div className="absolute inset-0 bg-white/30 rounded-full group-hover/bar:scale-y-150 origin-bottom transition-transform" />
          <div className="absolute top-0 left-0 h-full bg-white/50 rounded-full" style={{ width: `${buffPct}%` }} />
          <div className="absolute top-0 left-0 h-full bg-red-500 rounded-full" style={{ width: `${pct}%` }} />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full opacity-0 group-hover/bar:opacity-100 -ml-1.5 transition-opacity"
            style={{ left: `${pct}%` }}
          />
          {hoverTime !== null && (
            <div
              className="absolute -top-8 bg-black/90 text-white text-xs px-1.5 py-0.5 rounded pointer-events-none"
              style={{ left: hoverX, transform: "translateX(-50%)" }}
            >
              {fmt(hoverTime)}
            </div>
          )}
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Play */}
            <button className="p-1 hover:scale-110 transition-transform" onClick={togglePlay}>
              {playing ? (
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M8 5v14l11-7z" /></svg>
              )}
            </button>

            {/* Skip 10s */}
            <button
              className="p-1 hover:scale-110 transition-transform"
              onClick={() => { if (videoRef.current) videoRef.current.currentTime += 10; }}
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                <path d="M18 13c0 3.31-2.69 6-6 6s-6-2.69-6-6 2.69-6 6-6v4l5-5-5-5v4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8h-2z" />
                <text x="9" y="16" fontSize="6" fill="white" fontFamily="sans-serif">10</text>
              </svg>
            </button>

            {/* Volume */}
            <div
              className="flex items-center gap-1"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <button className="p-1 hover:scale-110 transition-transform" onClick={() => {
                const v = videoRef.current;
                if (!v) return;
                v.muted = !muted;
                setMuted(!muted);
              }}>
                <VolumeIcon muted={muted} volume={volume} />
              </button>
              <div className="overflow-hidden transition-all duration-200" style={{ width: showVolumeSlider ? "60px" : "0px" }}>
                <input
                  type="range" min={0} max={1} step={0.01} value={muted ? 0 : volume}
                  className="w-full accent-white cursor-pointer"
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setVolume(val);
                    if (videoRef.current) videoRef.current.volume = val;
                    setMuted(val === 0);
                  }}
                />
              </div>
            </div>

            {/* Time */}
            <span className="text-white text-sm tabular-nums">{fmt(currentTime)} / {fmt(duration)}</span>
          </div>

          <div className="flex items-center gap-1">
            {/* Settings */}
            <div className="relative">
              <button className="p-1 hover:scale-110 transition-transform" onClick={() => { setShowSettings(!showSettings); setShowSpeedMenu(false); }}>
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                  <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
                </svg>
              </button>

              {showSettings && (
                <div className="absolute bottom-10 right-0 bg-[#212121] rounded-lg overflow-hidden w-52 shadow-xl z-50">
                  {!showSpeedMenu ? (
                    <>
                      <button className="flex items-center gap-3 w-full px-4 py-3 text-white text-sm hover:bg-white/10" onClick={() => setShowSpeedMenu(true)}>
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white/80"><path d="M20.38 8.57l-1.23 1.85a8 8 0 0 1-.22 7.58H5.07A8 8 0 0 1 15.58 6.85l1.85-1.23A10 10 0 0 0 3.35 19a2 2 0 0 0 1.72 1h13.85a2 2 0 0 0 1.74-1 10 10 0 0 0-.27-10.44zm-9.79 6.84a2 2 0 0 0 2.83 0l5.66-8.49-8.49 5.66a2 2 0 0 0 0 2.83z" /></svg>
                        <span>Playback speed</span>
                        <span className="ml-auto text-white/60">{playbackRate === 1 ? "Normal" : `${playbackRate}x`}</span>
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white/60"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" /></svg>
                      </button>
                      <button className="flex items-center gap-3 w-full px-4 py-3 text-white text-sm hover:bg-white/10" onClick={() => { (videoRef.current)?.requestPictureInPicture?.(); }}>
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white/80"><path d="M19 7h-8v6h8V7zm2-4H3C1.9 3 1 3.9 1 5v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z" /></svg>
                        <span>Picture in picture</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="flex items-center gap-3 w-full px-4 py-3 text-white text-sm hover:bg-white/10 border-b border-white/10" onClick={() => setShowSpeedMenu(false)}>
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>
                        <span className="font-medium">Playback speed</span>
                      </button>
                      {speeds.map((s) => (
                        <button
                          key={s}
                          className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-white/10 ${playbackRate === s ? "text-blue-400" : "text-white"}`}
                          onClick={() => { if (videoRef.current) videoRef.current.playbackRate = s; setPlaybackRate(s); setShowSpeedMenu(false); setShowSettings(false); }}
                        >
                          {playbackRate === s
                            ? <svg viewBox="0 0 24 24" className="w-4 h-4 fill-blue-400"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                            : <span className="w-4" />
                          }
                          {s === 1 ? "Normal" : `${s}x`}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button className="p-1 hover:scale-110 transition-transform" onClick={() => {
              if (!isFullscreen) { containerRef.current?.requestFullscreen(); setIsFullscreen(true); }
              else { document.exitFullscreen(); setIsFullscreen(false); }
            }}>
              {isFullscreen
                ? <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" /></svg>
                : <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" /></svg>
              }
            </button>
          </div>
        </div>
      </div>

      {showSettings && <div className="absolute inset-0 z-40" onClick={() => setShowSettings(false)} />}
    </div>
  );
}