import type { Project } from '@/types'

const projects: Project[] = [
  {
    title: 'Enterprise Fuel Management System',
    description:
      'End-to-end fuel management platform for Tengizchevroil (Chevron Kazakhstan), tracking fuel allocation, consumption, and reporting across large-scale oil field operations.',
    techStack: ['.NET Core', 'ReactJS', 'Azure SQL', 'Azure DevOps', 'EF Core'],
    highlights: [
      'Migrated legacy .NET Framework 4.8 codebase to .NET 7 with zero downtime.',
      'Integrated JD Edwards ERP for real-time inventory sync.',
      'Deployed on Azure App Services with automated CI/CD via Azure DevOps.',
    ],
    type: 'enterprise',
  },
  {
    title: 'People OnBoard (PoB) System',
    description:
      'Personnel tracking and onboarding platform for managing crew changes and site access at Tengizchevroil Kazakhstan Petroleum facility.',
    techStack: ['.NET Core', 'Angular', 'MS SQL Server', 'Azure Cloud', 'Azure AD'],
    highlights: [
      'Modernised UI from MVC Razor Pages to a full SPA using Angular.',
      'Implemented Azure AD group policy-based access control.',
      'Handled MOC process and managed production deployments.',
    ],
    type: 'enterprise',
  },
  {
    title: 'AI-Powered Enterprise Chatbot',
    description:
      'Internal knowledge Q&A chatbot for Kazakhstan Petrochemical Industries, enabling employees to query organisational documents using natural language powered by GPT-4.',
    techStack: ['Python', 'OpenAI GPT-4', 'Haystack', 'Weaviate', '.NET Core', 'ReactJS', 'Docker'],
    highlights: [
      'Integrated GPT-4 with the Haystack framework for RAG-based document Q&A.',
      'Used Weaviate vector database with text-ada-002 embeddings for semantic search.',
      'Delivered significant reduction in information retrieval time for non-technical users.',
    ],
    type: 'enterprise',
  },
  {
    title: 'Multi-Tenant Learning Management System',
    description:
      'Government-grade LMS for schools across Atyrau, Kazakhstan, managing teachers, students, classes, assignments, and iterative course schedules for multiple tenants.',
    techStack: ['.NET 7', 'React.js', 'PostgreSQL', 'Docker', 'Linux', 'Nginx', 'SendGrid', 'JWT', 'OAuth'],
    highlights: [
      'Architected multi-tenancy supporting multiple school districts from a single deployment.',
      'Containerised with Docker and deployed on Linux using Nginx as reverse proxy.',
      'Implemented full auth suite: JWT, RBAC, OAuth social logins, OTP password reset.',
    ],
    type: 'enterprise',
  },
  {
    title: 'AI-Powered Legal Assistant (Freelance)',
    description:
      'Freelance project: an AI-powered legal assistant for UK construction architects, enabling natural language querying of legal documents and construction regulations scraped from UK government websites.',
    techStack: ['.NET Core', 'Python', 'FastAPI', 'ReactJS', 'OpenAI GPT-4', 'Haystack', 'Weaviate', 'BeautifulSoup', 'Selenium', 'Docker', 'Nginx', 'Linux'],
    highlights: [
      'Scraped legal documents from multiple UK government websites using BeautifulSoup and Selenium.',
      'Designed a hybrid .NET Web API + Python FastAPI microservice architecture for scalability.',
      'Built RAG pipeline using GPT-4, text-embedding-ada-002, and Weaviate vector database for intelligent document retrieval.',
      'Containerised all services with Docker, deployed on Linux with Nginx as reverse proxy.',
    ],
    type: 'personal',
  },
  {
    title: 'Centerprise — Data Integration Platform',
    description:
      'Contributed to Astera\'s flagship ETL and data integration product used by enterprises for no-code data pipelines, transformations, and reporting.',
    techStack: ['.NET', 'C#', 'ADO.NET', 'WinForms', 'MS SQL Server', 'Python', 'R'],
    highlights: [
      'Migrated authentication from basic JWT to .NET Identity and implemented granular RBAC with claims-based access control.',
      'Developed pipelines for data science model creation and deployment; curated regression, time-series, and predictive models.',
      'Integrated Northwood Diagrams for visual data flow representation within the product.',
    ],
    type: 'enterprise',
  },
  {
    title: 'Visualization Dashboard Designer',
    description:
      'Cross-platform analytics tool built at Astera for designing and rendering data visualization components, used by in-house teams and external enterprise clients.',
    techStack: ['.NET', 'WinForms', 'TypeScript', 'JavaScript', 'React', 'Infragistics'],
    highlights: [
      'Researched, designed, developed, and launched Astera\'s first dashboard designer for internal and client use.',
      'Built cross-platform UI components spanning desktop WinForms and browser-based TypeScript modules.',
      'Collaborated with the API team for live dashboard deployment and led client-facing request resolution.',
    ],
    type: 'enterprise',
  },
  {
    title: 'TrendLytics — Predictive Analytics for Social Media',
    description:
      'University final year project: a predictive analytics platform for E-Commerce social media marketing campaigns, transforming raw data from Facebook Pixel API and Google Analytics into descriptive and predictive dashboards.',
    techStack: ['Facebook Pixel API', 'Google Analytics API', 'Python', 'R', 'JavaScript'],
    highlights: [
      'Transformed raw Facebook Pixel and Google Analytics data into actionable marketing insights.',
      'Built descriptive and predictive analytics dashboards to drive data-driven business decisions.',
      'Designed to help e-commerce businesses optimise social media marketing campaign performance.',
    ],
    type: 'personal',
  },
  {
    title: 'HistoGeneX — Multimodal Cancer Analysis (MS Thesis)',
    description:
      'MS thesis research proposing a multimodal vision–genomics deep learning framework that fuses whole-slide histopathology images (WSIs) with gene expression data for cancer subtype classification, survival prediction, and treatment response analysis.',
    techStack: ['Python', 'PyTorch', 'Vision Transformer (ViT)', 'TabNet', 'Cross-Modal Attention', 'Genomics', 'TCGA'],
    highlights: [
      'Patch-level visual features extracted from WSIs via ViT/CNN; genomic profiles encoded via MLP/TabNet.',
      'Transformer-based cross-modal attention fusion captures region–gene interactions and morphology–molecular dependencies.',
      'Gating mechanisms regulate modality contribution; attention-based interpretability links genes to spatial tissue regions.',
    ],
    type: 'research',
  },
]

export default projects
