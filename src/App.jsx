import React, { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Download,
  CheckCircle2,
  Disc3,
  Music2,
  ListMusic,
  Radio,
  Search,
  Sparkles,
  PlusCircle,
  Sliders,
  Maximize2,
  Zap
} from 'lucide-react';

function formatDuration(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function App() {
  const {
    activeTab,
    setActiveTab,
    selectedGenre,
    setSelectedGenre,
    searchQuery,
    setSearchQuery,
    genres,
    tracks,
    playlists,
    currentTrackId,
    isPlaying,
    progress,
    volume,
    isMuted,
    offlineTrackIds,
    playTrack,
    togglePlay,
    setProgress,
    setVolume,
    toggleMute,
    nextTrack,
    prevTrack,
    toggleOfflineDownload,
    createPlaylist
  } = useStore();

  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showNewPlModal, setShowNewPlModal] = useState(false);

  const currentTrack = tracks.find(t => t.id === currentTrackId) || tracks[0];

  // Simulated player playback progress ticker
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        if (progress >= currentTrack.duration) {
          nextTrack();
        } else {
          setProgress(progress + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress, currentTrack, nextTrack, setProgress]);

  const filteredTracks = tracks.filter(t => {
    const matchesGenre = selectedGenre === 'All' ? true : t.genre === selectedGenre;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  const handleCreatePl = (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    createPlaylist(newPlaylistName);
    setNewPlaylistName('');
    setShowNewPlModal(false);
  };

  return (
    <div className="min-h-screen bg-[#050811] text-zinc-100 font-sans flex flex-col selection:bg-cyan-500 selection:text-black pb-28">
      {/* Top Header */}
      <header className="bg-[#050811]/90 backdrop-blur border-b border-slate-800/80 sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-cyan-300 flex items-center justify-center text-black font-display font-black shadow-lg shadow-cyan-500/20">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-lg tracking-wider text-white">CYANWAVE</span>
              <span className="text-[10px] font-mono font-bold bg-cyan-950 border border-cyan-700 text-cyan-400 px-1.5 py-0.5 rounded">
                24-BIT LOSSLESS
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">NEURAL AUDIO ENGINE & SPATIAL DSP</p>
          </div>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-sm mx-6 relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search tracks, artists, or lossless albums..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-full pl-9 pr-4 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-mono">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'browse' ? 'bg-cyan-500 text-black font-bold shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Discovery
          </button>
          <button
            onClick={() => setActiveTab('lyrics')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'lyrics' ? 'bg-cyan-500 text-black font-bold shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Live Lyrics
          </button>
          <button
            onClick={() => setActiveTab('playlists')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'playlists' ? 'bg-cyan-500 text-black font-bold shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Playlists ({playlists.length})
          </button>
          <button
            onClick={() => setActiveTab('offline')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'offline' ? 'bg-cyan-500 text-black font-bold shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Offline ({offlineTrackIds.length})
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* DISCOVERY / CATALOG VIEW */}
        {activeTab === 'browse' && (
          <div className="space-y-8">
            {/* Hero Featured Release */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
              <div className="w-full md:w-64 h-64 rounded-2xl overflow-hidden shadow-2xl relative shrink-0">
                <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-cyan-500/10 pointer-events-none" />
              </div>

              <div className="flex-1 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-mono">
                  <Sparkles className="w-3.5 h-3.5" /> Featured Neural Lossless Master
                </div>
                <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight leading-tight">
                  {currentTrack.title}
                </h1>
                <p className="text-zinc-400 font-mono text-sm">
                  Artist: <span className="text-cyan-400 font-bold">{currentTrack.artist}</span> • Album: <span className="text-zinc-300">{currentTrack.album}</span>
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (currentTrackId === currentTrack.id) togglePlay();
                      else playTrack(currentTrack.id);
                    }}
                    className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition flex items-center gap-2"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
                    {isPlaying ? 'Pause Playback' : 'Stream Hi-Res Master'}
                  </button>
                  <button
                    onClick={() => toggleOfflineDownload(currentTrack.id)}
                    className="p-3 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl transition"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Genre filter tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {genres.map(g => (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(g)}
                  className={`px-4 py-2 rounded-full text-xs font-mono transition whitespace-nowrap ${
                    selectedGenre === g
                      ? 'bg-cyan-500 text-black font-bold shadow'
                      : 'bg-slate-900 border border-slate-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Track Grid */}
            <div className="space-y-3">
              <h2 className="font-display font-bold text-xl text-white">Lossless Master Catalog</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTracks.map(trk => (
                  <div
                    key={trk.id}
                    className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-4 ${
                      currentTrackId === trk.id
                        ? 'bg-cyan-950/20 border-cyan-500/50 shadow-lg shadow-cyan-500/5'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 group">
                        <img src={trk.cover} alt={trk.title} className="w-full h-full object-cover" />
                        <button
                          onClick={() => playTrack(trk.id)}
                          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          <Play className="w-5 h-5 fill-cyan-400 text-cyan-400" />
                        </button>
                      </div>

                      <div>
                        <div className="font-bold text-white text-sm">{trk.title}</div>
                        <div className="text-xs text-zinc-400">{trk.artist}</div>
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800">
                          {trk.bitrate}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-xs text-zinc-400">
                      <span>{formatDuration(trk.duration)}</span>
                      <button
                        onClick={() => toggleOfflineDownload(trk.id)}
                        className={`p-2 rounded-lg transition ${
                          offlineTrackIds.includes(trk.id)
                            ? 'text-cyan-400 bg-cyan-950'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {offlineTrackIds.includes(trk.id) ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SYNCHRONIZED KARAOKE LYRICS VIEW */}
        {activeTab === 'lyrics' && (
          <div className="max-w-2xl mx-auto bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-6 text-center">
            <div className="space-y-1 pb-4 border-b border-slate-800">
              <span className="text-xs font-mono text-cyan-400 uppercase">Synchronized Acoustic Lyrics</span>
              <h2 className="font-display font-black text-2xl text-white">{currentTrack.title}</h2>
              <p className="text-xs text-zinc-400 font-mono">{currentTrack.artist}</p>
            </div>

            <div className="space-y-6 py-6 font-display text-lg sm:text-xl font-bold">
              {currentTrack.lyrics.map((line, idx) => {
                const isActive = progress >= line.time;
                return (
                  <p
                    key={idx}
                    className={`transition duration-300 ${
                      isActive ? 'text-cyan-400 scale-105' : 'text-zinc-600'
                    }`}
                  >
                    {line.text}
                  </p>
                );
              })}
            </div>
          </div>
        )}

        {/* PLAYLISTS VIEW */}
        {activeTab === 'playlists' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h2 className="font-display font-bold text-2xl text-white">Your Custom Playlists</h2>
                <p className="text-xs font-mono text-zinc-400">Curated high-bitrate listening queues and track sequences.</p>
              </div>
              <button
                onClick={() => setShowNewPlModal(true)}
                className="px-4 py-2 bg-cyan-500 text-black font-mono font-bold text-xs rounded-xl flex items-center gap-2 hover:bg-cyan-400 transition"
              >
                <PlusCircle className="w-4 h-4" /> New Playlist
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map(pl => (
                <div key={pl.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <img src={pl.cover} alt={pl.name} className="w-full h-40 object-cover rounded-xl" />
                  <div>
                    <h3 className="font-bold text-white text-base">{pl.name}</h3>
                    <span className="text-xs font-mono text-zinc-400">{pl.count} Lossless Tracks</span>
                  </div>
                  <button
                    onClick={() => playTrack('trk-01')}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-mono font-semibold transition"
                  >
                    Play Sequence
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OFFLINE LOSSLESS VAULT */}
        {activeTab === 'offline' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-2xl text-white">Offline Lossless Storage</h2>
                <p className="text-xs font-mono text-zinc-400">Cached FLAC master files for zero-latency airplane/offline playback.</p>
              </div>
            </div>

            {/* Storage Meter */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 font-mono text-xs">
              <div className="flex justify-between text-zinc-300">
                <span>Cached Audio Memory</span>
                <span className="text-cyan-400 font-bold">{(offlineTrackIds.length * 48.5).toFixed(1)} MB / 5.0 GB</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 rounded-full"
                  style={{ width: `${(offlineTrackIds.length * 48.5 / 5000) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              {tracks.filter(t => offlineTrackIds.includes(t.id)).map(trk => (
                <div key={trk.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={trk.cover} alt={trk.title} className="w-12 h-12 object-cover rounded-xl" />
                    <div>
                      <div className="font-bold text-white text-sm">{trk.title}</div>
                      <div className="text-xs text-zinc-400">{trk.artist}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleOfflineDownload(trk.id)}
                    className="px-3 py-1.5 bg-red-950/60 border border-red-800 text-red-400 rounded-lg text-xs font-mono"
                  >
                    Delete Cache
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FIXED BOTTOM AUDIO PLAYER DOCK */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#050811]/95 backdrop-blur-lg border-t border-slate-800 p-3 sm:p-4 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Current track info & Animated Wave Bars */}
          <div className="flex items-center gap-3.5 w-full sm:w-1/3">
            <img src={currentTrack.cover} alt={currentTrack.title} className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
            <div className="truncate">
              <div className="font-bold text-white text-sm truncate">{currentTrack.title}</div>
              <div className="text-xs text-zinc-400 truncate">{currentTrack.artist}</div>
            </div>

            {/* Neon Waveform Visualizer Bars */}
            {isPlaying && (
              <div className="hidden lg:flex items-end gap-1 h-7 pl-2">
                <span className="w-1 bg-cyan-400 rounded-full wave-animate-1"></span>
                <span className="w-1 bg-cyan-400 rounded-full wave-animate-2"></span>
                <span className="w-1 bg-cyan-400 rounded-full wave-animate-3"></span>
                <span className="w-1 bg-cyan-400 rounded-full wave-animate-4"></span>
                <span className="w-1 bg-cyan-400 rounded-full wave-animate-5"></span>
              </div>
            )}
          </div>

          {/* Player controls & timeline scrubber */}
          <div className="flex-1 max-w-xl w-full flex flex-col items-center space-y-1.5">
            <div className="flex items-center gap-5">
              <button onClick={prevTrack} className="text-zinc-400 hover:text-white transition">
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center transition shadow-lg shadow-cyan-500/30"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
              </button>
              <button onClick={nextTrack} className="text-zinc-400 hover:text-white transition">
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Timeline scrubber */}
            <div className="w-full flex items-center gap-2 font-mono text-[11px] text-zinc-400">
              <span>{formatDuration(progress)}</span>
              <input
                type="range"
                min="0"
                max={currentTrack.duration}
                value={progress}
                onChange={e => setProgress(Number(e.target.value))}
                className="flex-1 accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span>{formatDuration(currentTrack.duration)}</span>
            </div>
          </div>

          {/* Volume and format tags */}
          <div className="hidden sm:flex items-center justify-end gap-3 w-1/3">
            <button onClick={toggleMute} className="text-zinc-400 hover:text-white">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={e => setVolume(Number(e.target.value))}
              className="w-24 accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* New playlist modal */}
      {showNewPlModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="font-bold text-white text-base">Create Lossless Playlist</h3>
            <form onSubmit={handleCreatePl} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Playlist Name (e.g. Midnight Cyber Run)"
                value={newPlaylistName}
                onChange={e => setNewPlaylistName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewPlModal(false)}
                  className="w-1/2 py-2 bg-slate-800 text-zinc-300 text-xs font-mono rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-cyan-500 text-black text-xs font-mono font-bold rounded-lg shadow-lg"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
