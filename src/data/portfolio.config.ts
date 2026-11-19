/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PORTFOLIO CONFIG — the one file to edit for your content.
 *
 *  • Photos: drop images into /public/images/ and reference them as
 *    "/images/your-file.jpg". The default portrait is your GitHub avatar.
 *  • Every string here is rendered as-is; keep lines short for best layout.
 *  • In dev mode (`npm run dev`) a "Customize" button lets you preview
 *    name / tagline / bio edits live. Changes are not saved — copy them here.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface Photo {
  src: string;
  alt: string;
}

export interface Quality {
  title: string;
  text: string;
}

export interface SkillGroup {
  title: string;
  items: string[];
}

/** Proficiency meter, 0–100. Levels are placeholders — set your own self-assessment. */
export interface SkillMeter {
  name: string;
  level: number;
}

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  summary: string;
  highlights: string[];
  metrics?: { label: string; value: string }[];
  repoUrl?: string;
  /** Optional cover image in /public/images/. Falls back to a gradient card. */
  image?: string;
}

export interface TimelineItem {
  title: string;
  org: string;
  period: string;
  detail?: string;
}

export interface PortfolioConfig {
  name: string;
  tagline: string;
  bio: string;
  email: string;
  /**
   * Web3Forms access key (free at https://web3forms.com). Access keys are designed to be
   * public in client-side forms, so it is safe to commit. Leave the placeholder to use the
   * mailto: fallback instead.
   */
  emailAccessKey: string;
  photo: Photo;
  links: {
    github: string;
    linkedin: string;
    portfolio: string;
  };
  qualities: Quality[];
  skillGroups: SkillGroup[];
  skillMeters: SkillMeter[];
  projects: CaseStudy[];
  education: TimelineItem[];
  certifications: string[];
  resumeSummary: string;
}

