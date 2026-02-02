import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@rspress/core';
import { transformerCompatibleMetaHighlight } from '@rspress/core/shiki-transformers';
import { pluginLlms } from '@rspress/plugin-llms';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getLocaleSidebar(lang: 'en' | 'zh', routePrefix: string) {
  const localeDir = path.join(__dirname, 'docs', lang);
  if (!fs.existsSync(localeDir)) {
    return [];
  }

  const categoryDirs = fs
    .readdirSync(localeDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .filter((name) => !name.startsWith('.'))
    .sort();

  const items: Array<{
    text: string;
    link?: string;
    items?: Array<{ text: string; link: string }>;
    collapsible?: boolean;
    collapsed?: boolean;
  }> = [];

  items.push({
    text: lang === 'en' ? 'Overview' : '概览',
    link: `${routePrefix}/overview`,
  });

  for (const categoryDir of categoryDirs) {
    const categoryPath = path.join(localeDir, categoryDir);
    const files = fs
      .readdirSync(categoryPath, { withFileTypes: true })
      .filter((dirent) => dirent.isFile())
      .map((dirent) => dirent.name)
      .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
      .sort((a, b) => {
        if (a.toLowerCase() === 'readme.md') return -1;
        if (b.toLowerCase() === 'readme.md') return 1;
        return a.localeCompare(b);
      });

    const categoryItems = files.map((file) => {
      if (file.toLowerCase() === 'readme.md') {
        return {
          text: lang === 'en' ? 'Overview' : '概览',
          link: `${routePrefix}/${categoryDir}/README`,
        };
      }

      const baseName = file.replace(/\.mdx?$/, '');
      return {
        text: baseName,
        link: `${routePrefix}/${categoryDir}/${baseName}`,
      };
    });

    if (categoryItems.length === 0) {
      continue;
    }

    const categoryText =
      lang === 'en'
        ? categoryDir
            .split('-')
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ')
        : categoryDir;

    items.push({
      text: categoryText,
      items: categoryItems,
      collapsible: true,
      collapsed: categoryDir !== 'events',
    });
  }

  return items;
}

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
const siteBase = process.env.RSPRESS_SITE_BASE;

const localesConfig = [
  {
    lang: 'en' as const,
    label: 'English',
    description: 'English Docs',
    base: '',
    overviewLink: '/overview',
    guideText: 'Guide',
    contributingText: 'Contributing',
    activeMatch: '^/(overview|guide|events|lifecycles|mts|side-effects|state)/',
  },
  {
    lang: 'zh' as const,
    label: '简体中文',
    description: '中文文档',
    base: '/zh',
    overviewLink: '/zh/overview',
    guideText: '指南',
    contributingText: '贡献指南',
    activeMatch: '^/zh/(overview|guide|events|lifecycles|mts|side-effects|state)/',
  },
];

const socialLinks = [
  {
    icon: {
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%"><path fill="currentColor" d="M19.54 4.27A18.2 18.2 0 0 0 14.98 3c-.2.36-.43.84-.6 1.22a17.2 17.2 0 0 0-4.76 0C9.45 3.84 9.22 3.36 9 3a18.3 18.3 0 0 0-4.56 1.27C1.62 8.43.86 12.5 1.24 16.5A18.7 18.7 0 0 0 6.9 19.3c.46-.63.87-1.31 1.22-2.03-.67-.25-1.31-.56-1.92-.93.16-.12.32-.25.47-.38 3.7 1.74 7.72 1.74 11.38 0 .16.13.31.26.47.38-.61.37-1.25.68-1.92.93.35.72.76 1.4 1.22 2.03a18.7 18.7 0 0 0 5.66-2.8c.45-4.63-.77-8.66-3.02-12.23ZM8.45 14.6c-1.1 0-2-.99-2-2.2s.89-2.2 2-2.2 2 .99 2 2.2-.9 2.2-2 2.2Zm7.1 0c-1.1 0-2-.99-2-2.2s.89-2.2 2-2.2 2 .99 2 2.2-.9 2.2-2 2.2Z"/></svg>',
    },
    mode: 'link',
    content: 'https://discord.gg/mXk7jqdDXk',
  },
  {
    icon: {
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%"><path fill="currentColor" d="M18.9 2H22l-6.76 7.73L23.2 22h-6.22l-4.87-6.93L6.05 22H3l7.23-8.26L.8 2H7.2l4.4 6.28L18.9 2Zm-1.09 18h1.72L6.26 3.9H4.42L17.81 20Z"/></svg>',
    },
    mode: 'link',
    content: 'https://x.com/lynxjs_org',
  },
  { icon: 'github', mode: 'link', content: 'https://github.com/lynx-community/reactlynx-use' },
];

function buildSidebar(lang: 'en' | 'zh', base: string, contributingText: string) {
  return [
    ...getLocaleSidebar(lang, base),
    { text: contributingText, link: `${base}/contributing` },
  ];
}

export default defineConfig({
  root: 'docs',
  title: `ReactLynxUse v${packageJson.version}`,
  description: 'A React-style hooks library designed specifically for ReactLynx',
  lang: 'en',
  base: siteBase,
  markdown: {
    shiki: {
      transformers: [transformerCompatibleMetaHighlight()],
    },
  },
  plugins: [pluginLlms()],
  themeConfig: {
    llmsUI: true,
    socialLinks,
    locales: localesConfig.map(({ lang, label, description, base, guideText, contributingText, overviewLink, activeMatch }) => ({
      lang,
      label,
      description,
      nav: [
        { text: guideText, link: overviewLink, activeMatch },
        { text: contributingText, link: `${base}/contributing` },
      ],
      sidebar: {
        [base || '/']: buildSidebar(lang, base, contributingText),
      },
    })),
    outline: true,
  },
  locales: localesConfig.map(({ lang, label, description }) => ({ lang, label, description })),
});
