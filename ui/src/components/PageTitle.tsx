import { Typography } from '@mui/material';

interface PageTitleProps {
  title: string;
}

function PageTitle({ title }: PageTitleProps) {
  return (
    <Typography variant="h5" component="h1" gutterBottom>
      {title}
    </Typography>
  );
}

export default PageTitle;
