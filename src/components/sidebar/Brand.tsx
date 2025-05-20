import { Snowboarding } from "@mui/icons-material";
import { Toolbar, Typography } from "@mui/material";

function Brand() {
  return (
    <Toolbar>
      <Snowboarding sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
      <Typography
        variant="h6"
        noWrap
        component="a"
        color="info"
        sx={{
          mr: 2,
          display: { xs: "none", md: "flex" },
          fontFamily: "monospace",
          fontWeight: 700,
          letterSpacing: ".3rem",
          color: "inherit",
          textDecoration: "none",
        }}
      >
        haorong
      </Typography>
    </Toolbar>
  );
}

export default Brand;
