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
      <div className="absolute left-0 top-1.5 bottom-0 w-px bg-slate-800 last:hidden" />
      {/* Timeline dot */}
      <div className="absolute left-[-4px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-slate-950 ring-1 ring-blue-500" />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{entry.company}</h3>
          <p className="text-blue-400 font-medium text-sm">{entry.role}</p>
        </div>
        <span className="text-sm text-slate-500 whitespace-nowrap">{entry.period}</span>
      </div>

      {/* Top-level bullets */}
      {entry.bullets.length > 0 && (
        <ul className="mt-3 space-y-1.5 text-sm text-slate-400">
          {entry.bullets.map((b, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-600 flex-shrink-0" />
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
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Client Engagements</h4>
          {entry.engagements.map((eng) => (
            <div
              key={eng.client}
              className="border border-slate-800 rounded-xl p-4 bg-slate-900"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 mb-2">
                <h5 className="font-semibold text-slate-200 text-sm">{eng.client}</h5>
                <span className="text-xs text-slate-500">{eng.location}</span>
              </div>
              <p className="text-sm text-slate-500 mb-3">{eng.description}</p>
              <ul className="space-y-1.5 text-sm text-slate-400 mb-3">
                {eng.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-700 flex-shrink-0" />
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
