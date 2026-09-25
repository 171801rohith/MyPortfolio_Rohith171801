/**
 * All site copy lives here. Edit text, links and lists in this file;
 * components only decide how things look.
 *
 * GitHub numbers (stars, languages, commit activity) come from ./github.json,
 * which `npm run fetch:github` regenerates.
 */

export const site = {
  url: 'https://my-portfolio-rohith171801.vercel.app',
  title: 'Rohith M — Backend & AI Engineer',
  description:
    'Backend and AI engineer building event-driven systems with Spring Boot, FastAPI and Kafka, and the LLM pipelines that run on them.',
};

export const profile = {
  name: 'Rohith M',
  initials: 'RM',
  role: 'Backend & AI Engineer',
  tagline: 'I build event-driven backends and the AI pipelines that run on top of them.',
  status: 'Open to backend & AI engineering roles',
  email: 'rohith171801@gmail.com',
  github: 'https://github.com/171801rohith',
  githubUser: '171801rohith',
  linkedin: 'https://www.linkedin.com/in/rohith-m-3853a6293',
  leetcode: 'https://leetcode.com/u/hydumGoRFC/',
  leetcodeUser: 'hydumGoRFC',
  // Lives in /public, so it's served from the site root.
  resume: 'Rohith_M_Resume.pdf',
};

export const about = {
  paragraphs: [
    "I'm a final-year Computer Science student at Sahyadri College of Engineering and Management, and most of what I build lives behind an API. I care about the parts nobody sees: how a request moves between services, what happens when something fails halfway through, and how an LLM's answer gets grounded and checked before anyone relies on it.",
    'I spent a year as a Software Engineering Intern at Datavex.ai, writing FastAPI services for an AI-powered CRM used by a US-based client, and designing a multi-tenant education SaaS in Spring Boot, where Kafka kept the microservices in sync and a Gemini + OCR pipeline read admission documents.',
    "My own projects follow the same habits. ProcureMind analyses contracts across Spring services that talk over Kafka. Sanctuary is a voice agent on my PC that asks before doing anything it can't undo. Strongbox is a password vault that can't reach the network at all. I'm looking for a team where I can keep building systems like these.",
  ],
  facts: [
    { label: 'CGPA', value: '9.44', note: 'up to 6th semester' },
    { label: 'Industry experience', value: '12 mo', note: 'Datavex.ai internship' },
    { label: 'Main stacks', value: 'Spring · FastAPI', note: 'Java & Python' },
  ],
};

export type SkillIcon = 'code' | 'server' | 'brain' | 'database' | 'cloud' | 'cpu';

export const skills: { category: string; icon: SkillIcon; items: string[] }[] = [
  { category: 'Languages', icon: 'code', items: ['Python', 'Java', 'SQL', 'Kotlin'] },
  {
    category: 'Backend & Frameworks',
    icon: 'server',
    items: ['FastAPI', 'Spring Boot', 'Spring Cloud', 'Flask', 'Streamlit', 'SQLAlchemy', 'Alembic'],
  },
  {
    category: 'AI / ML',
    icon: 'brain',
    items: ['LangChain', 'RAG', 'Gemini API', 'Spring AI', 'Azure OpenAI', 'Ollama', 'OCR (Tesseract)'],
  },
  { category: 'Databases', icon: 'database', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'ChromaDB', 'Firebase'] },
  {
    category: 'Cloud & Tooling',
    icon: 'cloud',
    items: ['Docker', 'Apache Kafka', 'Azure', 'Git & GitHub', 'KNIME'],
  },
  {
    category: 'Core CS',
    icon: 'cpu',
    items: ['Data Structures & Algorithms', 'Object-Oriented Programming', 'DBMS', 'Software Engineering'],
  },
];

export const experience = [
  {
    role: 'Software Engineering Intern',
    company: 'Datavex.ai Pvt Ltd',
    start: 'Sept 2025',
    end: 'Sept 2026',
    kind: 'Internship',
    points: [
      'Worked as a backend developer on an AI-powered CRM platform, building high-performance FastAPI routes with optimised SQLAlchemy schemas and collaborating on the Azure deployment for a US-based client.',
      'Developed an automated email-processing system that reads incoming inquiries, analyses them with AI models and drafts context-aware replies based on the client’s workflows.',
      'Architected a multi-tenant Education SaaS platform in Spring Boot with core CRM and student-profiling microservices, using Apache Kafka for real-time state sync, Google OAuth2/JWT multi-tenancy and a Spring AI (Gemini) + Tesseract OCR pipeline for extracting admissions data.',
    ],
    stack: [
      'FastAPI',
      'SQLAlchemy',
      'Alembic',
      'Spring Boot',
      'Spring Cloud',
      'Spring AI',
      'Apache Kafka',
      'PostgreSQL',
      'Azure',
      'Azure OpenAI',
      'Microsoft Graph API',
      'Docker',
      'Tesseract OCR',
    ],
  },
];

export const education = [
  {
    degree: 'Bachelor of Engineering in Computer Science and Engineering',
    school: 'Sahyadri College of Engineering and Management',
    start: '2023',
    end: '2027',
    detail: 'CGPA 9.44 (up to 6th semester)',
  },
];

