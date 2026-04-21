import type { ExperienceEntry } from '@/types'

const experience: ExperienceEntry[] = [
  {
    company: 'Valus - Information Technology',
    role: 'Senior Product Developer (Full Stack)',
    period: 'Jul 2023 – Present',
    type: 'full-time',
    bullets: [
      'Lead full-stack development of internal products using .NET Core, React, and Azure.',
      'Architect and implement RESTful APIs, manage Azure cloud infrastructure, and drive CI/CD pipelines.',
      'Collaborate with cross-functional teams to deliver scalable, maintainable solutions.',
    ],
    techStack: ['.NET Core', 'React', 'Azure', 'MS SQL Server', 'Azure DevOps'],
  },
  {
    company: 'Veraqor, Inc.',
    role: 'Senior Software Consultant',
    period: 'Jul 2023 – Jul 2025',
    type: 'consultant',
    bullets: [
      'Delivered multiple concurrent enterprise engagements across energy, petrochemical, and government sectors.',
      'Managed Azure resources, handled CI/CD pipelines, and conducted DAST/SAST security scans.',
      'Upgraded NuGet/NPM dependencies and maintained secure, performant codebases across all projects.',
    ],
    techStack: ['.NET Core', 'React', 'Angular', 'Azure', 'Docker', 'MS SQL Server'],
    engagements: [
      {
        client: 'Tengizchevroil (Chevron Kazakhstan)',
        location: 'Karachi, Pakistan',
        description:
          'Contributed to 5+ enterprise applications: Fuel Management, People OnBoard (PoB), Case Registry, Crew Change, JD Edwards Integration, and Contract Owner Portal.',
        bullets: [
          'Developed new features, resolved support issues, and performed code/database optimizations using .NET Framework, .NET Core, ReactJS, Angular, and MS SQL Server.',
          'Migrated legacy systems from .NET Framework 4.8 to .NET 7/8 and modernized UI from MVC Razor Pages to SPAs using React/Angular.',
          'Managed Azure resources (App Services, Key Vaults, Application Insights, Azure SQL) and handled CI/CD deployments across multiple environments via Azure DevOps.',
          'Conducted DAST/SAST scans, remediated vulnerabilities, participated in security audits, and managed access through Azure AD group policies. Conducted MOC process and release management for production deployments.',
          'Integrated with various third-party services and maintained secure, performant codebases by upgrading NuGet/NPM dependencies.',
        ],
        techStack: ['.NET Core', 'ASP.NET MVC', 'ReactJS', 'Angular', 'EF Core', 'MS SQL Server', 'Docker', 'Azure Cloud', 'Azure DevOps', 'Git'],
      },
      {
        client: 'Kazakhstan Petrochemical Industries',
        location: 'Karachi, Pakistan',
        description:
          'Built an AI-powered internal chatbot enabling natural language querying of organizational data using GPT-4 and a vector database.',
        bullets: [
          'Developed a custom chatbot solution for internal use, integrating OpenAI GPT-4 with the Haystack framework for enterprise Q&A over internal documents.',
          'Utilized Weaviate vector database with text-ada-002 embeddings for high-performance semantic search and improved query understanding.',
          'Implemented .NET Identity authentication and RBAC authorization for secure access control.',
          'Delivered a robust AI-powered interface that significantly enhanced internal information accessibility and user experience.',
        ],
        techStack: ['.NET Core', '.NET Identity', 'EF Core', 'MS SQL Server', 'Python', 'ReactJS', 'OpenAI API', 'Haystack', 'Weaviate', 'Docker', 'Linux'],
      },
      {
        client: 'Ministry of Education (Kazakhstan)',
        location: 'Karachi, Pakistan',
        description:
          'Built a scalable multi-tenant Learning Management System (LMS) for government schools across Atyrau, Kazakhstan.',
        bullets: [
          'Built a scalable multi-tenant LMS managing users (students, teachers, admins), classes, lectures, assignments, and iterative recursive schedules across multiple school districts.',
          'Developed frontend in React.js and backend using .NET 7, EF Core, Web API, and PostgreSQL; containerized with Docker and deployed on Linux servers using Nginx as a reverse proxy.',
          'Implemented JWT-based authentication, RBAC, OAuth social logins, email verification, and OTP-based password reset.',
          'Integrated SendGrid for transactional email delivery and notifications.',
        ],
        techStack: ['.NET 7', 'EF Core', 'React.js', 'PostgreSQL', 'Docker', 'Linux', 'JWT', 'OAuth', 'SendGrid', 'Nginx'],
      },
    ],
  },
  {
    company: 'Astera Software',
    role: 'Software Engineer I/II',
    period: 'Jun 2020 – Jun 2023',
    type: 'full-time',
    bullets: [
      // Software Engineer I/II (Jul 2021 – Jun 2023)
      'As a senior developer on Astera Data Analytics — a visually powerful data science platform — involved in designing core architecture, data visualization features, and cross-platform UI modernization from WinForms to ReactJS/TypeScript.',
      'Researched, designed, developed, and launched Astera\'s first Visualization Dashboard Designer, used by in-house teams and external enterprise clients; collaborated with the API team for live dashboard deployment.',
      'Migrated authentication in Centerprise from basic JWT to .NET Identity; implemented RBAC using Identity claims to enforce granular access policies and extended the database schema to support user, role, and claims structures.',
      'Led and mentored junior developers, conducted code reviews for the Data Science team, and drove software design decisions.',
      // Associate Software Engineer (Jul 2020 – Jul 2021)
      'As an Associate Software Engineer, developed pipelines for creating and deploying data science models in Centerprise (Astera\'s flagship ETL product); curated regression, time-series, and predictive models with R and Python scripts.',
      'Involved in migration project from .NET Framework 4.8 to .NET 6.',
    ],
    techStack: ['.NET Framework', '.NET Core', 'C#', 'MS SQL Server', 'WinForms', 'Northwood Diagrams', 'Infragistics', 'React', 'TypeScript', 'Python', 'R', 'Git', 'ADO.NET'],
  },
]

export default experience
