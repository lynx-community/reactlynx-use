import * as path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'ReactLynx Use',
  icon: '/rspress-icon.png',
  lang: 'en',
  logo: {
    light: '/rspress-light-logo.png',
    dark: '/rspress-dark-logo.png',
  },
  themeConfig: {
        locales: [
      {
        lang: 'zh',
        title: 'ReactLynxUse',
        label: '简体中文',
      },
      {
        lang: 'en',
        title: 'ReactLynxUse',
        label: 'English',
      },
    ],
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/lynx-community/reactlynx-use',
      },
    ],
  },
});
