import React from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '@/contexts/LocaleContext';
import { Mail, Twitter, Github, Linkedin } from 'lucide-react';

export function Footer() {
  const { t, locale } = useLocale();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navigation: [
      { label: t('nav.home'), href: '/' },
      { label: t('nav.articles'), href: '/articles' },
      { label: t('nav.categories'), href: '/categories' },
      { label: t('nav.about'), href: '/about' },
    ],
    legal: [
      { label: t('footer.privacy'), href: '/privacy' },
      { label: t('footer.terms'), href: '/terms' },
    ],
    social: [
      { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
      { icon: Github, href: 'https://github.com', label: 'GitHub' },
      { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
      { icon: Mail, href: 'mailto:hello@editorial.com', label: 'Email' },
    ],
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="container-editorial py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-editorial flex items-center justify-center">
                <span className="text-xl font-serif font-bold text-primary-foreground">E</span>
              </div>
              <span className="font-serif text-xl font-semibold">Editorial</span>
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6">
              {locale === 'ar'
                ? 'منصة للقصص التي تهم. اكتشف مقالات ورؤى من أصوات رائدة.'
                : 'A platform for stories that matter. Discover articles and insights from leading voices.'}
            </p>
            <div className="flex items-center gap-4">
              {footerLinks.social.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/80 transition-colors"
                  aria-label={item.label}
                >
                  <item.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">{t('nav.home')}</h4>
            <ul className="space-y-3">
              {footerLinks.navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">{locale === 'ar' ? 'قانوني' : 'Legal'}</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Editorial. {t('footer.rights')}
          </p>
          <p className="text-sm text-muted-foreground">
            {locale === 'ar' ? 'صُنع بـ ❤️ للقراء' : 'Made with ❤️ for readers'}
          </p>
        </div>
      </div>
    </footer>
  );
}
