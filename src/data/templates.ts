export interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect';
  placeholder?: string;
  defaultValue?: string;
  options?: string[];
  helpText?: string;
  required?: boolean;
}

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  tags: string[];
  fields: TemplateField[];
  template: string; // Markdown structure with {{placeholder}} values
}

// Common fields to avoid boilerplate in templates
export const COMMON_FIELDS: Record<string, TemplateField> = {
  objective: {
    id: 'objective',
    label: 'Objective',
    type: 'textarea',
    placeholder: 'Define the main goal of this activity...',
    required: true,
    helpText: 'What are you trying to accomplish?'
  },
  scope: {
    id: 'scope',
    label: 'Scope',
    type: 'textarea',
    placeholder: 'URLs, IP ranges, codebase paths, API endpoints...',
    required: true,
    helpText: 'What is inside the boundaries of this assessment?'
  },
  constraints: {
    id: 'constraints',
    label: 'Constraints & Rules of Engagement',
    type: 'textarea',
    placeholder: 'No destructive testing, rate limit: 5 req/sec, white-box only...',
    defaultValue: 'Do not perform disruptive or destructive tests. Operate strictly within local constraints.',
    helpText: 'Limits on testing, safety controls, or scope boundaries.'
  },
  targetTechnology: {
    id: 'targetTechnology',
    label: 'Target Technology & Architecture',
    type: 'text',
    placeholder: 'Node.js, PostgreSQL, AWS S3, Kubernetes v1.29...',
    required: true,
    helpText: 'The tech stack, frameworks, platforms, or systems involved.'
  },
  outputFormat: {
    id: 'outputFormat',
    label: 'Output Format',
    type: 'select',
    defaultValue: 'Markdown Report (Technical)',
    options: [
      'Markdown Report (Technical)',
      'Executive Summary',
      'JSON Data Structure',
      'Sigma / Yara Rules Output',
      'Step-by-Step POC Script',
      'Jira Bug Report Ticket'
    ],
    helpText: 'How the final output should be structured.'
  },
  expectedDepth: {
    id: 'expectedDepth',
    label: 'Expected Analysis Depth',
    type: 'select',
    defaultValue: 'Technical Deep-Dive',
    options: ['Quick Overview', 'Standard Review', 'Technical Deep-Dive', 'Proof-of-Concept & Exploit Dev'],
    helpText: 'Level of details and code examples needed.'
  },
  requiredTools: {
    id: 'requiredTools',
    label: 'Required / Permitted Tools',
    type: 'text',
    placeholder: 'Burp Suite, Nmap, Ghidra, Semgrep, Wireshark...',
    helpText: 'Tools to base the commands and workflows on.'
  }
};

export const CATEGORIES = [
  { id: 'pentest', name: 'Pentesting & AppSec', description: 'Web, API, Mobile, Cloud, Kubernetes & AD Pentesting' },
  { id: 'defense', name: 'Detection & DFIR', description: 'Sigma/YARA, Malware Analysis, Threat Hunting, Log Audit' },
  { id: 'engineering', name: 'Secure Engineering', description: 'Secure Code Review, Code Gen, Threat Modeling' },
  { id: 'strategy', name: 'Strategy & Ops', description: 'Report Writing, Incident Response, Red/Purple Team' },
  { id: 'ai-sec', name: 'AI & LLM Security', description: 'Prompt Injection, RAG Security, Agent Security Reviews' }
];