export const portfolio: PortfolioConfig = {
  name: 'Yawar Faiyaz',
  tagline: 'DevOps & Cloud Engineer, automating AWS infrastructure safely',
  bio: 'Aspiring DevOps and Cloud Engineer (B.Tech IT, Class of 2027) building automated, fault-tolerant AWS infrastructure with Terraform, Python (Boto3), GitHub Actions, Docker, and Kubernetes.',
  email: 'asjdbkhbyawar@gmail.com',
  emailAccessKey: 'YOUR_WEB3FORMS_ACCESS_KEY',

  photo: {
    // Default: GitHub avatar. To use a local file instead, set src: '/images/portrait.jpg'
    src: 'https://github.com/Yawarfaiyaz.png',
    alt: 'Portrait of Yawar Faiyaz',
  },

  links: {
    github: 'https://github.com/Yawarfaiyaz',
    linkedin: 'https://www.linkedin.com/in/yawar-faiyaz-4144762b7/',
    portfolio: 'https://yawarfaiyaz.github.io/',
  },

  qualities: [
    { title: 'Automation first', text: 'Repeatable pipelines over manual clicks. If it runs twice, it gets scripted.' },
    { title: 'Safety by default', text: 'Dry-run modes, retention windows, and guardrails before anything is deleted or applied.' },
    { title: 'Cost-aware FinOps', text: 'Infrastructure that cleans up after itself and alerts before the budget does.' },
    { title: 'Observable systems', text: 'Logs, alarms, and notifications wired in from day one, not bolted on later.' },
  ],

  skillGroups: [
    { title: 'Cloud (AWS)', items: ['EC2', 'EBS', 'Lambda', 'IAM', 'S3', 'EventBridge', 'CloudWatch', 'SNS', 'AWS Budgets'] },
    { title: 'Infrastructure as Code', items: ['Terraform (modular architecture)', 'S3 remote state'] },
    { title: 'CI/CD & Version Control', items: ['GitHub Actions', 'Git', 'GitHub'] },
    { title: 'Containers & Orchestration', items: ['Docker', 'Kubernetes', 'Kind'] },
    { title: 'Programming & Scripting', items: ['Python (Boto3)', 'Java', 'Linux Shell'] },
    { title: 'Operating Systems', items: ['Linux'] },
  ],

  // Placeholder levels — replace with your own honest self-assessment.
  skillMeters: [
    { name: 'Terraform', level: 80 },
    { name: 'AWS', level: 80 },
    { name: 'Python (Boto3)', level: 75 },
    { name: 'GitHub Actions', level: 80 },
    { name: 'Docker', level: 70 },
    { name: 'Kubernetes', level: 60 },
  ],

  projects: [
    {
      id: 'ebs-snapshot-cleanup',
      title: 'AWS Cost Optimization: Safe Orphaned EBS Snapshot Cleanup',
      subtitle: 'FinOps pipeline · Terraform · Lambda · GitHub Actions',
      tags: ['Terraform', 'AWS Lambda', 'Python (Boto3)', 'EventBridge', 'CloudWatch', 'SNS', 'AWS Budgets', 'GitHub Actions'],
      summary:
        'An automated FinOps pipeline that finds and purges orphaned EBS snapshots on a daily schedule, eliminating recurring storage waste without risking live data.',
      highlights: [
        'Modular Terraform (iam, lambda, eventbridge, cloudwatch, sns) backed by an isolated S3 remote-state bootstrap stack.',
        'Five-layer safety engine with dry_run on by default: verifies the source volume is deleted, enforces a 30-day retention window, skips AMI-backed and copied (vol-ffffffff) snapshots, and honours DoNotDelete=true tags.',
        'GitHub Actions CI/CD (fmt → init → validate → plan → apply) using a scoped, least-privilege IAM user to work within an AWS SCP that blocks OIDC federation.',
        'Observability and cost guardrails: CloudWatch Logs (14-day retention), error and throttle alarms, SNS email reports, and an AWS Budget alert at 80% of a $5 monthly threshold.',
      ],
      metrics: [
        { label: 'Schedule', value: 'Daily' },
        { label: 'Safety layers', value: '5' },
        { label: 'Retention window', value: '30 days' },
        { label: 'Budget alert', value: '80% of $5' },
      ],
      repoUrl: 'https://github.com/Yawarfaiyaz/aws-ebs-snapshot-cost-optimizer',
    },
    {
      id: 'kind-kubernetes',
      title: 'Kubernetes Cluster Setup & Application Deployment with Kind',
      subtitle: 'Container orchestration · Kubernetes · Docker',
      tags: ['Kubernetes', 'Kind', 'Docker', 'Linux'],
      summary:
        'A local multi-node Kubernetes cluster built with Kind (Kubernetes in Docker) to practise real orchestration workflows end to end.',
      highlights: [
        'Configured a multi-node local cluster to simulate production-style orchestration.',
        'Deployed, exposed, and managed containerised workloads.',
        'Practised pod lifecycle management, service networking, and cluster troubleshooting.',
      ],
    },
    {
      id: 'github-actions-cicd',
      title: 'CI/CD Pipeline Automation with GitHub Actions',
      subtitle: 'Build · validate · deploy · YAML',
      tags: ['GitHub Actions', 'Git', 'YAML'],
      summary:
        'Push-triggered GitHub Actions workflows that automate build, validation, and deployment steps for every change.',
      highlights: [
        'Designed workflows triggered on repository pushes.',
        'Automated build, validation, and deployment stages.',
      ],
    },
  ],

  education: [
    {
      title: 'B.Tech in Information Technology',
      org: 'Muzaffarpur Institute of Technology, Muzaffarpur, Bihar',
      period: 'Expected 2027',
      detail: 'CGPA: 7.3',
    },
  ],

  certifications: ['Machine Learning in Python — National Institute of Electronics & Information Technology (NIELIT)'],

  resumeSummary:
    'Aspiring DevOps and Cloud Engineer (B.Tech IT, Class of 2027) with hands-on experience building automated AWS infrastructure using Terraform, Python (Boto3), and GitHub Actions. Skilled in designing fault-tolerant cloud automation with strict safety guardrails, observability via CloudWatch and SNS, and containerised deployments using Docker and Kubernetes.',
};
