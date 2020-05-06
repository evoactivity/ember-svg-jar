export const BREAKPOINTS = {
  medium: '(min-width: 960px)',
  large: '(min-width: 1200px)',
};

const publicURL = typeof window !== 'undefined' && typeof window.SVG_JAR_PUBLIC_URL !== 'undefined'
  ? window.SVG_JAR_PUBLIC_URL
  : '/';

export const ASSETS_PATH = `${publicURL}svg-jar-viewer.json`;
