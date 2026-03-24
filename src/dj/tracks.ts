export interface Track {
  id: string;
  title: string;
  description?: string;
  url: string;
}

export const TRACKS: Track[] = [
  { id: 'feb-8-26', title: 'Crap from february 8, 2026', url: `${import.meta.env.VITE_AUDIO_BUCKET}/FEB826.mp3`, description: 'some ghettotech, practicing mixing new songs i got. Sort of sloppy' },
];
