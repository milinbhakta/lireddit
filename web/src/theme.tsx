import { ThemeOptions } from "@material-ui/core/styles";
// Import useEffect and useState hooks from React:
import { useState } from 'react';

// Create a theme instance.
export const darkTheme: ThemeOptions = {
  palette: {
    primary: { main: "#053f5b" },
    secondary: { main: "#5e3c6f" },
    type: "light"
  },
  typography: {
    fontFamily: "Bitter"
  }
};

export const useDarkMode = () => {
  const [theme, setTheme] = useState(darkTheme);

  const toggleDarkMode = () => {
    const updatedTheme = {
      ...theme,
      palette: {
        ...theme.palette,
        type: theme.palette?.type === 'light' ? 'dark' : 'light',
      }
    }
    setTheme(updatedTheme as ThemeOptions);
  }

  return [theme, toggleDarkMode];
}