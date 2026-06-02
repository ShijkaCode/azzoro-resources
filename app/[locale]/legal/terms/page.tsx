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
    title: 'Terms of Use',
    description:
      'Terms governing use of azzuroresources.com, the website of Azzuro Resources PLC (ASX: AZ9).',
    locale,
    path: '/legal/terms',
  });
}

export default function TermsPage({ params }: { params: { locale: string } }) {
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
            Terms of Use
          </h1>
          <p className="mt-6 text-[12px] font-medium uppercase tracking-[0.24em] text-white/55">
            Effective {EFFECTIVE_DATE}
          </p>
        </div>
      </section>

      <section className="bg-paper px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
        <article className="prose prose-slate mx-auto max-w-3xl prose-headings:font-display prose-headings:font-medium prose-headings:tracking-tight prose-a:text-ink prose-a:underline-offset-4 hover:prose-a:text-[hsl(var(--copper))]">
          <h2>About these Terms</h2>
          <p>
            These Terms of Use (<strong>Terms</strong>) govern your use of azzuroresources.com (the <strong>Site</strong>),
            operated by Azzuro Resources PLC and its related bodies corporate (<strong>Azzuro</strong>,{' '}
            <strong>we</strong>, <strong>us</strong>, <strong>our</strong>). By accessing or using the Site, you agree to
            be bound by these Terms.
          </p>
          <p>
            Azzuro is admitted to the Official List of ASX Limited under the ASX code <strong>AZ9</strong>. All
            market-sensitive information about Azzuro is released through ASX in accordance with our continuous disclosure
            obligations and is available via the investor centre linked from the Site.
          </p>

          <h2>Information on this Site</h2>
          <p>
            The Site contains general information about Azzuro&apos;s business, projects and people. It is provided{' '}
            <strong>for general information purposes only</strong>. It is not, and must not be relied on as, financial
            product advice, an offer or invitation to acquire securities, or a recommendation to buy, hold or sell any
            security.
          </p>
          <p>
            Decisions about investing in Azzuro securities should be made on the basis of Azzuro&apos;s announcements
            lodged with ASX and other regulatory filings, after consideration of your own financial situation, objectives
            and needs and, where appropriate, after seeking independent professional advice.
          </p>

          <h2>Forward-looking and exploration information</h2>
          <p>
            Material on the Site may include forward-looking statements regarding Azzuro&apos;s projects, exploration
            results, planned activities and operations. Forward-looking statements involve known and unknown risks,
            uncertainties and assumptions, and actual results may differ materially from those expressed or implied.
          </p>
          <p>
            Exploration results, mineral resource estimates, exploration targets and other technical information published
            on the Site are reported in accordance with the JORC Code and other applicable standards. Any exploration
            target referenced is conceptual and there is no certainty that further exploration will lead to the estimation
            of a mineral resource. Where indicated, drafts of project pages may show information that is pending final
            Competent Person sign-off.
          </p>

          <h2>Permitted use</h2>
          <p>
            You may view, download and print pages of the Site for your own personal, non-commercial use, provided that
            you do not modify the content and that all copyright and other proprietary notices are retained. You must not:
          </p>
          <ul>
            <li>use the Site or its content in a way that breaches any law, the rights of any third party, or these Terms;</li>
            <li>attempt to gain unauthorised access to the Site, any associated systems or any account;</li>
            <li>interfere with the operation of the Site or its security; or</li>
            <li>scrape, harvest or systematically extract content from the Site without our prior written consent.</li>
          </ul>

          <h2>Intellectual property</h2>
          <p>
            All content on the Site — including text, photographs, graphics, logos, layout and code — is owned by Azzuro
            or its licensors and is protected by copyright, trade mark and other intellectual property laws. &ldquo;Azzuro
            Resources&rdquo;, the Azzuro logo, and &ldquo;AZ9&rdquo; are used by us to identify our business and may be
            protected as trade marks.
          </p>
          <p>
            Map data is provided under licence from MapTiler AG and OpenStreetMap contributors, and is used subject to
            their respective terms.
          </p>

          <h2>Third-party links</h2>
          <p>
            The Site contains links to third-party websites and resources, including our investor centre, social media
            profiles and external news sources. We have no control over the content of those sites, and we are not
            responsible for their availability, accuracy, content or privacy practices. A link does not imply endorsement.
          </p>

          <h2>Contact details</h2>
          <p>
            Phone numbers and email addresses published on the Site are provided to make it easier to reach Azzuro. By
            choosing to call or email us, you accept that ordinary telecommunications and email are not perfectly secure
            means of communication and that verifying the recipient&apos;s identity is, ultimately, your responsibility.
          </p>

          <h2>Disclaimer and limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, Azzuro and its related bodies corporate, directors, officers,
            employees and contractors:
          </p>
          <ul>
            <li>
              provide the Site and its content &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without warranty of any
              kind, express or implied; and
            </li>
            <li>
              are not liable for any loss or damage (including indirect or consequential loss) arising from or in
              connection with your use of, or inability to use, the Site or anything on it.
            </li>
          </ul>
          <p>
            Nothing in these Terms excludes, restricts or modifies any consumer guarantee, right or remedy that cannot
            lawfully be excluded.
          </p>

          <h2>Governing law</h2>
          <p>
            These Terms are governed by the laws in force in Western Australia, Australia. You submit to the
            non-exclusive jurisdiction of the courts of Western Australia in respect of any dispute concerning the Site or
            these Terms.
          </p>

          <h2>Changes to these Terms</h2>
          <p>
            We may update these Terms from time to time. The &ldquo;Effective&rdquo; date at the top indicates when they
            were last updated. Continued use of the Site after a change becomes effective constitutes acceptance of the
            updated Terms.
          </p>

          <h2>Contact</h2>
          <p>Questions about these Terms can be sent to:</p>
          <p>
            <strong>Azzuro Resources PLC</strong>
            <br />
            Email: <a href="mailto:contact@azzuroresources.com">contact@azzuroresources.com</a>
          </p>
          <p>
            Office addresses and additional contact channels are listed on our{' '}
            <Link href={localizeHref(locale, '/contact')}>Contact page</Link>.
          </p>
        </article>
      </section>
    </main>
  );
}
