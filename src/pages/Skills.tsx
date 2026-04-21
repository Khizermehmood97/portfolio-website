import { type ComponentType } from 'react'
import {
  SiSharp, SiPython, SiJavascript, SiTypescript, SiCplusplus,
  SiDotnet, SiFastapi, SiReact, SiAngular, SiHtml5, SiTailwindcss,
  SiPostgresql, SiMysql, SiFirebase,
  SiDocker, SiKubernetes, SiNginx, SiLinux,
  SiGit, SiGithub, SiOpenai, SiSelenium, SiJira, SiPostman,
} from 'react-icons/si'
import { FaJava, FaRProject } from 'react-icons/fa'
import PageWrapper from '@/components/layout/PageWrapper'
import SectionHeading from '@/components/ui/SectionHeading'
import skillGroups from '@/data/skills'

type IconComponent = ComponentType<{ size?: number; className?: string }>

const iconMap: Record<string, IconComponent> = {
  'C#': SiSharp,
  'Python': SiPython,
  'JavaScript': SiJavascript,
  'TypeScript': SiTypescript,
  'Java': FaJava,
  'R': FaRProject,
  'C/C++': SiCplusplus,
  '.NET Core': SiDotnet,
  '.NET Framework': SiDotnet,
  'ASP.NET Web API': SiDotnet,
  'ASP.NET MVC': SiDotnet,
  'Entity Framework Core': SiDotnet,
  '.NET Identity': SiDotnet,
  'ADO.NET': SiDotnet,
  'FastAPI': SiFastapi,
  'React': SiReact,
  'Angular': SiAngular,
  'HTML5': SiHtml5,
  'Tailwind CSS': SiTailwindcss,
  'PostgreSQL': SiPostgresql,
  'MySQL': SiMysql,
  'Firebase': SiFirebase,
  'Docker': SiDocker,
  'Kubernetes': SiKubernetes,
  'Nginx': SiNginx,
  'Linux': SiLinux,
  'Git': SiGit,
  'GitHub': SiGithub,
  'OpenAI GPT-4 API': SiOpenai,
  'Selenium': SiSelenium,
  'JIRA': SiJira,
  'Postman': SiPostman,
}

// Subtle accent colours per category
const categoryAccent: Record<string, string> = {
  'Languages':       'border-violet-800/60 hover:border-violet-600',
  'Backend':         'border-blue-800/60 hover:border-blue-600',
  'Frontend':        'border-cyan-800/60 hover:border-cyan-600',
  'Databases':       'border-emerald-800/60 hover:border-emerald-600',
  'Cloud & DevOps':  'border-sky-800/60 hover:border-sky-600',
  'AI / ML':         'border-purple-800/60 hover:border-purple-600',
  'Tools & Practices': 'border-slate-700 hover:border-slate-500',
}

const categoryDot: Record<string, string> = {
  'Languages':       'bg-violet-500',
  'Backend':         'bg-blue-500',
  'Frontend':        'bg-cyan-400',
  'Databases':       'bg-emerald-500',
  'Cloud & DevOps':  'bg-sky-400',
  'AI / ML':         'bg-purple-500',
  'Tools & Practices': 'bg-slate-400',
}

export default function Skills() {
  return (
    <PageWrapper>
      <section className="max-w-5xl mx-auto px-6 py-16">
        <SectionHeading
          title="Skills"
          subtitle="Technologies and tools I work with across backend, frontend, cloud, and AI."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillGroups.map((group) => {
            const borderClass = categoryAccent[group.category] ?? 'border-slate-700 hover:border-slate-500'
            const dotClass = categoryDot[group.category] ?? 'bg-slate-400'
            return (
              <div
                key={group.category}
                className={`border rounded-xl p-5 bg-slate-900 transition-colors ${borderClass}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotClass}`} />
                  <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
                    {group.category}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => {
                    const Icon = iconMap[skill]
                    return (
                      <span
                        key={skill}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 hover:border-slate-500 hover:text-slate-100 transition-colors"
                      >
                        {Icon && <Icon size={13} className="flex-shrink-0 opacity-80" />}
                        {skill}
                      </span>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </PageWrapper>
  )
}
