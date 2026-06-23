import PageWrapper from '@/components/layout/PageWrapper'
import SectionHeading from '@/components/ui/SectionHeading'
import ExternalLink from '@/components/ui/ExternalLink'
import personal from '@/data/personal'

const education = [
  {
    degree: 'Master of Science in Computer Science',
    school: 'FAST — National University of Computer and Emerging Sciences',
    location: 'Karachi, Pakistan',
    period: 'Aug 2024 – Jun 2026',
    note: 'Thesis: HistoGeneX — multimodal fusion of histopathology images and gene expression for cancer analysis.',
  },
  {
    degree: 'Bachelor of Science in Computer Science',
    school: 'FAST — National University of Computer and Emerging Sciences',
    location: 'Karachi, Pakistan',
    period: 'Aug 2016 – Jun 2020',
    note: null,
  },
]

const interests = [
  'Multimodal deep learning (vision + genomics)',
  'Computational pathology and cancer AI',
  'Transformer-based fusion architectures',
  'Enterprise cloud architecture on Azure',
  'Developer tooling and platform engineering',
]

export default function About() {
  return (
    <PageWrapper>
      <section id="about" className="max-w-5xl mx-auto px-6 py-16 scroll-mt-16">
        <SectionHeading title="About" />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Bio */}
          <div className="lg:col-span-3 space-y-8">
            <div>
              <div className="flex items-center gap-4 mb-5">
                <img
                  src="/profile.png"
                  alt="Khizer Mehmood"
                  className="w-16 h-16 rounded-full object-cover object-top flex-shrink-0 ring-4 ring-blue-600/20"
                />
                <div>
                  <h2 className="text-xl font-bold text-slate-100">{personal.name}</h2>
                  <p className="text-blue-400 font-medium text-sm">{personal.title}</p>
                </div>
              </div>

              <div className="space-y-4 text-slate-400 leading-relaxed">
                <p>
                  I'm a Senior Full-Stack Developer with 6 years of experience delivering
                  enterprise-grade software for clients across the energy, petrochemical, and
                  government sectors. My core stack is .NET Core, React, and Azure — I've
                  architected and shipped production systems at scale, from multi-tenant learning
                  platforms to real-time crew management systems for Chevron Kazakhstan.
                </p>
                <p>
                  More recently, I've been working at the intersection of enterprise software
                  and AI — integrating GPT-4 with vector databases and RAG pipelines to build
                  intelligent knowledge systems for large organisations.
                </p>
                <p>
                  Alongside my professional work, I'm currently pursuing a Master's in Computer
                  Science at FAST NUCES. My thesis, <em>HistoGeneX</em>, proposes a multimodal
                  deep learning framework that fuses whole-slide histopathology images (WSIs)
                  with gene expression data to improve cancer subtype classification and survival
                  prediction.
                </p>
              </div>

              {/* Links */}
              <div className="flex gap-4 mt-6">
                <ExternalLink
                  href={personal.github}
                  className="text-sm text-slate-500 hover:text-slate-200 transition-colors underline underline-offset-2"
                >
                  GitHub
                </ExternalLink>
                <ExternalLink
                  href={personal.linkedin}
                  className="text-sm text-slate-500 hover:text-slate-200 transition-colors underline underline-offset-2"
                >
                  LinkedIn
                </ExternalLink>
                <a
                  href={`mailto:${personal.email}`}
                  className="text-sm text-slate-500 hover:text-slate-200 transition-colors underline underline-offset-2"
                >
                  {personal.email}
                </a>
              </div>
            </div>

            {/* MS Thesis */}
            <div className="border border-blue-800 bg-blue-950/40 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">MS Thesis Research</h3>
              <p className="text-slate-200 font-semibold mb-1">HistoGeneX — Multimodal Vision–Genomics Fusion for Cancer Analysis</p>
              <p className="text-sm text-slate-400 leading-relaxed mb-3">
                A deep learning framework that fuses whole-slide histopathology images (WSIs) with
                gene expression data for cancer subtype classification, survival prediction, and
                treatment response analysis.
              </p>
              <ul className="space-y-1.5 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-500 flex-shrink-0" />
                  Visual encoder (ViT / CNN) extracts patch-level features from WSIs; tabular encoder (MLP / TabNet) processes genomic profiles.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-500 flex-shrink-0" />
                  Transformer-based cross-modal attention fusion captures region–gene interactions and high-order morphology–molecular relationships.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-500 flex-shrink-0" />
                  Attention-based interpretability links specific genes to spatial tissue patterns. Evaluated on TCGA.
                </li>
              </ul>
            </div>
          </div>

          {/* Education + Interests */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Education</h3>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.degree} className="border border-slate-800 rounded-xl p-4 bg-slate-900">
                    <p className="font-semibold text-slate-100 text-sm leading-snug">{edu.degree}</p>
                    <p className="text-slate-400 text-xs mt-1">{edu.school}</p>
                    <p className="text-slate-500 text-xs">{edu.location}</p>
                    <p className="text-blue-400 text-xs font-medium mt-1">{edu.period}</p>
                    {edu.note && (
                      <p className="text-slate-400 text-xs mt-2 leading-relaxed">{edu.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Interests</h3>
              <ul className="space-y-2">
                {interests.map((interest) => (
                  <li key={interest} className="flex gap-2 text-sm text-slate-400">
                    <span className="mt-2 w-1 h-1 rounded-full bg-blue-500 flex-shrink-0" />
                    {interest}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
