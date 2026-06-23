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
  enterprise: 'bg-ink-soft text-text border border-line',
  personal:   'bg-copper/10 text-copper border border-copper/30',
  research:   'bg-teal/10 text-teal border border-teal/30',
}

export default function Projects() {
  return (
    <PageWrapper>
      <section id="projects" className="max-w-5xl mx-auto px-6 py-16 scroll-mt-16">
        <SectionHeading
          index="04"
          title="Projects"
          subtitle="A selection of enterprise systems and research work I've built or contributed to."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div
              key={project.title}
              className="flex flex-col border border-line rounded-xl p-5 bg-ink-raised hover:border-copper/40 hover:bg-ink-soft transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-display font-semibold text-text-hi text-base leading-snug">{project.title}</h3>
                <span className={`flex-shrink-0 font-mono text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded ${typeStyle[project.type]}`}>
                  {typeLabel[project.type]}
                </span>
              </div>

              <p className="text-sm text-text leading-relaxed mb-4 flex-1">
                {project.description}
              </p>

              <ul className="space-y-1.5 mb-4">
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex gap-2 text-sm text-text">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-copper flex-shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-line">
                {project.techStack.map((tech) => (
                  <Badge key={tech} label={tech} />
                ))}
              </div>

              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 text-sm text-teal hover:text-teal-dim transition-colors font-medium"
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
