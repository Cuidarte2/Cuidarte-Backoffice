// theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#053b5e", 
      light: "#e9e9e9",
      contrastText: "#fff",
    },
    secondary: {
      main: "#D1B984", // dorado
      contrastText: "#000",
    },
    background: {
      default: "#dbe9f3", // color de fondo claro
      paper: "white",
    },
    text: {
      primary: "#2B2B2B", // texto oscuro
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "#5C3B23",
        },
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8B5E3C",
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused:after": {
            borderBottom: "2px solidrgb(60, 134, 139)",
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          "&:-webkit-autofill": {
            boxShadow: "0 0 0 1000px #053b5e inset",
            WebkitTextFillColor: "#2B2B2B",
            transition: "background-color 5000s ease-in-out 0s",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "16px",
          "& .MuiButton-root": {
            backgroundColor: "#B99342", 
            color: "white",
            padding: "8px 16px",
            marginTop: "8px",
            borderRadius: 20,
            textDecoration: "none", 
           
            "&:hover": {
              backgroundColor: "#8B5E3C",
            },
          },
        },
      },
    },
  },
});

export default theme;
