import { es } from './translations/es';
import { en } from './translations/en';

const translations = { es, en };

export function getLangFromUrl(url: URL | string): 'es' | 'en' {
  const pathname = typeof url === 'string' ? new URL(url).pathname : url.pathname;
  if (pathname.startsWith('/en')) {
    return 'en';
  }
  return 'es'; // Fallback
}

export function t(lang: 'es' | 'en', key: string): string | any {
  const dictionary = translations[lang] || translations.es;
  const keys = key.split('.');
  
  let result: any = dictionary;
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      return key; // Return the key itself if not found
    }
  }
  return result;
}

export function getAlternateUrls(): { href: string; hreflang: string }[] {
  return [
    { href: 'https://ninin.online/es', hreflang: 'es' },
    { href: 'https://ninin.online/en', hreflang: 'en' },
    { href: 'https://ninin.online', hreflang: 'x-default' }
  ];
}
