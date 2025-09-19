import { useLayoutEffect } from "react";

export function useThemeClass() {
  useLayoutEffect(() => {
    const theme = localStorage.getItem('theme') || 'white';
    const html = document.documentElement;
    html.classList.remove('theme-dark-blue', 'theme-dark-red', 'theme-white');
    if (theme === 'dark-blue') html.classList.add('theme-dark-blue');
    else if (theme === 'dark-red') html.classList.add('theme-dark-red');
    else html.classList.add('theme-white');
  }, []);
}
