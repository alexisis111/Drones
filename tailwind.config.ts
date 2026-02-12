import type { Config } from '@tailwindcss/vite';

export default {
  theme: {
    extend: {
      screens: {
        'max-xl': {'max': '1284px'},  // Custom breakpoint for screens less than 1285px
        'xl': {'min': '1285px'},      // Custom breakpoint for screens 1285px and above
      }
    }
  }
} satisfies Config;