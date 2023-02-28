import { AppBar, Box, Button, Container, Toolbar } from "@mui/material";
import * as React from "react";
import { Outlet } from "react-router-dom";

const pages = [
  { label: "App Generator", link: "/" },
  { label: "Bitbucket Browser", link: "/repository-browser" },
  { label: "Live Progress Bar", link: "/real-time-progress-bar" },
];
export const ResponsiveAppBar = () => {
  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", sm: "flex" } }}>
              {pages.map((page) => (
                <Button
                  href={page.link}
                  key={page.link}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page.label}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Outlet />
    </>
  );
};
