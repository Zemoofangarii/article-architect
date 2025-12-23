import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLocale } from '@/contexts/LocaleContext';
import { toast } from 'sonner';

const About = () => {
  const { locale } = useLocale();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(locale === 'ar' ? 'تم إرسال رسالتك بنجاح' : 'Message sent successfully!');
  };

  const stats = [
    { value: '50K+', label: locale === 'ar' ? 'قارئ شهري' : 'Monthly Readers' },
    { value: '500+', label: locale === 'ar' ? 'مقالة منشورة' : 'Articles Published' },
    { value: '25+', label: locale === 'ar' ? 'كاتب' : 'Writers' },
    { value: '4.8', label: locale === 'ar' ? 'تقييم القراء' : 'Reader Rating' },
  ];

  const team = [
    {
      name: locale === 'ar' ? 'سارة تشن' : 'Sarah Chen',
      role: locale === 'ar' ? 'رئيسة التحرير' : 'Editor-in-Chief',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
    },
    {
      name: locale === 'ar' ? 'ماركوس جونسون' : 'Marcus Johnson',
      role: locale === 'ar' ? 'محرر أول' : 'Senior Editor',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    },
    {
      name: locale === 'ar' ? 'عائشة رحمن' : 'Aisha Rahman',
      role: locale === 'ar' ? 'مراسلة التصميم' : 'Design Correspondent',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
    },
  ];

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-gradient-hero pt-12 pb-16 md:pt-16 md:pb-24">
        <div className="container-editorial">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {locale === 'ar' ? 'عن Editorial' : 'About Editorial'}
            </h1>
            <p className="text-xl text-muted-foreground">
              {locale === 'ar'
                ? 'نحن منصة للقصص التي تهم، نجمع بين الصحافة المتعمقة والتصميم الأنيق لنقدم لك محتوى يستحق وقتك.'
                : 'We are a platform for stories that matter, combining in-depth journalism with elegant design to deliver content worthy of your time.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-editorial py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <p className="font-serif text-4xl md:text-5xl font-bold gradient-text mb-2">
                {stat.value}
              </p>
              <p className="text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                {locale === 'ar' ? 'مهمتنا' : 'Our Mission'}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {locale === 'ar'
                  ? 'في عالم مليء بالمعلومات، نؤمن بقوة القصص المحكية جيداً. مهمتنا هي تقديم محتوى عميق ومدروس يساعد قراءنا على فهم العالم من حولهم بشكل أفضل.'
                  : 'In a world overflowing with information, we believe in the power of well-told stories. Our mission is to deliver thoughtful, in-depth content that helps our readers better understand the world around them.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container-editorial py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            {locale === 'ar' ? 'فريقنا' : 'Our Team'}
          </h2>
          <p className="text-muted-foreground">
            {locale === 'ar'
              ? 'تعرف على الأشخاص الذين يقفون وراء Editorial'
              : 'Meet the people behind Editorial'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-serif text-xl font-semibold">{member.name}</h3>
              <p className="text-muted-foreground">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container-editorial">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                {locale === 'ar' ? 'تواصل معنا' : 'Get in Touch'}
              </h2>
              <p className="text-muted-foreground">
                {locale === 'ar'
                  ? 'نحب أن نسمع منك. أرسل لنا رسالة وسنرد عليك في أقرب وقت ممكن.'
                  : "We'd love to hear from you. Send us a message and we'll respond as soon as possible."}
              </p>
            </div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder={locale === 'ar' ? 'الاسم' : 'Name'}
                  required
                />
                <Input
                  type="email"
                  placeholder={locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  required
                />
              </div>
              <Input
                placeholder={locale === 'ar' ? 'الموضوع' : 'Subject'}
                required
              />
              <Textarea
                placeholder={locale === 'ar' ? 'رسالتك' : 'Your message'}
                rows={6}
                required
              />
              <Button type="submit" size="lg" className="w-full md:w-auto">
                {locale === 'ar' ? 'إرسال الرسالة' : 'Send Message'}
              </Button>
            </motion.form>

            {/* Contact Info */}
            <div className="mt-12 pt-12 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">hello@editorial.com</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">San Francisco, CA</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default About;
