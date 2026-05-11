export interface Track {
  id: string;
  title: string;
  description?: string;
  url: string;
}

export const TRACKS: Track[] = [
  { id: 'may-7-26', title: 'rough fairly odd set #1 (May 7, 2026)', url: `${import.meta.env.VITE_AUDIO_BUCKET}/MAY726.mp3`, description: 'I am working on my first OFFICIAL set and this is the first part of me messing around with it' },
  { id: 'april-1-26', title: 'April fools mix (actually kinda good)', url: `${import.meta.env.VITE_AUDIO_BUCKET}/APR126.mp3`, description: 'Practicing mixing 130-140 bpm music. Something I have literally never done. Some blunders but I enjoyed this' },
  { id: 'march-27-26', title: 'Good session from March 27, 2026', url: `${import.meta.env.VITE_AUDIO_BUCKET}/MAR2726.mp3`, description: 'Practice I did that I actually really liked cuz I don\'t mix a lot of jungle but this has lots of jungle' },
  { id: 'feb-8-26', title: 'Crap from february 8, 2026', url: `${import.meta.env.VITE_AUDIO_BUCKET}/FEB826.mp3`, description: 'some ghettotech, practicing mixing new songs i got. Sort of sloppy' },
];
