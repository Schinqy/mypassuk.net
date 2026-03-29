import { Shield, Mail, ExternalLink } from "lucide-react";

const LAST_UPDATED = "29 March 2026";
const EFFECTIVE_DATE = "29 March 2026";
const CONTACT_EMAIL = "munyaradzi.nyamasoka@gmail.com";
const SITE_URL = "https://mypassuk.co.uk";

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
  { id: "who-we-are", label: "Who We Are" },
  { id: "data-we-collect", label: "Data We Collect" },
  { id: "how-we-use", label: "How We Use Your Data" },
  { id: "legal-bases", label: "Legal Bases for Processing" },
  { id: "data-sharing", label: "Data Sharing" },
  { id: "cookies", label: "Cookies & Sessions" },
  { id: "retention", label: "Data Retention" },
  { id: "your-rights", label: "Your Rights" },
  { id: "security", label: "Security" },
  { id: "children", label: "Children's Privacy" },
  { id: "changes", label: "Changes to This Policy" },
  { id: "contact", label: "Contact & Complaints" },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Legal</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-3">Privacy Policy</h1>
          <p className="text-slate-500 text-sm">
            Last updated: <strong>{LAST_UPDATED}</strong> · Effective: <strong>{EFFECTIVE_DATE}</strong>
          </p>
          <p className="mt-4 text-slate-600 text-sm leading-relaxed max-w-2xl">
            This policy explains how MyPassUK collects, uses, and protects your personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. Please read it carefully before using our service.
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

            <Section id="who-we-are" title="1. Who We Are">
              <p>
                MyPassUK is an online education guidance platform operated by <strong>[Your Full Legal Name / Company Name]</strong> ("<strong>we</strong>", "<strong>us</strong>", or "<strong>our</strong>"). For the purposes of UK GDPR, we are the data controller of your personal data.
              </p>
              <p>
                <strong>Registered address:</strong> [Your registered address, UK]<br />
                <strong>Contact email:</strong>{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline inline-flex items-center gap-1">
                  {CONTACT_EMAIL} <Mail className="w-3 h-3" />
                </a>
              </p>
              <p className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800 text-xs">
                <strong>ICO Registration:</strong> We are registered with the Information Commissioner's Office (ICO) as required under UK data protection law. Our ICO registration number is: <strong>[ICO Registration Number]</strong>.
              </p>
            </Section>

            <Section id="data-we-collect" title="2. Data We Collect">
              <p>We collect the following categories of personal data:</p>

              <p className="font-semibold text-slate-800 mt-4">Account & Identity Data</p>
              <ul className="space-y-1.5 mt-1">
                <Li>Email address (used as your login identifier)</Li>
                <Li>First and last name (optional, used for personalisation)</Li>
                <Li>Password (stored as a one-way cryptographic hash — we cannot read your password)</Li>
              </ul>

              <p className="font-semibold text-slate-800 mt-4">Subscription & Billing Data</p>
              <ul className="space-y-1.5 mt-1">
                <Li>Subscription plan and status (Free or Premium)</Li>
                <Li>Billing period and renewal date</Li>
                <Li>Payment method details are handled exclusively by Stripe — we never store your card number or CVV</Li>
              </ul>

              <p className="font-semibold text-slate-800 mt-4">Usage & Preference Data</p>
              <ul className="space-y-1.5 mt-1">
                <Li>Nation preference (England, Scotland, Wales, or Northern Ireland)</Li>
                <Li>Subjects you have saved or bookmarked</Li>
                <Li>AI Study Assistant conversation history (stored to provide continuity between sessions)</Li>
                <Li>Study timetable and revision plan data</Li>
                <Li>Promo codes you have redeemed</Li>
              </ul>

              <p className="font-semibold text-slate-800 mt-4">Technical Data</p>
              <ul className="space-y-1.5 mt-1">
                <Li>Session tokens (stored in a secure, httpOnly cookie for authentication)</Li>
                <Li>IP address and browser type (logged briefly for security purposes)</Li>
              </ul>

              <p className="font-semibold text-slate-800 mt-4">Data You Do Not Provide Directly</p>
              <p>We do not use advertising trackers, sell your data, or share it with third parties for marketing. We do not currently use third-party analytics platforms.</p>
            </Section>

            <Section id="how-we-use" title="3. How We Use Your Data">
              <ul className="space-y-2">
                <Li><strong>To provide the service:</strong> authenticating your account, displaying saved subjects, delivering Premium features, and maintaining your study planner.</Li>
                <Li><strong>To process payments:</strong> passing billing details to Stripe to create and manage your subscription.</Li>
                <Li><strong>To personalise your experience:</strong> tailoring content to your selected nation and saved subjects.</Li>
                <Li><strong>To provide AI Study Assistance:</strong> your questions are processed to generate revision guidance. Conversation history is stored to allow contextual responses.</Li>
                <Li><strong>To send service communications:</strong> if you opt in, we may send you emails about your subscription or important service updates. We do not send marketing emails without your explicit consent.</Li>
                <Li><strong>To maintain security:</strong> detecting and preventing unauthorised access and abuse.</Li>
                <Li><strong>To comply with law:</strong> retaining records we are legally required to keep.</Li>
              </ul>
            </Section>

            <Section id="legal-bases" title="4. Legal Bases for Processing (UK GDPR)">
              <p>We rely on the following legal bases:</p>
              <ul className="space-y-2">
                <Li><strong>Contract (Article 6(1)(b)):</strong> Processing necessary to provide the service you have signed up for — account creation, authentication, Premium subscription.</Li>
                <Li><strong>Legitimate interests (Article 6(1)(f)):</strong> Security monitoring, preventing fraud, improving service reliability. We have assessed that these interests are not overridden by your rights.</Li>
                <Li><strong>Consent (Article 6(1)(a)):</strong> For optional communications such as email newsletters — you can withdraw consent at any time.</Li>
                <Li><strong>Legal obligation (Article 6(1)(c)):</strong> Retaining financial records for tax and accounting purposes.</Li>
              </ul>
            </Section>

            <Section id="data-sharing" title="5. Data Sharing">
              <p>We do not sell your personal data. We share data only in the following circumstances:</p>
              <ul className="space-y-2">
                <Li>
                  <strong>Stripe, Inc.:</strong> Our payment processor. When you subscribe, your billing information is shared with Stripe under their{" "}
                  <a href="https://stripe.com/gb/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-0.5">
                    Privacy Policy <ExternalLink className="w-3 h-3" />
                  </a>. Stripe is a certified PCI DSS Level 1 service provider.
                </Li>
                <Li><strong>AI processing:</strong> AI Study Assistant queries may be processed via a third-party AI provider. Queries are not linked to personally identifiable information beyond your session.</Li>
                <Li><strong>Legal requirements:</strong> We may disclose data if required by law, court order, or to protect the rights and safety of our users or the public.</Li>
                <Li><strong>Business transfer:</strong> If MyPassUK is acquired or merges, your data may transfer to the new operator, subject to equivalent protections.</Li>
              </ul>
            </Section>

            <Section id="cookies" title="6. Cookies & Sessions">
              <p>We use a single session cookie (<code className="bg-slate-100 px-1 rounded text-xs">sid</code>) to keep you logged in. This cookie:</p>
              <ul className="space-y-1.5">
                <Li>Is set only when you sign in</Li>
                <Li>Is marked <code className="bg-slate-100 px-1 rounded text-xs">httpOnly</code> and <code className="bg-slate-100 px-1 rounded text-xs">Secure</code> — it cannot be read by JavaScript and is only sent over HTTPS</Li>
                <Li>Expires after 7 days of inactivity</Li>
              </ul>
              <p>We also store preferences (such as your selected nation) in <code className="bg-slate-100 px-1 rounded text-xs">localStorage</code> in your browser. This data never leaves your device.</p>
              <p>We do not use advertising cookies, tracking pixels, or third-party analytics cookies. Because our only cookie is strictly necessary for the service to function, a cookie consent banner is not required under PECR — but you may clear cookies at any time through your browser settings.</p>
            </Section>

            <Section id="retention" title="7. Data Retention">
              <ul className="space-y-2">
                <Li><strong>Account data:</strong> Retained for as long as your account is active. If you request deletion, we will erase your account and associated data within 30 days, except where retention is required by law.</Li>
                <Li><strong>AI conversation history:</strong> Retained for 12 months of inactivity, then automatically deleted.</Li>
                <Li><strong>Billing records:</strong> Retained for 7 years as required by HMRC regulations.</Li>
                <Li><strong>Session tokens:</strong> Expire after 7 days; deleted immediately on logout.</Li>
                <Li><strong>Server logs:</strong> Retained for up to 90 days for security purposes, then deleted.</Li>
              </ul>
            </Section>

            <Section id="your-rights" title="8. Your Rights Under UK GDPR">
              <p>You have the following rights in relation to your personal data:</p>
              <ul className="space-y-2">
                <Li><strong>Right of access:</strong> Request a copy of the personal data we hold about you.</Li>
                <Li><strong>Right to rectification:</strong> Ask us to correct inaccurate or incomplete data.</Li>
                <Li><strong>Right to erasure ("right to be forgotten"):</strong> Ask us to delete your account and personal data, subject to legal retention requirements.</Li>
                <Li><strong>Right to restrict processing:</strong> Ask us to pause processing your data in certain circumstances.</Li>
                <Li><strong>Right to data portability:</strong> Receive your data in a structured, machine-readable format.</Li>
                <Li><strong>Right to object:</strong> Object to processing based on legitimate interests.</Li>
                <Li><strong>Rights related to automated decision-making:</strong> We do not make solely automated decisions with legal or significant effects on you.</Li>
              </ul>
              <p>To exercise any of these rights, email us at <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">{CONTACT_EMAIL}</a>. We will respond within one month.</p>
            </Section>

            <Section id="security" title="9. Security">
              <p>We take reasonable technical and organisational measures to protect your data, including:</p>
              <ul className="space-y-1.5">
                <Li>Passwords stored as bcrypt hashes — never in plain text</Li>
                <Li>All data in transit encrypted via TLS/HTTPS</Li>
                <Li>Session cookies marked httpOnly and Secure</Li>
                <Li>Access to production data restricted to authorised personnel only</Li>
              </ul>
              <p>No system is completely secure. If you believe your account has been compromised, contact us immediately at <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">{CONTACT_EMAIL}</a>.</p>
            </Section>

            <Section id="children" title="10. Children's Privacy">
              <p>MyPassUK is designed to be used by young people from age 14 onwards, including those studying for GCSEs. We do not knowingly collect personal data from children under 13. If you are under 13, please do not create an account without parental consent.</p>
              <p>Parents or guardians who believe their child under 13 has registered may contact us to request account deletion.</p>
            </Section>

            <Section id="changes" title="11. Changes to This Policy">
              <p>We may update this Privacy Policy from time to time. If we make material changes, we will notify registered users by email or by displaying a prominent notice on the site before the change takes effect. The date at the top of this page will always reflect the most recent update.</p>
              <p>Continued use of MyPassUK after changes take effect constitutes acceptance of the updated policy.</p>
            </Section>

            <Section id="contact" title="12. Contact & Complaints">
              <p>If you have any questions, concerns, or requests relating to this Privacy Policy or your personal data, please contact us:</p>
              <p>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">{CONTACT_EMAIL}</a><br />
                <strong>Website:</strong>{" "}
                <a href={SITE_URL} className="text-primary hover:underline">{SITE_URL}</a>
              </p>
              <p>If you are not satisfied with our response, you have the right to lodge a complaint with the UK's data protection authority:</p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="font-semibold text-slate-800">Information Commissioner's Office (ICO)</p>
                <p>Wycliffe House, Water Lane, Wilmslow, Cheshire SK9 5AF</p>
                <p>Helpline: 0303 123 1113</p>
                <a href="https://ico.org.uk/make-a-complaint" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline text-sm mt-1">
                  ico.org.uk/make-a-complaint <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </Section>

          </article>
        </div>
      </div>
    </div>
  );
}
