import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.palette.background.default};
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

const getDesignTokens = (mode) => ({
  components: {
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: "initial",
          fontFamily: "Noto Sans",
          color: theme.palette.text.primary,
          backgroundImage: "none",
          backgroundColor: theme.palette.background.paper,
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          boxShadow: "none",
          fontSize: "1.4rem",
          borderRadius: "3rem",
          textTransform: "initial",
          fontFamily: "Noto Sans",
          color: "#0b1528",
          background: `linear-gradient(180deg, ${theme.palette.color.goldLight}, ${theme.palette.color.primary})`,
          padding: "4px 13px",
          "&.Mui-disabled": {
            opacity: 0.8,
          },
          "&:hover": {
            boxShadow: "none",
            opacity: 0.92,
          },
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(212, 175, 55, 0.35)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.color.primary,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.color.primary,
          },
        }),
        input: {
          color: "#ffffff",
        },
      },
    },
  },
  typography: {
    fontSize: 21,
    fontFamily: ["Noto Sans", "League Spartan", "Bebas Neue", "IBM Plex Sans", "Poppins", "sans-serif"].join(","),
  },
  palette: {
    mode,
    background: {
      default: "#0b1528",
      paper: "#162948",
      preCode: "#000000",
    },
    text: {
      first: "#ffffff",
      primary: "#ffffff",
      secondary: "#b8c0d4",
    },
    color: {
      primary: "#d4af37",
      secondary: "#b8c0d4",
      goldLight: "#e5c05b",
      champagne: "#e2c499",
      accentBlue: "#3a86ff",
      card: "#162948",
      border: "rgba(212, 175, 55, 0.45)",
    },
    primary: {
      main: "#d4af37",
      contrastText: "#0b1528",
    },
    secondary: {
      main: "#3a86ff",
      contrastText: "#ffffff",
    },
  },
});

const ThemeLayout = (props) => {
  const theme = createTheme(getDesignTokens("dark"));
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle theme={theme} />
        {props.children}
      </ThemeProvider>
    </>
  );
};
export default ThemeLayout;
