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

// AI/ML is the one category that gets the teal research accent; every
// other category shares the copper signal — disciplined, not a rainbow.
const isResearch = (category: string) => category === 'AI / ML'

export default function Skills() {
  return (
    <PageWrapper>
      <section id="skills" className="max-w-5xl mx-auto px-6 py-16 scroll-mt-16">
        <SectionHeading
          index="02"
          title="Skills"
          subtitle="Technologies and tools I work with across backend, frontend, cloud, and AI."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillGroups.map((group) => {
            const research = isResearch(group.category)
            const dotClass = research ? 'bg-teal' : 'bg-copper'
            const hoverBorder = research ? 'hover:border-teal/50' : 'hover:border-copper/50'
            return (
              <div
                key={group.category}
                className={`border border-line rounded-xl p-5 bg-ink-raised transition-colors ${hoverBorder}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotClass}`} />
                  <h3 className="font-mono text-[11px] font-semibold text-text-hi uppercase tracking-[0.18em]">
                    {group.category}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => {
                    const Icon = iconMap[skill]
                    return (
                      <span
                        key={skill}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-ink-soft text-text text-xs font-medium rounded-md border border-line hover:border-text-dim hover:text-text-hi transition-colors"
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
