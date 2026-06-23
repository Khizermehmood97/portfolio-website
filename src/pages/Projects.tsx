import PageWrapper from '@/components/layout/PageWrapper'
import SectionHeading from '@/components/ui/SectionHeading'
import Badge from '@/components/ui/Badge'
import projects from '@/data/projects'

const typeLabel: Record<string, string> = {
  enterprise: 'Enterprise',
  personal: 'Personal',
  research: 'Research',
}

const typeStyle: Record<string, string> = {
  enterprise: 'bg-slate-800 text-slate-300 border border-slate-700',
  personal:   'bg-emerald-900/40 text-emerald-400 border border-emerald-800',
  research:   'bg-purple-900/40 text-purple-400 border border-purple-800',
}

export default function Projects() {
  return (
    <PageWrapper>
      <section id="projects" className="max-w-5xl mx-auto px-6 py-16 scroll-mt-16">
        <SectionHeading
          title="Projects"
          subtitle="A selection of enterprise systems and research work I've built or contributed to."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div
              key={project.title}
              className="flex flex-col border border-slate-800 rounded-xl p-5 bg-slate-900 hover:border-slate-700 hover:bg-slate-800/50 transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-semibold text-slate-100 text-base leading-snug">{project.title}</h3>
                <span className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded ${typeStyle[project.type]}`}>
                  {typeLabel[project.type]}
                </span>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed mb-4 flex-1">
                {project.description}
              </p>

              <ul className="space-y-1.5 mb-4">
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-400">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-500 flex-shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-slate-800">
                {project.techStack.map((tech) => (
                  <Badge key={tech} label={tech} />
                ))}
              </div>

              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  View →
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </PageWrapper>
  )
}
