import { create } from 'zustand';

export const useStore = create((set, get) => ({
  activeTab: 'browse', // 'browse' | 'playlists' | 'lyrics' | 'offline'
  selectedGenre: 'All',
  searchQuery: '',

  genres: ['All', 'Synthwave', 'Cyberpunk', 'Ambient Chill', 'Nu-Disco', 'Deep House', 'Lo-Fi Tape'],

  tracks: [
    {
      id: 'trk-01',
      title: 'Midnight Grid Runner',
      artist: 'Kavinsky Protocol',
      album: 'Outrun Continuum',
      genre: 'Synthwave',
      duration: 214, // seconds
      bitrate: 'FLAC 24-bit / 96kHz',
      cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
      lyrics: [
        { time: 0, text: '[Instrumental Synth Intro]' },
        { time: 14, text: 'Neon horizons bleed into the dark' },
        { time: 28, text: 'Analog pulses tracing every spark' },
        { time: 42, text: 'Accelerating through the speed of light' },
        { time: 56, text: 'We are the shadows of the cyber night' }
      ]
    },
    {
      id: 'trk-02',
      title: 'Sub-Orbital Horizon',
      artist: 'Aethel Wave',
      album: 'Exosphere Drift',
      genre: 'Ambient Chill',
      duration: 278,
      bitrate: 'Lossless MQA 192kHz',
      cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      lyrics: [
        { time: 0, text: '[Ethereal Harmonic Chimes]' },
        { time: 30, text: 'Drifting beyond the atmosphere' },
        { time: 60, text: 'Silent echoes crystal clear' }
      ]
    },
    {
      id: 'trk-03',
      title: 'Neural Overdrive (2026 Remaster)',
      artist: 'CyberDynasty',
      album: 'Tokyo Underbelly',
      genre: 'Cyberpunk',
      duration: 195,
      bitrate: 'FLAC 24-bit / 96kHz',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      lyrics: [
        { time: 0, text: '[Heavy Distorted Bassline]' },
        { time: 12, text: 'Cables intertwined within the spine' },
        { time: 26, text: 'Synthetic dopamine across the line' },
        { time: 40, text: 'System breach — maximum surge' }
      ]
    },
    {
      id: 'trk-04',
      title: 'Mirage on Riviera',
      artist: 'Starlight Disco',
      album: 'French Touch Vol. 4',
      genre: 'Nu-Disco',
      duration: 242,
      bitrate: 'Lossless 24-bit / 48kHz',
      cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
      lyrics: [
        { time: 0, text: '[Funky Slap Bass & Brass]' },
        { time: 16, text: 'Sunlight fading on the coast of gold' },
        { time: 32, text: 'A summer memory that never gets old' }
      ]
    }
  ],

  playlists: [
    { id: 'pl-1', name: 'Cyberpunk Focus & Flow', count: 18, cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80' },
    { id: 'pl-2', name: 'Deep Space Binaural Beats', count: 12, cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80' }
  ],

  // Player state
  currentTrackId: 'trk-01',
  isPlaying: false,
  progress: 24, // current time in seconds
  volume: 85,
  isMuted: false,
  offlineTrackIds: ['trk-01'],

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedGenre: (g) => set({ selectedGenre: g }),
  setSearchQuery: (q) => set({ searchQuery: q }),

  playTrack: (trackId) => set({
    currentTrackId: trackId,
    isPlaying: true,
    progress: 0
  }),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setProgress: (val) => set({ progress: val }),
  setVolume: (v) => set({ volume: v }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

  nextTrack: () => set((state) => {
    const currentIndex = state.tracks.findIndex(t => t.id === state.currentTrackId);
    const nextIndex = (currentIndex + 1) % state.tracks.length;
    return {
      currentTrackId: state.tracks[nextIndex].id,
      progress: 0,
      isPlaying: true
    };
  }),

  prevTrack: () => set((state) => {
    const currentIndex = state.tracks.findIndex(t => t.id === state.currentTrackId);
    const prevIndex = (currentIndex - 1 + state.tracks.length) % state.tracks.length;
    return {
      currentTrackId: state.tracks[prevIndex].id,
      progress: 0,
      isPlaying: true
    };
  }),

  toggleOfflineDownload: (trackId) => set((state) => {
    const exists = state.offlineTrackIds.includes(trackId);
    return {
      offlineTrackIds: exists
        ? state.offlineTrackIds.filter(id => id !== trackId)
        : [...state.offlineTrackIds, trackId]
    };
  }),

  createPlaylist: (name) => set((state) => ({
    playlists: [
      ...state.playlists,
      {
        id: `pl-${Date.now()}`,
        name,
        count: 1,
        cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80'
      }
    ]
  }))
}));