/** Leave empty to hide the certifications block. */
export const certifications: { name: string; issuer: string; year: string; url?: string }[] = [];

export type Project = {
  /** Repository name on GitHub; used to pull stars, dates and languages from github.json. */
  repo: string;
  /** Override the repo URL (e.g. to point a fork at its upstream). */
  repoUrl?: string;
  title: string;
  subtitle: string;
  summary: string;
  highlights?: string[];
  tags: string[];
  /** Values matched by the filter chips. */
  filters: string[];
  featured?: boolean;
  badge?: string;
  demo?: string;
};

export const projectFilters = ['All', 'Java', 'Python', 'Kotlin', 'AI / LLM', 'Security'];

export const projects: Project[] = [
  {
    repo: 'ProcureMind',
    title: 'ProcureMind',
    subtitle: 'Event-driven procurement contract analysis',
    summary:
      'Upload a contract and ProcureMind stores it, splits it into a tree of clauses, summarises every section and returns a risk score with findings. The upload returns 202 straight away and the rest runs over Kafka. Retrieval walks the clause hierarchy, PageIndex-style, instead of a vector store.',
    highlights: [
      'contract.uploaded → indexed → analyzed event chain with idempotent consumers',
      'Spring Cloud Gateway and OAuth2 resource servers validating RS256 JWTs from a Spring Authorization Server',
      'Spring AI on a local LLM, Apache Tika extraction, PostgreSQL + Flyway, MinIO object storage',
      'React SPA and a Streamlit dashboard over the same gateway, all in one Docker Compose stack',
    ],
    tags: ['Java', 'Spring Boot', 'Spring Cloud', 'Spring AI', 'Kafka', 'PostgreSQL', 'MinIO', 'Apache Tika', 'Docker'],
    filters: ['Java', 'AI / LLM', 'Security'],
    featured: true,
  },
  {
    repo: 'My-AI-Agent',
    title: 'Sanctuary',
    subtitle: 'Voice-driven AI agent for Windows',
    summary:
      'A text-and-voice agent that runs on my PC. It opens apps, takes notes, renames files and triages Gmail, using Gemini or a local Ollama model with native tool calling. Anything irreversible shows the exact action and waits for a yes.',
    highlights: [
      'Offline wake word and Whisper speech-to-text; replies are spoken sentence by sentence as they stream',
      'Modular tool registry, so a new skill is one function',
      'Persistent memory, an action log and “undo that” for renames, notes and drafts',
      'Email content is treated as untrusted input to the model',
    ],
    tags: ['Python', 'Gemini API', 'Ollama', 'Whisper', 'Speech Recognition', 'Gmail API'],
    filters: ['Python', 'AI / LLM'],
    featured: true,
  },
  {
    repo: 'Pravaah',
    title: 'Pravaah',
    subtitle: 'RAG-powered legal assistant',
    badge: 'Team project',
    summary:
      'Built with a team: a legal AI assistant grounded in 20+ Indian Acts. It explains the law in plain language for citizens and gives IRAC-structured analysis for professionals.',
    highlights: [
      'Retrieval over a ChromaDB index of statutes, so answers stay anchored to the text',
      'OCR for scanned legal documents and images',
      'Answers in Hindi, Kannada, Tamil, Malayalam and Telugu, with spoken output',
    ],
    tags: ['Python', 'FastAPI', 'LangChain', 'Gemini 2.0', 'ChromaDB', 'OCR', 'Docker'],
    filters: ['Python', 'AI / LLM'],
    featured: true,
  },
  {
    repo: 'StrongBox',
    title: 'Strongbox',
    subtitle: 'Offline Android password vault',
    summary:
      'A single-user password vault that structurally cannot leak: no INTERNET permission, system backup disabled, screenshots blocked. Credentials live in one SQLCipher (AES-256) database keyed by PBKDF2 at 600,000 iterations, with optional Keystore-backed biometric unlock.',
    tags: ['Kotlin', 'Android', 'SQLCipher', 'Android Keystore', 'Cryptography'],
    filters: ['Kotlin', 'Security'],
  },
  {
    repo: 'MyBankingWorld_FlaskApp',
    title: 'MyBankingWorld',
    subtitle: 'Online banking app',
    summary:
      'Savings and current accounts, deposits, withdrawals and transfers, with privilege-based daily limits and an admin console. Structured into models, repositories and services, with PINs hashed at rest.',
    tags: ['Python', 'Flask', 'MongoDB'],
    filters: ['Python'],
  },
];

export const githubStats = {
  /**
   * Repos left out of the "top languages" chart because their byte counts are
   * mostly vendored packages (a committed venv), coursework dumps or practice problems.
   */
  languageIgnoreRepos: [
    'SUPER-60',
    'PYTHON',
    'MyPortfolio_Rohith171801',
    'Cloud-Computing-Lab-Work-7th-Sem',
    // Hundreds of LeetCode solutions; shown in the LeetCode card instead.
    'LeetCode-Progs',
  ],
  /** Linguist entries that aren't really "languages I write". */
  languageIgnore: ['PowerShell', 'Batchfile', 'Dockerfile', 'Shell', 'Mako', 'Smalltalk', 'PLpgSQL', 'Cython'],
  topN: 6,
};

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'github', label: 'Activity' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];
