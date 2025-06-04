import { SvgIcon, type SvgIconProps } from '@mui/material';

const LogoIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 421 421">
    <image
      href="/logo.svg"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
    />
  </SvgIcon>
);

export default LogoIcon;