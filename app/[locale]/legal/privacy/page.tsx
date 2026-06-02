import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { isLocale } from '@/lib/i18n/config';
import { localizeHref } from '@/lib/i18n/pathname';
import { notFound } from 'next/navigation';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

const EFFECTIVE_DATE = '3 June 2026';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  if (!isLocale(locale)) return {};
  return buildPageMetadata({
    title: 'Privacy Policy',
    description:
      'How Azzuro Resources PLC handles personal information collected through azzuroresources.com and the contact channels published on it.',
    locale,
    path: '/legal/privacy',
  });
}

export default function PrivacyPage({ params }: { params: { locale: string } }) {
  const { locale } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <main id="main-content">
      <section className="-mt-24 bg-primary text-white">
        <div className="px-6 pb-16 pt-36 sm:px-10 sm:pb-20 sm:pt-40 lg:px-16">
          <p className="kicker kicker-invert">Legal</p>
          <h1 className="mt-6 max-w-[22ch] font-display text-balance text-4xl font-medium leading-[1.04] tracking-[-0.01em] sm:text-5xl lg:text-[3.5rem]">
            Privacy Policy
          </h1>
          <p className="mt-6 text-[12px] font-medium uppercase tracking-[0.24em] text-white/55">
            Effective {EFFECTIVE_DATE}
          </p>
        </div>
      </section>

      <section className="bg-paper px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
        <article className="prose prose-slate mx-auto max-w-3xl prose-headings:font-display prose-headings:font-medium prose-headings:tracking-tight prose-a:text-ink prose-a:underline-offset-4 hover:prose-a:text-[hsl(var(--copper))]">
          <h2>About this policy</h2>
          <p>
            This Privacy Policy describes how Azzuro Resources PLC and its related bodies corporate
            (<strong>Azzuro</strong>, <strong>we</strong>, <strong>us</strong>, <strong>our</strong>) handle personal
            information collected through this website, azzuroresources.com (the <strong>Site</strong>), and through the
            contact channels we make available on it.
          </p>
          <p>
            Azzuro is admitted to the Official List of ASX Limited under the ASX code <strong>AZ9</strong> and operates
            from offices in Mongolia, Australia and the United Kingdom. Market-sensitive disclosures are released through
            ASX in accordance with our continuous disclosure obligations, and are available via the investor centre linked
            from the Site.
          </p>

          <h2>What this Site collects</h2>
          <p>
            This Site is informational. It does <strong>not</strong> include user accounts, contact forms, comments,
            newsletter sign-ups or any other data-entry feature that asks you to submit personal information. We collect
            only what is described below.
          </p>
          <h3>Information you choose to send us</h3>
          <p>
            If you call, email or otherwise contact us using the phone numbers and email addresses published on the Site,
            we receive the contact details you choose to share (such as your name, phone number, email address and
            employer) together with the content of your enquiry.
          </p>
          <h3>Information collected automatically by our hosting infrastructure</h3>
          <p>
            Like most websites, our hosting provider (Vercel Inc.) generates standard server logs when you visit. These
            typically include your approximate IP address, the date and time of the request, the page requested, the
            referring URL, and information about your browser and device. We use this information to operate, secure and
            monitor the Site and to diagnose technical issues. We do not use it to build a profile of you.
          </p>
          <h3>A single functional cookie</h3>
          <p>
            We set a small cookie (<code>NEXT_LOCALE</code>) to remember whether you have chosen English or Mongolian as
            your preferred language. This cookie does not identify you and is not used for advertising. You can clear or
            block it through your browser settings; doing so will not prevent the Site from working.
          </p>
          <h3>Map tiles</h3>
          <p>
            Project and office locations are displayed using map tiles served by MapTiler AG. When a map loads, MapTiler
            will receive the standard request information necessary to deliver the tiles, including your IP address. Their
            privacy practices are governed by their own privacy statement at maptiler.com.
          </p>
          <p>We do not use third-party advertising trackers on this Site.</p>

          <h2>How we use information</h2>
          <p>We use personal information you send us, and information from our server logs, to:</p>
          <ul>
            <li>respond to your enquiry and continue any correspondence you initiate;</li>
            <li>provide investor information and shareholder communications where you have asked for them;</li>
            <li>operate, secure and improve the Site, including diagnosing errors and preventing misuse;</li>
            <li>
              meet our legal, regulatory and reporting obligations, including under the ASX Listing Rules and applicable
              corporations and securities legislation; and
            </li>
            <li>comply with requests from courts, regulators or other lawful authorities.</li>
          </ul>
          <p>We do not sell personal information.</p>

          <h2>Disclosure to third parties</h2>
          <p>We may disclose personal information to:</p>
          <ul>
            <li>
              our related bodies corporate, advisers, auditors and professional service providers (legal, accounting,
              share registry, investor relations) who need it to perform their role for Azzuro;
            </li>
            <li>
              our IT and hosting providers, including Vercel Inc. for website hosting and MapTiler AG for map services;
              and
            </li>
            <li>
              courts, regulators (including ASX Limited and the Australian Securities and Investments Commission), and
              other authorities where required or permitted by law.
            </li>
          </ul>
          <p>
            We require service providers to handle personal information consistently with this policy and applicable law.
          </p>

          <h2>International handling</h2>
          <p>
            Azzuro operates in Mongolia, Australia and the United Kingdom. As a result, personal information may be
            accessed by personnel and service providers in each of those jurisdictions. We take reasonable steps to ensure
            that overseas recipients handle personal information in a manner consistent with this policy and applicable
            law.
          </p>

          <h2>Your privacy rights</h2>
          <p>
            Depending on where you are based, applicable privacy laws — including the Australian{' '}
            <em>Privacy Act 1988</em> (Cth) and the Australian Privacy Principles, the UK{' '}
            <em>Data Protection Act 2018</em> and UK GDPR, and Mongolia&apos;s{' '}
            <em>Law on Personal Data Protection</em> — may give you rights in respect of personal information about you.
            These can include the right to:
          </p>
          <ul>
            <li>request access to personal information we hold about you;</li>
            <li>request correction of inaccurate or incomplete information;</li>
            <li>request that we restrict or stop processing your information in certain circumstances; and</li>
            <li>complain to a privacy regulator.</li>
          </ul>
          <p>
            To exercise any of these rights, or to ask a question about how we handle your information, please contact us
            using the details below. We may need to verify your identity before responding.
          </p>

          <h2>Children</h2>
          <p>
            This Site is directed at investors, professional contacts and members of the public with an interest in
            Azzuro&apos;s business. It is not directed at children, and we do not knowingly collect personal information
            from children.
          </p>

          <h2>Security and retention</h2>
          <p>
            We use reasonable technical and organisational measures appropriate to the limited categories of personal
            information we handle. No method of transmission over the internet is completely secure, and we cannot
            guarantee absolute security. We retain personal information only for as long as needed for the purposes
            described in this policy, or for as long as required by law (including record-keeping obligations under
            corporations and tax law).
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. The
            &ldquo;Effective&rdquo; date at the top of this policy indicates when it was last updated. Continued use of
            the Site after a change becomes effective constitutes acceptance of the updated policy.
          </p>

          <h2>Contact</h2>
          <p>
            If you have any questions, requests or complaints regarding this Privacy Policy or how we handle personal
            information, please contact us at:
          </p>
          <p>
            <strong>Azzuro Resources PLC</strong>
            <br />
            Email: <a href="mailto:contact@azzuroresources.com">contact@azzuroresources.com</a>
          </p>
          <p>
            Office addresses, additional contact emails and phone numbers are listed on our{' '}
            <Link href={localizeHref(locale, '/contact')}>Contact page</Link>.
          </p>
        </article>
      </section>
    </main>
  );
}
