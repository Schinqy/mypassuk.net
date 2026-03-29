import { FileText, Mail, ExternalLink } from "lucide-react";

const LAST_UPDATED = "29 March 2026";
const EFFECTIVE_DATE = "29 March 2026";
const CONTACT_EMAIL = "munyaradzi.nyamasoka@gmail.com";
const GOVERNING_LAW = "England and Wales";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10 scroll-mt-24">
      <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">{title}</h2>
      <div className="space-y-4 text-slate-700 leading-relaxed text-sm">{children}</div>
    </section>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return <li className="flex gap-2"><span className="text-primary mt-1.5 shrink-0">›</span><span>{children}</span></li>;
}

const TOC = [
  { id: "agreement", label: "Agreement to Terms" },
  { id: "the-service", label: "The Service" },
  { id: "accounts", label: "Accounts & Registration" },
  { id: "acceptable-use", label: "Acceptable Use" },
  { id: "premium", label: "Premium Subscriptions" },
  { id: "promo-codes", label: "Promo Codes" },
  { id: "intellectual-property", label: "Intellectual Property" },
  { id: "disclaimer", label: "Disclaimer" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "third-parties", label: "Third-Party Links" },
  { id: "termination", label: "Termination" },
  { id: "governing-law", label: "Governing Law" },
  { id: "changes", label: "Changes to Terms" },
  { id: "contact", label: "Contact Us" },
];

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Legal</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-3">Terms of Service</h1>
          <p className="text-slate-500 text-sm">
            Last updated: <strong>{LAST_UPDATED}</strong> · Effective: <strong>{EFFECTIVE_DATE}</strong>
          </p>
          <p className="mt-4 text-slate-600 text-sm leading-relaxed max-w-2xl">
            Please read these Terms of Service carefully before using MyPassUK. By creating an account or using our service, you agree to be bound by these terms. If you do not agree, please do not use the service.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Sticky TOC */}
          <aside className="lg:w-56 shrink-0">
            <div className="lg:sticky lg:top-8">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Contents</p>
              <nav className="space-y-1">
                {TOC.map(item => (
                  <a key={item.id} href={`#${item.id}`}
                    className="block text-sm text-slate-500 hover:text-primary transition-colors py-0.5 pl-2 border-l-2 border-transparent hover:border-primary">
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <article className="flex-1 min-w-0 bg-white rounded-2xl border border-slate-200 shadow-sm p-8">

            <Section id="agreement" title="1. Agreement to Terms">
              <p>
                These Terms of Service ("Terms") constitute a legally binding agreement between you ("user", "you") and the operator of MyPassUK ("<strong>[Your Full Legal Name / Company Name]</strong>", "we", "us", "our") regarding your use of the MyPassUK website and services (collectively, the "Service").
              </p>
              <p>
                By accessing or using MyPassUK — including browsing content, creating an account, or purchasing a Premium subscription — you agree to these Terms and our{" "}
                <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
              </p>
              <p>
                If you are under 18, you confirm that your parent or guardian has read and agreed to these Terms on your behalf.
              </p>
            </Section>

            <Section id="the-service" title="2. The Service">
              <p>MyPassUK provides:</p>
              <ul className="space-y-1.5">
                <Li>Educational guidance for UK school leavers covering GCSE, A-Level, Scottish SQA, Welsh Baccalaureate, and CCEA qualifications</Li>
                <Li>Career exploration tools with salary data and qualification pathway information</Li>
                <Li>A searchable database of UK universities, colleges, and apprenticeship providers</Li>
                <Li>An AI Study Assistant for exam revision guidance</Li>
                <Li>A personalised study timetable and Pomodoro planner</Li>
                <Li>An open days calendar and tutor directory</Li>
                <Li>A career recommendation quiz</Li>
              </ul>
              <p>
                The Service is informational and educational in nature. It is not a regulated educational institution, does not award qualifications, and does not constitute professional careers, legal, or financial advice.
              </p>
              <p>
                We reserve the right to modify, suspend, or discontinue any feature of the Service at any time with reasonable notice. We will endeavour to notify Premium subscribers in advance of any significant changes.
              </p>
            </Section>

            <Section id="accounts" title="3. Accounts & Registration">
              <p>To access certain features (saved subjects, AI Study Assistant, Premium), you must create an account. You agree to:</p>
              <ul className="space-y-1.5">
                <Li>Provide accurate, truthful information when registering</Li>
                <Li>Keep your email address up to date</Li>
                <Li>Keep your password confidential and not share it with anyone</Li>
                <Li>Notify us immediately at <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">{CONTACT_EMAIL}</a> if you suspect unauthorised use of your account</Li>
              </ul>
              <p>
                You are responsible for all activity that occurs under your account. We reserve the right to suspend or terminate accounts that are inactive for more than 24 months, providing 30 days' prior notice by email.
              </p>
              <p>
                One account per person. Creating multiple accounts to circumvent restrictions or promo code limits is prohibited and may result in immediate account termination.
              </p>
            </Section>

            <Section id="acceptable-use" title="4. Acceptable Use">
              <p>You agree not to use MyPassUK to:</p>
              <ul className="space-y-1.5">
                <Li>Violate any applicable UK or international law or regulation</Li>
                <Li>Scrape, crawl, or systematically extract content from the Service without written permission</Li>
                <Li>Attempt to gain unauthorised access to any part of the Service or its underlying infrastructure</Li>
                <Li>Submit content to the AI Study Assistant that is abusive, threatening, defamatory, or illegal</Li>
                <Li>Impersonate any person or entity, or misrepresent your affiliation with any person or entity</Li>
                <Li>Share your account credentials or Premium access with others</Li>
                <Li>Use the Service for any commercial purpose, including reselling our content, without prior written consent</Li>
                <Li>Interfere with or disrupt the integrity or performance of the Service</Li>
              </ul>
              <p>Violation of these rules may result in immediate suspension or termination of your account without refund.</p>
            </Section>

            <Section id="premium" title="5. Premium Subscriptions">
              <p className="font-semibold text-slate-800">Billing</p>
              <p>
                Premium subscriptions are billed on a recurring basis (monthly or annual, as selected at checkout). All payments are processed securely by{" "}
                <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-0.5">
                  Stripe <ExternalLink className="w-3 h-3" />
                </a>.
                Prices are displayed inclusive of any applicable VAT.
              </p>

              <p className="font-semibold text-slate-800 mt-4">Cancellation</p>
              <p>
                You may cancel your Premium subscription at any time from the Account page. Cancellation takes effect at the end of your current billing period — you retain access to Premium features until then. We do not offer partial-month refunds on cancellation.
              </p>

              <p className="font-semibold text-slate-800 mt-4">Refunds</p>
              <p>
                Under the Consumer Contracts Regulations 2013, you have a 14-day right to cancel a new subscription and receive a full refund, provided you have not made substantial use of the Premium features. To request a refund within the 14-day window, contact us at <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">{CONTACT_EMAIL}</a>.
              </p>
              <p>
                Outside the 14-day window, refunds are at our discretion. We will consider refund requests for technical failures that prevented you from using the Service.
              </p>

              <p className="font-semibold text-slate-800 mt-4">Price Changes</p>
              <p>
                We may change subscription prices with at least 30 days' notice to existing subscribers by email. If you do not cancel before the price change takes effect, you will be charged at the new rate on your next billing date.
              </p>

              <p className="font-semibold text-slate-800 mt-4">Free Plan</p>
              <p>
                The free plan provides access to core content with certain limits. We reserve the right to adjust what is included in the free plan at any time.
              </p>
            </Section>

            <Section id="promo-codes" title="6. Promo Codes">
              <ul className="space-y-1.5">
                <Li>Promo codes grant temporary or permanent Premium access as stated at the time of issuance</Li>
                <Li>Each promo code may only be redeemed once, by one account</Li>
                <Li>Promo codes have no monetary value and cannot be exchanged for cash</Li>
                <Li>We reserve the right to cancel or expire promo codes at any time if we suspect fraud or misuse</Li>
              </ul>
            </Section>

            <Section id="intellectual-property" title="7. Intellectual Property">
              <p>
                All content on MyPassUK — including text, graphics, study guides, career profiles, institution data, the AI Study Assistant, the platform design, and all software — is owned by or licensed to us and is protected by UK copyright and intellectual property law.
              </p>
              <p>You are granted a limited, personal, non-transferable, non-exclusive licence to access and use the Service for your own educational purposes. You may not:</p>
              <ul className="space-y-1.5">
                <Li>Copy, reproduce, or redistribute our content without written permission</Li>
                <Li>Create derivative works based on our content</Li>
                <Li>Use our name, logo, or branding without prior written consent</Li>
              </ul>
              <p>
                Institution data, salary figures, and course information are compiled from publicly available sources and we make reasonable efforts to keep them accurate, but we cannot guarantee their completeness or currency. Always verify critical information directly with institutions.
              </p>
            </Section>

            <Section id="disclaimer" title="8. Disclaimer">
              <p>
                MyPassUK is an <strong>information and guidance platform</strong>. The content we provide — including study tips, career profiles, salary data, qualification pathways, and AI-generated revision advice — is for general educational purposes only. It does not constitute:
              </p>
              <ul className="space-y-1.5">
                <Li>Professional careers advice from a qualified careers adviser</Li>
                <Li>Legal, financial, or tax advice</Li>
                <Li>A guarantee of exam results or university admission</Li>
              </ul>
              <p>
                The Service is provided "as is" and "as available". We make no warranties, express or implied, that the Service will be error-free, uninterrupted, or free of harmful components. We do not warrant the accuracy, completeness, or timeliness of any content.
              </p>
              <p>
                AI Study Assistant responses are generated by an artificial intelligence model and may contain inaccuracies. Always cross-reference AI-generated content with official exam board specifications and revision materials.
              </p>
            </Section>

            <Section id="liability" title="9. Limitation of Liability">
              <p>
                To the fullest extent permitted by law, MyPassUK and its operator shall not be liable for:
              </p>
              <ul className="space-y-1.5">
                <Li>Any indirect, incidental, special, or consequential loss arising from your use of the Service</Li>
                <Li>Any loss of data, profits, or opportunity</Li>
                <Li>Any exam results or academic outcomes</Li>
                <Li>Any decisions made in reliance on information provided through the Service</Li>
              </ul>
              <p>
                Where liability cannot be excluded by law (for example, for death or personal injury caused by our negligence, or for fraudulent misrepresentation), nothing in these Terms limits that liability.
              </p>
              <p>
                Our total aggregate liability to you for any claims arising under these Terms shall not exceed the amount you paid to us in the 12 months preceding the claim, or £100, whichever is greater.
              </p>
            </Section>

            <Section id="third-parties" title="10. Third-Party Links & Services">
              <p>
                MyPassUK may contain links to third-party websites (such as university websites, exam board resources, tutor platforms, and news articles). These links are provided for convenience only. We have no control over and accept no responsibility for the content, privacy practices, or availability of those sites.
              </p>
              <p>
                Tutor listings in our Find a Tutor section link to independent third-party platforms. We do not endorse, vet, or take responsibility for individual tutors or their services. Any engagement with tutors is between you and the tutor directly.
              </p>
            </Section>

            <Section id="termination" title="11. Termination">
              <p>
                You may delete your account at any time by contacting us at <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">{CONTACT_EMAIL}</a>. We will process account deletions within 30 days.
              </p>
              <p>
                We reserve the right to suspend or terminate your access to the Service immediately, without notice, if:
              </p>
              <ul className="space-y-1.5">
                <Li>You breach these Terms</Li>
                <Li>We reasonably suspect fraudulent, illegal, or abusive activity</Li>
                <Li>We are required to do so by law</Li>
              </ul>
              <p>
                On termination, your right to use the Service ceases immediately. We will delete or anonymise your personal data in accordance with our Privacy Policy, subject to legal retention obligations.
              </p>
            </Section>

            <Section id="governing-law" title="12. Governing Law & Disputes">
              <p>
                These Terms are governed by the laws of <strong>{GOVERNING_LAW}</strong>. Any disputes arising from or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of {GOVERNING_LAW}.
              </p>
              <p>
                Before bringing a formal dispute, we encourage you to contact us first at <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">{CONTACT_EMAIL}</a>. We will make reasonable efforts to resolve complaints informally within 14 days.
              </p>
              <p>
                If you are a consumer resident in a different jurisdiction with mandatory consumer protection rights, these Terms do not affect those rights.
              </p>
            </Section>

            <Section id="changes" title="13. Changes to These Terms">
              <p>
                We may update these Terms at any time. If we make material changes, we will notify registered users by email and display a notice on the Service at least 14 days before the changes take effect. The updated date at the top of this page will reflect the most recent revision.
              </p>
              <p>
                Your continued use of MyPassUK after changes take effect constitutes acceptance of the revised Terms. If you do not agree with the new Terms, you should stop using the Service and delete your account.
              </p>
            </Section>

            <Section id="contact" title="14. Contact Us">
              <p>For any questions about these Terms, please contact:</p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <p className="font-bold text-slate-900 mb-1">MyPassUK</p>
                <p><strong>Operator:</strong> [Your Full Legal Name / Company Name]</p>
                <p><strong>Registered address:</strong> [Your registered address, UK]</p>
                <p className="mt-2">
                  <strong>Email:</strong>{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline inline-flex items-center gap-1">
                    {CONTACT_EMAIL} <Mail className="w-3 h-3" />
                  </a>
                </p>
              </div>
              <p className="text-xs text-slate-500 bg-amber-50 border border-amber-200 rounded-xl p-3">
                <strong>Note to operator:</strong> Before publishing, replace all bracketed placeholders (company name, registered address, ICO registration number) with your actual details. Consider having a solicitor review these Terms for your specific situation.
              </p>
            </Section>

          </article>
        </div>
      </div>
    </div>
  );
}
