import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import PageWrapper from '@/components/layout/PageWrapper'
import SectionHeading from '@/components/ui/SectionHeading'
import Badge from '@/components/ui/Badge'
import experience from '@/data/experience'
import type { ExperienceEntry } from '@/types'

function TimelineEntry({ entry, index }: { entry: ExperienceEntry; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.1 }}
      className="relative pl-8 pb-12 last:pb-0"
    >
      {/* Timeline line */}
      <div className="absolute left-0 top-1.5 bottom-0 w-px bg-line last:hidden" />
      {/* Timeline dot */}
      <div className="absolute left-[-4px] top-1.5 w-2.5 h-2.5 rounded-full bg-copper border-2 border-ink ring-1 ring-copper" />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
        <div>
          <h3 className="font-display text-lg font-semibold text-text-hi">{entry.company}</h3>
          <p className="text-copper font-medium text-sm">{entry.role}</p>
        </div>
        <span className="font-mono text-xs text-text-dim whitespace-nowrap">{entry.period}</span>
      </div>

      {/* Top-level bullets */}
      {entry.bullets.length > 0 && (
        <ul className="mt-3 space-y-1.5 text-sm text-text">
          {entry.bullets.map((b, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-text-dim flex-shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      )}

      {/* Tech stack */}
      <div className="flex flex-wrap gap-1.5 mt-4">
        {entry.techStack.map((tech) => (
          <Badge key={tech} label={tech} variant="outline" />
        ))}
      </div>

      {/* Client engagements */}
      {entry.engagements && entry.engagements.length > 0 && (
        <div className="mt-6 space-y-5">
          <h4 className="font-mono text-[11px] font-semibold text-text-dim uppercase tracking-[0.2em]">Client Engagements</h4>
          {entry.engagements.map((eng) => (
            <div
              key={eng.client}
              className="border border-line rounded-xl p-4 bg-ink-raised"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 mb-2">
                <h5 className="font-semibold text-text-hi text-sm">{eng.client}</h5>
                <span className="font-mono text-xs text-text-dim">{eng.location}</span>
              </div>
              <p className="text-sm text-text-dim mb-3">{eng.description}</p>
              <ul className="space-y-1.5 text-sm text-text mb-3">
                {eng.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-text-dim flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-1.5">
                {eng.techStack.map((tech) => (
                  <Badge key={tech} label={tech} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default function Experience() {
  return (
    <PageWrapper>
      <section id="experience" className="max-w-5xl mx-auto px-6 py-16 scroll-mt-16">
        <SectionHeading
          index="03"
          title="Experience"
          subtitle="6 years of full-stack development across enterprise, cloud, and AI projects."
        />

        <div className="mt-2">
          {experience.map((entry, i) => (
            <TimelineEntry key={entry.company} entry={entry} index={i} />
          ))}
        </div>
      </section>
    </PageWrapper>
  )
}
