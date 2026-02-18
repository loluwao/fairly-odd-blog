import { Link, Stack, Typography } from '@mui/material';

export const Footer: React.FC = () => {
  return (
    <Stack display={'flex'} direction={'row'} gap={2} width={'fit-content'}>
      <img src={'/fairlyodd-logo-white.png'} width={60} height={60} alt='a doodle of white colored headphones'/>
      <Stack>
        <Typography>SAY HI. Or give me feedback</Typography>
        <Stack direction={'row'} gap={2}>
          <Link href="mailto:djtemitturner@gmail.com" variant={'body1'} sx={{ textDecoration: 'underline' }}>email</Link>
          <Link href="https://www.instagram.com/fairlyoddhour?igsh=MWdqbngzZGdzYmYzeA%3D%3D&utm_source=qr" variant={'body1'} sx={{ textDecoration: 'underline' }}>IG</Link>
        </Stack>
      </Stack>
    </Stack>
  );
};
