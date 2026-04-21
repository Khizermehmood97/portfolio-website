import type { SkillGroup } from '@/types'

const skillGroups: SkillGroup[] = [
  {
    category: 'Languages',
    skills: ['C#', 'Python', 'TypeScript', 'JavaScript', 'R', 'Java', 'C/C++'],
  },
  {
    category: 'Backend',
    skills: ['.NET Core', '.NET Framework', 'ASP.NET Web API', 'ASP.NET MVC', 'Entity Framework Core', '.NET Identity', 'FastAPI', 'ADO.NET'],
  },
  {
    category: 'Frontend',
    skills: ['React', 'Angular', 'TypeScript', 'JavaScript', 'WinForms', 'HTML5', 'CSS3', 'Tailwind CSS'],
  },
  {
    category: 'Databases',
    skills: ['MS SQL Server', 'PostgreSQL', 'MySQL', 'Oracle 11g', 'Azure SQL', 'Firebase', 'Weaviate (Vector DB)'],
  },
  {
    category: 'Cloud & DevOps',
    skills: ['Azure App Services', 'Azure Key Vault', 'Application Insights', 'Azure AD', 'Azure DevOps', 'Docker', 'Kubernetes', 'CI/CD Pipelines', 'Nginx', 'Linux'],
  },
  {
    category: 'AI / ML',
    skills: ['OpenAI GPT-4 API', 'Haystack Framework', 'Weaviate', 'RAG Pipelines', 'BeautifulSoup', 'Selenium', 'Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP'],
  },
  {
    category: 'Tools & Practices',
    skills: ['Git', 'GitHub', 'Postman', 'Azure DevOps', 'DAST/SAST Security Scans', 'JWT / OAuth', 'SendGrid', 'Northwood Diagrams', 'Infragistics', 'JIRA'],
  },
]

export default skillGroups
