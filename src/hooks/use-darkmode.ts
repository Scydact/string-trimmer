import { createTheme, useMediaQuery } from "@mui/material";
import { useCallback, useMemo } from "react";
import useLocalStorage from "use-local-storage";

export type PaletteMode = 'light' | 'dark' | 'auto';

export function useDarkMode() {
  const [mode, setMode] = useLocalStorage<PaletteMode>('muiTheme', 'auto');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const toggleMode = useCallback((mode?: PaletteMode) => {
    if (mode) setMode(mode);
    else setMode(prev => {
      switch (prev) {
        case 'light':
          return 'auto';
        case 'auto':
          return 'dark';
        case 'dark':
        default:
          return 'light';
      }
    });
  }, [])

  const theme = useMemo(() => {
    let m: 'light' | 'dark' = 'light';
    switch (mode) {
      case 'light':
      case 'dark':
        m = mode;
        break;
      default:
        m = prefersDarkMode ? 'dark' : 'light'
        break;
    }

    return createTheme({
      palette: {
        mode: m,
      }
    })
  }, [prefersDarkMode, mode])

  return { mode, setMode, toggleMode, theme };
}

export default useDarkMode;