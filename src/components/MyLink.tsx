import { Link as MuiLink } from '@mui/material';
import { Link } from '@tanstack/react-router';
import type { LinkOwnProps } from '@mui/material';

export const MyLink: React.FC<{
  color: LinkOwnProps['color']
  text: string;
  href: string
}> = ({ color, text, href }) => {
  return <MuiLink component={Link} to={href} underline='always' variant='body1' color={color}>{text}</MuiLink>;
};
