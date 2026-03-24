import { useEffect } from 'react';

export function useDynamicFavicon() {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const generateFavicon = (color: string) => {
      // Encode the # symbol for data URI
      const encodedColor = color.replace('#', '%23');
      return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="${encodedColor}"/><circle cx="50" cy="50" r="20" fill="white" opacity="0.8"/><text x="50" y="68" font-size="50" font-weight="bold" text-anchor="middle" fill="${encodedColor}" font-family="sans-serif">S</text></svg>`;
    };
    
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    
    // Function to update the favicon
    const updateFavicon = () => {
      const isDark = document.documentElement.classList.contains('dark');
      link.href = generateFavicon(isDark ? '#ff00ff' : '#00ffff');
    };

    // Create an observer to watch for class changes on HTML element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateFavicon();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    // Initial Setting
    updateFavicon();
    
    return () => observer.disconnect();
  }, []);
}
