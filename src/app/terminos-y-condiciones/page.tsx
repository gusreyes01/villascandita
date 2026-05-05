"use client";

import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function TermsPage() {
  const { t, toggleLang } = useLanguage();
  const p = t.termsPage;

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-stone-900 text-white">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            {p.backHome}
          </Link>
          <button
            onClick={toggleLang}
            className="text-xs font-medium px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
          >
            {t.langToggle}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-2">
          {p.title}
        </h1>
        <p className="text-sm text-stone-400 mb-10">{p.lastUpdated}</p>

        <div className="prose prose-stone max-w-none space-y-8">
          <p className="text-stone-600 leading-relaxed">{p.intro}</p>

          <Section title={p.reservationsTitle}>
            <p>{p.reservationsText}</p>
            <ul>
              {p.reservationsItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title={p.paymentsTitle}>
            <p>{p.paymentsText}</p>
            <ul>
              {p.paymentsItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title={p.cancellationTitle}>
            <p>{p.cancellationText}</p>
            <ul>
              {p.cancellationItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title={p.houseRulesTitle}>
            <p>{p.houseRulesText}</p>
            <ul>
              {p.houseRulesItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title={p.liabilityTitle}>
            <p>{p.liabilityText}</p>
            <ul>
              {p.liabilityItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <p className="text-sm text-stone-500 mt-2 italic">
              {p.liabilityNote}
            </p>
          </Section>

          <Section title={p.intellectualPropertyTitle}>
            <p>{p.intellectualPropertyText}</p>
          </Section>

          <Section title={p.modificationsTitle}>
            <p>{p.modificationsText}</p>
          </Section>

          <Section title={p.governingLawTitle}>
            <p>{p.governingLawText}</p>
          </Section>

          <div className="border-t border-stone-200 pt-8 mt-12">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              {p.contactTitle}
            </h2>
            <p className="text-stone-600 mb-4">{p.contactText}</p>
            <div className="flex flex-col gap-3 text-sm text-stone-600">
              <a
                href={`mailto:${p.contactEmail}`}
                className="flex items-center gap-2 hover:text-stone-900 transition-colors"
              >
                <Mail size={15} />
                {p.contactEmail}
              </a>
              <a
                href={`tel:${p.contactPhone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 hover:text-stone-900 transition-colors"
              >
                <Phone size={15} />
                {p.contactPhone}
              </a>
              <span className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0" />
                <span>
                  {p.contactAddress}
                  <br />
                  {p.contactLocation}
                </span>
              </span>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-stone-900 text-white/40 text-xs text-center py-6">
        <p>
          &copy; {new Date().getFullYear()} Villas Candita. {t.footer.rights}
        </p>
      </footer>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-stone-900 mb-3">{title}</h2>
      <div className="text-stone-600 leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  );
}