export const TEMPLATES: PromptTemplate[] = [
  // 1. WEB PENTESTING
  {
    id: 'web-ssrf',
    title: 'SSRF Vulnerability Audit',
    description: 'Create a tailored penetration testing plan focused on Server-Side Request Forgery (SSRF) in cloud environments.',
    category: 'pentest',
    subcategory: 'Web Application Pentesting',
    difficulty: 'Advanced',
    tags: ['SSRF', 'Web AppSec', 'Cloud Metadata', 'Bypass'],
    fields: [
      COMMON_FIELDS.objective,
      COMMON_FIELDS.scope,
      {
        id: 'cloudProvider',
        label: 'Cloud Provider Environment',
        type: 'select',
        defaultValue: 'AWS (IMDSv1 & IMDSv2)',
        options: ['AWS (IMDSv1 & IMDSv2)', 'GCP Metadata', 'Azure Instance Metadata', 'Private/Internal Network Only'],
        helpText: 'Select cloud platform to generate targeted bypasses and metadata endpoints.'
      },
      COMMON_FIELDS.targetTechnology,
      COMMON_FIELDS.constraints,
      COMMON_FIELDS.requiredTools,
      COMMON_FIELDS.outputFormat,
      COMMON_FIELDS.expectedDepth
    ],
    template: `### System Instruction
You are an expert web application penetration tester and cloud security specialist. Your goal is to guide the user through testing for Server-Side Request Forgery (SSRF) vulnerabilities in the specified scope, targeting the designated cloud/infrastructure environment.

### Context & Parameters
- **Objective**: {{objective}}
- **Target URL/Scope**: {{scope}}
- **Cloud Provider Target**: {{cloudProvider}}
- **Target Technology Stack**: {{targetTechnology}}
- **Safety / Execution Constraints**: {{constraints}}
- **Preferred Tools**: {{requiredTools}}
- **Expected Depth**: {{expectedDepth}}
- **Required Output Format**: {{outputFormat}}

### Execution Instructions
1. **Attack Surface Mapping**: Analyze the target technology stack ({{targetTechnology}}) and describe where SSRF vulnerabilities commonly manifest in these components (e.g., PDF generation, webhooks, image uploaders).
2. **Metadata & Internal Endpoint Targets**: Provide a specific list of target endpoints to request based on {{cloudProvider}}. Include exact paths for sensitive configuration, credentials, or internal resources.
3. **SSRF Bypass Payloads**: Generate a structured matrix of bypass payloads (e.g., URL encoding, DNS rebinding, IP address representations, IPv6, localhost redirects) tailored to bypass standard web application firewalls (WAF) or sanitizers.
4. **Validation Walkthrough**: List step-by-step commands or actions using {{requiredTools}} to confirm whether the endpoint is vulnerable to blind SSRF or fully-returned SSRF.
5. **Mitigation Guidance**: Detail how to fix the SSRF root cause on {{targetTechnology}}, including secure code examples (e.g., network allowlisting, disabling redirection, local DNS checks).

Provide a comprehensive, high-quality output formatted strictly in {{outputFormat}}.`
  },

  // 2. API SECURITY
  {
    id: 'api-owasp',
    title: 'OWASP API Top 10 Audit Plan',
    description: 'Generate a focused penetration testing methodology covering Broken Object Level Authorization (BOLA), BFLA, and mass assignment.',
    category: 'pentest',
    subcategory: 'API Security',
    difficulty: 'Advanced',
    tags: ['OWASP Top 10', 'BOLA', 'BFLA', 'JWT', 'REST'],
    fields: [
      COMMON_FIELDS.objective,
      COMMON_FIELDS.scope,
      {
        id: 'authMechanism',
        label: 'Authentication Mechanism',
        type: 'select',
        defaultValue: 'JWT (JSON Web Tokens)',
        options: ['JWT (JSON Web Tokens)', 'OAuth2 / OIDC', 'API Key in Header', 'Session Cookies', 'No Auth (Public API)'],
        helpText: 'How is authentication and state handled?'
      },
      COMMON_FIELDS.targetTechnology,
      COMMON_FIELDS.requiredTools,
      COMMON_FIELDS.outputFormat
    ],
    template: `### System Instruction
You are an API security expert. Generate a detailed, technical API penetration testing plan targeting the OWASP API Security Top 10, specifically tailored to the target details.

### Context & Parameters
- **Objective**: {{objective}}
- **API Spec / Endpoints in Scope**: {{scope}}
- **Authentication**: {{authMechanism}}
- **Underlying Technology**: {{targetTechnology}}
- **Recommended Tools**: {{requiredTools}}
- **Output Format**: {{outputFormat}}

### Audit Steps Requested
1. **Authentication & Authorization Auditing**:
   - Detail how to check for Broken Object Level Authorization (BOLA/IDOR) on resources, including specific payload templates.
   - Describe methods to bypass authentication or manipulate {{authMechanism}} (e.g., JWT header injection, signature stripping, token theft).
   - Detail Broken Function Level Authorization (BFLA) checks between administrator and normal user privilege profiles.
2. **Data & Schema Auditing**:
   - Outline checks for Mass Assignment (e.g., passing extra JSON parameters to edit roles).
   - Outline checks for Server Resource Limit exhaustion (DoS via payload size or pagination values).
3. **Execution Commands**:
   - Provide concrete commands using {{requiredTools}} (e.g., curl, Burp Suite intruder configs) to run these authorization test paths automatically.
4. **Remediation**:
   - Write defensive guidelines matching {{targetTechnology}} to secure the endpoints against authorization flaws.

Format output in {{outputFormat}}.`
  },

  // 3. CLOUD SECURITY (AWS IAM)
  {
    id: 'cloud-aws-iam',
    title: 'AWS IAM Privilege Escalation Review',
    description: 'Audit AWS IAM policies for misconfigurations that could allow an attacker to escalate privileges or assume other roles.',
    category: 'pentest',
    subcategory: 'AWS Security',
    difficulty: 'Advanced',
    tags: ['AWS', 'IAM', 'Privilege Escalation', 'Policy Audit'],
    fields: [
      COMMON_FIELDS.objective,
      {
        id: 'iamPolicyJson',
        label: 'IAM Policy JSON (Optional)',
        type: 'textarea',
        placeholder: 'Paste the IAM Policy JSON document here, or describe the policy targets...',
        helpText: 'If provided, analysis will focus on this policy; otherwise, general escalation vectors will be reviewed.'
      },
      COMMON_FIELDS.outputFormat,
      COMMON_FIELDS.expectedDepth
    ],
    template: `### System Instruction
You are an AWS Cloud Security Architect and Red Team consultant. Analyze AWS IAM configuration policies to locate privilege escalation vectors (e.g., iam:CreateAccessKey, iam:PassRole, STS AssumeRole misconfigurations).

### Context & Parameters
- **Objective**: {{objective}}
- **IAM Policy Reference**: {{iamPolicyJson}}
- **Expected Depth**: {{expectedDepth}}
- **Output Format**: {{outputFormat}}

### Audit requirements
1. **Policy Analysis**: If a policy JSON was provided ({{iamPolicyJson}}), conduct a line-by-line review of permissions. Identify overly permissive wildcards (*), actions, and resource restrictions.
2. **Escalation Path Detection**: Map out exactly how an identity possessing these permissions could escalate to AdministratorAccess or assume high-privilege roles (e.g., EC2 instance profile creation, AWS Lambda creation).
3. **Exploit Script / CLI Sequence**: Give the exact \`aws\` CLI commands a penetration tester would execute to abuse these permissions.
4. **Hardening recommendations**: Provide corrected IAM policies using least-privilege principles and condition keys (e.g., \`aws:PrincipalOrgID\`, \`aws:SourceIp\`).

Format the report using {{outputFormat}}.`
  },

  // 4. MALWARE ANALYSIS
  {
    id: 'malware-deobfuscate',
    title: 'Reverse Engineering & Code Deobfuscation',
    description: 'Reverse engineer obfuscated scripts (PowerShell, Javascript, VBA, Python) or compiler binaries to identify control flow and indicators.',
    category: 'defense',
    subcategory: 'Malware Analysis',
    difficulty: 'Expert',
    tags: ['Malware', 'Reverse Engineering', 'Deobfuscation', 'PowerShell', 'JS'],
    fields: [
      COMMON_FIELDS.objective,
      {
        id: 'obfuscatedCode',
        label: 'Obfuscated Code Segment / Outline',
        type: 'textarea',
        placeholder: 'Paste snippet of obfuscated script or describes binary characteristics...',
        required: true,
        helpText: 'The malware snippet to analyze.'
      },
      {
        id: 'scriptLanguage',
        label: 'Source Language / Format',
        type: 'select',
        defaultValue: 'PowerShell (.ps1)',
        options: ['PowerShell (.ps1)', 'JavaScript / WSH (.js)', 'VBA Macro (.vbs)', 'Python (Compiled/Frozen)', 'PE Binary Assembly (x86/x64)'],
        helpText: 'The format of the input code.'
      },
      COMMON_FIELDS.requiredTools,
      COMMON_FIELDS.outputFormat
    ],
    template: `### System Instruction
You are a Malware Analyst and Reverse Engineer. Deconstruct the obfuscated code or binary specifications provided to discover its true functionality, network beacons, evasion techniques, and indicators of compromise (IOCs).

### Context & Parameters
- **Objective**: {{objective}}
- **Language/Format**: {{scriptLanguage}}
- **Obfuscated Snippet**:
\`\`\`
{{obfuscatedCode}}
\`\`\`
- **Analysis Tools**: {{requiredTools}}
- **Output Format**: {{outputFormat}}

### Requested Analysis Tasks
1. **Deobfuscation Strategy**: Identify the obfuscation methods used in the snippet (e.g., base64 encoding, XOR encryption, string concatenation, variable renaming, control flow flattening). Explain how to strip them using {{requiredTools}}.
2. **Logical Flow Walkthrough**: Provide a clean, readable version of the code with annotated explanations of what each function actually achieves.
3. **Indicators of Compromise (IOCs)**: Extract and list all registry paths, file creation endpoints, API calls (e.g., VirtualAlloc, WriteProcessMemory), IPs, domains, and User-Agent strings.
4. **Behavioral Signature Draft**: Provide a signature draft (e.g., YARA or regex rules) to detect this script pattern in transit or storage.

Format your analysis as a {{outputFormat}}.`
  },

  // 5. DETECTION ENGINEERING: SIGMA RULE DESIGN
  {
    id: 'detection-sigma',
    title: 'Sigma Rule Generation from Logs',
    description: 'Analyze an attack technique log output (Windows Event, Sysmon, Auditd) and construct a high-fidelity Sigma detection rule.',
    category: 'defense',
    subcategory: 'Detection Engineering',
    difficulty: 'Advanced',
    tags: ['Sigma', 'Sysmon', 'SIEM', 'Logs', 'Blue Team'],
    fields: [
      COMMON_FIELDS.objective,
      {
        id: 'rawLogSnippet',
        label: 'Raw Log / Process Creation Snippet',
        type: 'textarea',
        placeholder: 'Paste Sysmon Event ID 1, Windows Security Event 4688, or Linux Auditd log...',
        required: true,
        helpText: 'The log showing the malicious behavior you want to detect.'
      },
      {
        id: 'mitreTechnique',
        label: 'MITRE ATT&CK Technique ID',
        type: 'text',
        placeholder: 'T1059.001 (PowerShell Command Execution)',
        helpText: 'Map this rule to a MITRE ATT&CK ID.'
      },
      COMMON_FIELDS.outputFormat
    ],
    template: `### System Instruction
You are a Detection Engineer and SIEM specialist. Your task is to analyze the provided log entry and generate a robust, production-ready Sigma rule that detects this specific threat while minimizing false positives.

### Context & Parameters
- **Objective**: {{objective}}
- **Raw Log Input**:
\`\`\`
{{rawLogSnippet}}
\`\`\`
- **Target MITRE ATT&CK ID**: {{mitreTechnique}}
- **Required Output**: {{outputFormat}} (specifically looking for YAML format)

### Construction Guidelines
1. **Log Parsing & Extraction**: Identify key fields (e.g., Image, CommandLine, ParentCommandLine, User, TargetObject) and their values from the raw log that signify execution of the attack.
2. **Sigma Rule Development**: Write a syntactically correct Sigma rule in YAML format. Ensure it contains:
   - Metadata (title, description, author, date, status, level).
   - Logsource specifying category, product, and service.
   - Detection block containing logic rules (selection, filters).
   - FalsePositives suggestions list.
   - Tags section mapping to {{mitreTechnique}}.
3. **Optimization against Evasion**: Discuss potential bypasses of this rule (e.g., renaming the executable, obfuscated CLI switches) and how to harden the Sigma rule to catch them.

Deliver the complete Sigma YAML rule and explanation.`
  },

  // 6. YARA RULE GENERATION
  {
    id: 'detection-yara',
    title: 'YARA Rule Generator',
    description: 'Generate high-fidelity YARA rules based on strings, hex sequences, or PE attributes of malware samples.',
    category: 'defense',
    subcategory: 'Yara Rules',
    difficulty: 'Advanced',
    tags: ['YARA', 'Static Signature', 'Byte Matching', 'Incident Response'],
    fields: [
      COMMON_FIELDS.objective,
      {
        id: 'yaraStrings',
        label: 'Identified Strings / Hex Patterns',
        type: 'textarea',
        placeholder: 'Paste ascii strings, wide strings, or hex sequences (e.g., { E2 34 ?? 90 A2 })...',
        required: true,
        helpText: 'Textual or hex signatures from the file.'
      },
      {
        id: 'peAttributes',
        label: 'PE File Attributes (Optional)',
        type: 'text',
        placeholder: 'file size < 500KB, imports "ws2_32.dll", entrypoint...',
        helpText: 'Add PE condition constraints to make the signature precise.'
      },
      COMMON_FIELDS.outputFormat
    ],
    template: `### System Instruction
You are an Incident Responder and Security Researcher. Create a valid, optimized YARA rule targeting the provided parameters.

### Context & Parameters
- **Objective**: {{objective}}
- **Target Strings / Patterns**:
{{yaraStrings}}
- **PE Attributes/Conditions**: {{peAttributes}}
- **Output Format**: {{outputFormat}}

### Design Steps
1. **Rule Validation**: Create a YARA rule structure containing:
   - \`meta\`: Author, date, hash, description, references.
   - \`strings\`: Configured with modifiers (ascii, wide, nocase, private) and hex wildcards if needed.
   - \`condition\`: Logic combining strings ($a and ($b or $c)) and file size / PE characteristics ({{peAttributes}}).
2. **False Positive Suppression**: Discuss how to avoid matching normal system utilities (e.g., clean system files containing similar cryptographic helper functions).
3. **Execution Instructions**: Provide the \`yara\` command line flags to scan a directory using this rule.

Provide the complete YARA rule.`
  },

  // 7. SECURE CODE REVIEW
  {
    id: 'sec-code-review',
    title: 'Secure Code Audit (SAST)',
    description: 'Scan code snippets for critical vulnerabilities (SQLi, XSS, RCE, IDOR) and provide secure refactoring patterns.',
    category: 'engineering',
    subcategory: 'Secure Code Review',
    difficulty: 'Intermediate',
    tags: ['SAST', 'Secure Coding', 'Refactoring', 'Vulnerability Scan'],
    fields: [
      COMMON_FIELDS.objective,
      {
        id: 'codeSnippet',
        label: 'Source Code Snippet',
        type: 'textarea',
        placeholder: 'Paste the functions or files containing code to audit...',
        required: true,
        helpText: 'The code to scan for vulnerabilities.'
      },
      {
        id: 'codeLanguage',
        label: 'Programming Language',
        type: 'select',
        defaultValue: 'Python',
        options: ['Python', 'JavaScript/TypeScript', 'Go', 'Java', 'C/C++', 'C#', 'PHP', 'Ruby'],
        helpText: 'Select code language.'
      },
      COMMON_FIELDS.constraints,
      COMMON_FIELDS.outputFormat
    ],
    template: `### System Instruction
You are a Principal Application Security Engineer and Secure Code Reviewer. Perform a deep static code analysis (SAST) on the code segment to find architectural flaws, security bugs, and policy compliance violations.

### Context & Parameters
- **Objective**: {{objective}}
- **Language**: {{codeLanguage}}
- **Constraints**: {{constraints}}
- **Source Code**:
\`\`\`{{codeLanguage}}
{{codeSnippet}}
\`\`\`
- **Expected Report Format**: {{outputFormat}}

### Audit Methodology
1. **Vulnerability Identification**: Find all security flaws present in the source code. For each finding, list:
   - Severity (Critical, High, Medium, Low).
   - CWE ID & Name.
   - Root cause explanation referencing specific line numbers.
2. **Exploitation Path**: Describe how an attacker could trigger this vulnerability (e.g., constructing a specific input payload).
3. **Secure Refactoring**: Write a rewritten, secure version of the code snippet that resolves the issues. Explain the protective measures implemented (e.g., input validation, parameterized queries, proper encoding).

Deliver your findings strictly in the format of {{outputFormat}}.`
  },

  // 8. AI SECURITY: PROMPT INJECTION TESTING
  {
    id: 'ai-prompt-injection',
    title: 'Prompt Injection & Jailbreak Assessment',
    description: 'Design a suite of prompt injection payloads and red-teaming checks to test an LLM application for system prompt bypasses.',
    category: 'ai-sec',
    subcategory: 'Prompt Injection Testing',
    difficulty: 'Advanced',
    tags: ['AI Security', 'Prompt Injection', 'Jailbreak', 'Red Teaming', 'LLM Security'],
    fields: [
      COMMON_FIELDS.objective,
      {
        id: 'systemPromptTarget',
        label: 'LLM App System Prompt / Rules',
        type: 'textarea',
        placeholder: 'Describe the system prompt instructions, rules, and restrictions of the LLM application to audit...',
        required: true,
        helpText: 'The target LLM instructions we want to bypass/leak.'
      },
      {
        id: 'injectionType',
        label: 'Injection Attack Type',
        type: 'select',
        defaultValue: 'Direct Injection (Jailbreak)',
        options: ['Direct Injection (Jailbreak)', 'Indirect Injection (via web/data)', 'System Prompt Leakage', 'Instruction Override / Goal Hijacking'],
        helpText: 'Select the specific vector to build tests for.'
      },
      COMMON_FIELDS.outputFormat
    ],
    template: `### System Instruction
You are an AI Security Researcher and LLM Red Teamer. Develop a systematic suite of test cases to evaluate the target LLM application\'s defenses against prompt injection, jailbreaking, or data leakage.

### Context & Parameters
- **Objective**: {{objective}}
- **Target LLM Rules/System Prompt**:
> {{systemPromptTarget}}
- **Attack Vector**: {{injectionType}}
- **Output Format**: {{outputFormat}}

### Red Teaming Plan
1. **Vulnerability Analysis**: Analyze the target application rules ({{systemPromptTarget}}) for structural logic flaws (e.g., conflicting rules, lack of delimiter isolation, trusting user input implicitly).
2. **Payload Design**: Generate five distinct, highly-targeted test payloads matching {{injectionType}} (e.g., prefix overrides, virtual simulator games, translation overrides, character/encoding obfuscation).
3. **Success Criteria Evaluation**: Define exactly how to verify if a test succeeded (e.g., output contains system secrets, model executes banned task).
4. **Hardening Recommendations**: Explain how to defend against these prompt injection vectors (e.g., XML tagging, input/output filtering, prompt restructuring).

Provide the output in {{outputFormat}}.`
  },

  // 9. AGENTIC AI SECURITY REVIEWS
  {
    id: 'ai-agent-review',
    title: 'Agentic AI Tool Execution Audit',
    description: 'Audit the execution boundaries and permissions of an AI Agent with tool usage (e.g., terminal, database write permissions).',
    category: 'ai-sec',
    subcategory: 'Agentic AI Security Reviews',
    difficulty: 'Expert',
    tags: ['Agentic AI', 'Tool Security', 'RCE', 'Sandbox Bypass'],
    fields: [
      COMMON_FIELDS.objective,
      {
        id: 'agentTools',
        label: 'Available Tools & Actions',
        type: 'textarea',
        placeholder: 'e.g., execute_terminal_command(cmd), read_database(query), send_email(to, body)...',
        required: true,
        helpText: 'Tools the agent can access in its sandbox.'
      },
      {
        id: 'agentSandbox',
        label: 'Sandbox & Execution Context',
        type: 'text',
        placeholder: 'Docker container, local process, serverless environment...',
        defaultValue: 'Docker container with internet access, running as root.',
        helpText: 'The environment hosting the agent execution.'
      },
      COMMON_FIELDS.outputFormat
    ],
    template: `### System Instruction
You are an AI Architect and Security Researcher specializing in Agentic Security (OWASP Top 10 for LLMs / Agents). Audit the security context of the AI Agent\'s tool definitions and execution sandbox.

### Context & Parameters
- **Objective**: {{objective}}
- **Agent Tools List**:
{{agentTools}}
- **Sandbox Environment**: {{agentSandbox}}
- **Report Style**: {{outputFormat}}

### Audit Scope
1. **Indirect Command Injection Vectors**: Identify if tools (like {{agentTools}}) are susceptible to command injection, SQL injection, or path traversal if given inputs generated by LLMs that parse untrusted external data.
2. **Privilege Escalation & Sandbox Escape**: Check the host configuration ({{agentSandbox}}) for vulnerabilities that allow escaping the container/sandbox via agent-executed scripts.
3. **Goal Hijacking Impact**: Map out the worst-case scenario if the agent is fully compromised via prompt injection (e.g., exfiltrating local database tables, abusing email dispatch tool to spam).
4. **Defensive Architectures**: Provide standard, secure wrappers for the tools (e.g., command parameterization, input sanitizers, read-only connections, human-in-the-loop triggers).

Provide a technical assessment report in the style of {{outputFormat}}.`
  }
];
