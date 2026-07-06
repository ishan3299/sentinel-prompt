(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const c of n.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function e(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(r){if(r.ep)return;r.ep=!0;const n=e(r);fetch(r.href,n)}})();const s={objective:{id:"objective",label:"Objective",type:"textarea",placeholder:"Define the main goal of this activity...",required:!0,helpText:"What are you trying to accomplish?"},scope:{id:"scope",label:"Scope",type:"textarea",placeholder:"URLs, IP ranges, codebase paths, API endpoints...",required:!0,helpText:"What is inside the boundaries of this assessment?"},constraints:{id:"constraints",label:"Constraints & Rules of Engagement",type:"textarea",placeholder:"No destructive testing, rate limit: 5 req/sec, white-box only...",defaultValue:"Do not perform disruptive or destructive tests. Operate strictly within local constraints.",helpText:"Limits on testing, safety controls, or scope boundaries."},targetTechnology:{id:"targetTechnology",label:"Target Technology & Architecture",type:"text",placeholder:"Node.js, PostgreSQL, AWS S3, Kubernetes v1.29...",required:!0,helpText:"The tech stack, frameworks, platforms, or systems involved."},outputFormat:{id:"outputFormat",label:"Output Format",type:"select",defaultValue:"Markdown Report (Technical)",options:["Markdown Report (Technical)","Executive Summary","JSON Data Structure","Sigma / Yara Rules Output","Step-by-Step POC Script","Jira Bug Report Ticket"],helpText:"How the final output should be structured."},expectedDepth:{id:"expectedDepth",label:"Expected Analysis Depth",type:"select",defaultValue:"Technical Deep-Dive",options:["Quick Overview","Standard Review","Technical Deep-Dive","Proof-of-Concept & Exploit Dev"],helpText:"Level of details and code examples needed."},requiredTools:{id:"requiredTools",label:"Required / Permitted Tools",type:"text",placeholder:"Burp Suite, Nmap, Ghidra, Semgrep, Wireshark...",helpText:"Tools to base the commands and workflows on."}},D=[{id:"pentest",name:"Pentesting & AppSec",description:"Web, API, Mobile, Cloud, Kubernetes & AD Pentesting"},{id:"defense",name:"Detection & DFIR",description:"Sigma/YARA, Malware Analysis, Threat Hunting, Log Audit"},{id:"engineering",name:"Secure Engineering",description:"Secure Code Review, Code Gen, Threat Modeling"},{id:"strategy",name:"Strategy & Ops",description:"Report Writing, Incident Response, Red/Purple Team"},{id:"ai-sec",name:"AI & LLM Security",description:"Prompt Injection, RAG Security, Agent Security Reviews"}],v=[{id:"web-ssrf",title:"SSRF Vulnerability Audit",description:"Create a tailored penetration testing plan focused on Server-Side Request Forgery (SSRF) in cloud environments.",category:"pentest",subcategory:"Web Application Pentesting",difficulty:"Advanced",tags:["SSRF","Web AppSec","Cloud Metadata","Bypass"],fields:[s.objective,s.scope,{id:"cloudProvider",label:"Cloud Provider Environment",type:"select",defaultValue:"AWS (IMDSv1 & IMDSv2)",options:["AWS (IMDSv1 & IMDSv2)","GCP Metadata","Azure Instance Metadata","Private/Internal Network Only"],helpText:"Select cloud platform to generate targeted bypasses and metadata endpoints."},s.targetTechnology,s.constraints,s.requiredTools,s.outputFormat,s.expectedDepth],template:`### System Instruction
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

Provide a comprehensive, high-quality output formatted strictly in {{outputFormat}}.`},{id:"api-owasp",title:"OWASP API Top 10 Audit Plan",description:"Generate a focused penetration testing methodology covering Broken Object Level Authorization (BOLA), BFLA, and mass assignment.",category:"pentest",subcategory:"API Security",difficulty:"Advanced",tags:["OWASP Top 10","BOLA","BFLA","JWT","REST"],fields:[s.objective,s.scope,{id:"authMechanism",label:"Authentication Mechanism",type:"select",defaultValue:"JWT (JSON Web Tokens)",options:["JWT (JSON Web Tokens)","OAuth2 / OIDC","API Key in Header","Session Cookies","No Auth (Public API)"],helpText:"How is authentication and state handled?"},s.targetTechnology,s.requiredTools,s.outputFormat],template:`### System Instruction
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

Format output in {{outputFormat}}.`},{id:"cloud-aws-iam",title:"AWS IAM Privilege Escalation Review",description:"Audit AWS IAM policies for misconfigurations that could allow an attacker to escalate privileges or assume other roles.",category:"pentest",subcategory:"AWS Security",difficulty:"Advanced",tags:["AWS","IAM","Privilege Escalation","Policy Audit"],fields:[s.objective,{id:"iamPolicyJson",label:"IAM Policy JSON (Optional)",type:"textarea",placeholder:"Paste the IAM Policy JSON document here, or describe the policy targets...",helpText:"If provided, analysis will focus on this policy; otherwise, general escalation vectors will be reviewed."},s.outputFormat,s.expectedDepth],template:`### System Instruction
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

Format the report using {{outputFormat}}.`},{id:"malware-deobfuscate",title:"Reverse Engineering & Code Deobfuscation",description:"Reverse engineer obfuscated scripts (PowerShell, Javascript, VBA, Python) or compiler binaries to identify control flow and indicators.",category:"defense",subcategory:"Malware Analysis",difficulty:"Expert",tags:["Malware","Reverse Engineering","Deobfuscation","PowerShell","JS"],fields:[s.objective,{id:"obfuscatedCode",label:"Obfuscated Code Segment / Outline",type:"textarea",placeholder:"Paste snippet of obfuscated script or describes binary characteristics...",required:!0,helpText:"The malware snippet to analyze."},{id:"scriptLanguage",label:"Source Language / Format",type:"select",defaultValue:"PowerShell (.ps1)",options:["PowerShell (.ps1)","JavaScript / WSH (.js)","VBA Macro (.vbs)","Python (Compiled/Frozen)","PE Binary Assembly (x86/x64)"],helpText:"The format of the input code."},s.requiredTools,s.outputFormat],template:`### System Instruction
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

Format your analysis as a {{outputFormat}}.`},{id:"detection-sigma",title:"Sigma Rule Generation from Logs",description:"Analyze an attack technique log output (Windows Event, Sysmon, Auditd) and construct a high-fidelity Sigma detection rule.",category:"defense",subcategory:"Detection Engineering",difficulty:"Advanced",tags:["Sigma","Sysmon","SIEM","Logs","Blue Team"],fields:[s.objective,{id:"rawLogSnippet",label:"Raw Log / Process Creation Snippet",type:"textarea",placeholder:"Paste Sysmon Event ID 1, Windows Security Event 4688, or Linux Auditd log...",required:!0,helpText:"The log showing the malicious behavior you want to detect."},{id:"mitreTechnique",label:"MITRE ATT&CK Technique ID",type:"text",placeholder:"T1059.001 (PowerShell Command Execution)",helpText:"Map this rule to a MITRE ATT&CK ID."},s.outputFormat],template:`### System Instruction
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

Deliver the complete Sigma YAML rule and explanation.`},{id:"detection-yara",title:"YARA Rule Generator",description:"Generate high-fidelity YARA rules based on strings, hex sequences, or PE attributes of malware samples.",category:"defense",subcategory:"Yara Rules",difficulty:"Advanced",tags:["YARA","Static Signature","Byte Matching","Incident Response"],fields:[s.objective,{id:"yaraStrings",label:"Identified Strings / Hex Patterns",type:"textarea",placeholder:"Paste ascii strings, wide strings, or hex sequences (e.g., { E2 34 ?? 90 A2 })...",required:!0,helpText:"Textual or hex signatures from the file."},{id:"peAttributes",label:"PE File Attributes (Optional)",type:"text",placeholder:'file size < 500KB, imports "ws2_32.dll", entrypoint...',helpText:"Add PE condition constraints to make the signature precise."},s.outputFormat],template:`### System Instruction
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

Provide the complete YARA rule.`},{id:"sec-code-review",title:"Secure Code Audit (SAST)",description:"Scan code snippets for critical vulnerabilities (SQLi, XSS, RCE, IDOR) and provide secure refactoring patterns.",category:"engineering",subcategory:"Secure Code Review",difficulty:"Intermediate",tags:["SAST","Secure Coding","Refactoring","Vulnerability Scan"],fields:[s.objective,{id:"codeSnippet",label:"Source Code Snippet",type:"textarea",placeholder:"Paste the functions or files containing code to audit...",required:!0,helpText:"The code to scan for vulnerabilities."},{id:"codeLanguage",label:"Programming Language",type:"select",defaultValue:"Python",options:["Python","JavaScript/TypeScript","Go","Java","C/C++","C#","PHP","Ruby"],helpText:"Select code language."},s.constraints,s.outputFormat],template:`### System Instruction
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

Deliver your findings strictly in the format of {{outputFormat}}.`},{id:"ai-prompt-injection",title:"Prompt Injection & Jailbreak Assessment",description:"Design a suite of prompt injection payloads and red-teaming checks to test an LLM application for system prompt bypasses.",category:"ai-sec",subcategory:"Prompt Injection Testing",difficulty:"Advanced",tags:["AI Security","Prompt Injection","Jailbreak","Red Teaming","LLM Security"],fields:[s.objective,{id:"systemPromptTarget",label:"LLM App System Prompt / Rules",type:"textarea",placeholder:"Describe the system prompt instructions, rules, and restrictions of the LLM application to audit...",required:!0,helpText:"The target LLM instructions we want to bypass/leak."},{id:"injectionType",label:"Injection Attack Type",type:"select",defaultValue:"Direct Injection (Jailbreak)",options:["Direct Injection (Jailbreak)","Indirect Injection (via web/data)","System Prompt Leakage","Instruction Override / Goal Hijacking"],helpText:"Select the specific vector to build tests for."},s.outputFormat],template:`### System Instruction
You are an AI Security Researcher and LLM Red Teamer. Develop a systematic suite of test cases to evaluate the target LLM application's defenses against prompt injection, jailbreaking, or data leakage.

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

Provide the output in {{outputFormat}}.`},{id:"ai-agent-review",title:"Agentic AI Tool Execution Audit",description:"Audit the execution boundaries and permissions of an AI Agent with tool usage (e.g., terminal, database write permissions).",category:"ai-sec",subcategory:"Agentic AI Security Reviews",difficulty:"Expert",tags:["Agentic AI","Tool Security","RCE","Sandbox Bypass"],fields:[s.objective,{id:"agentTools",label:"Available Tools & Actions",type:"textarea",placeholder:"e.g., execute_terminal_command(cmd), read_database(query), send_email(to, body)...",required:!0,helpText:"Tools the agent can access in its sandbox."},{id:"agentSandbox",label:"Sandbox & Execution Context",type:"text",placeholder:"Docker container, local process, serverless environment...",defaultValue:"Docker container with internet access, running as root.",helpText:"The environment hosting the agent execution."},s.outputFormat],template:`### System Instruction
You are an AI Architect and Security Researcher specializing in Agentic Security (OWASP Top 10 for LLMs / Agents). Audit the security context of the AI Agent's tool definitions and execution sandbox.

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

Provide a technical assessment report in the style of {{outputFormat}}.`},{id:"cloud-s3-leak",title:"S3 Public Access Policy Auditor",description:"Evaluate AWS S3 bucket ACLs and bucket policies to detect public read/write exposure or write privilege vulnerabilities.",category:"pentest",subcategory:"Cloud Security",difficulty:"Intermediate",tags:["AWS","S3","Cloud Leak","Policy Check"],fields:[s.objective,{id:"s3BucketPolicy",label:"Bucket Policy JSON (Optional)",type:"textarea",placeholder:"Paste the S3 Bucket Policy JSON here...",helpText:"Auditor will trace statement blocks for public principal wildcards (*)."},s.requiredTools,s.outputFormat],template:`### System Instruction
You are an AWS Security Consultant. Review the S3 bucket configuration to evaluate public exposures, data leakage paths, or insecure modification configurations.

### Context & Parameters
- **Objective**: {{objective}}
- **Bucket Policy Reference**: {{s3BucketPolicy}}
- **Tools Permitted**: {{requiredTools}}
- **Output Style**: {{outputFormat}}

### Analysis requirements
1. **exposure Assessment**: Locate any permissions granting "Principal": "*" or anonymous read/write actions (e.g., s3:GetObject, s3:PutObject) without specific IpAddress or PrincipalOrgID conditions.
2. **CLI verification**: Write the exact \`aws s3api\` CLI commands to run using {{requiredTools}} to inspect policy, ACL, and BlockPublicAccess settings.
3. **Bypass Checks**: Outline checks to verify if Bucket ACL overrides public block configuration settings.
4. **Mitigation**: Provide the corrected bucket policy JSON document and cli hardening commands.

Deliver the audit findings in {{outputFormat}}.`},{id:"ad-kerberoasting",title:"Active Directory Kerberoasting Plan",description:"Design a detailed pen-testing workflow to perform Kerberoasting attacks to extract and crack Service Principal Name (SPN) tickets.",category:"pentest",subcategory:"Active Directory",difficulty:"Advanced",tags:["Active Directory","Kerberoasting","SPN","Mimikatz","Hashcat"],fields:[s.objective,{id:"targetDomain",label:"AD Domain Controller Name",type:"text",placeholder:"corp.internal, 10.10.10.50...",required:!0,helpText:"The target domain name or DC IP."},s.requiredTools,s.outputFormat],template:`### System Instruction
You are an Active Directory Penetration Testing specialist. Formulate a step-by-step adversary emulation and pentest playbook targeting SPNs in the domain controller.

### Context & Parameters
- **Objective**: {{objective}}
- **Target Domain Controller**: {{targetDomain}}
- **Tools**: {{requiredTools}}
- **Output Format**: {{outputFormat}}

### Playbook sections
1. **SPN Enumeration**: Write specific PowerShell/CLI Commands to discover SPN accounts associated with user accounts (e.g., using Setspn, PowerView, or Rubeus).
2. **Ticket Requesting**: Provide instructions and command strings using {{requiredTools}} to request Kerberos TGS tickets for SPNs and extract them to disk (e.g., Rubeus /kerberoast).
3. **Offline Cracking**: Provide the exact \`hashcat\` or \`john\` commands to crack the extracted Kerberos ticket hashes using custom rules and dictionaries.
4. **Detection Mapping**: Suggest Event IDs (e.g., Event ID 4769 - A Kerberos service ticket was requested) to monitor to detect Kerberoasting activity.

Format output as {{outputFormat}}.`},{id:"k8s-namespaces",title:"Kubernetes Namespace Isolation Audit",description:"Audit network policies and RBAC roles in a Kubernetes cluster to verify Namespace isolation controls.",category:"pentest",subcategory:"Kubernetes",difficulty:"Advanced",tags:["Kubernetes","Namespace","RBAC","NetworkPolicy"],fields:[s.objective,{id:"rbacDefinition",label:"Role / ClusterRole YAML (Optional)",type:"textarea",placeholder:"Paste Role, ClusterRole, or NetworkPolicy YAML here...",helpText:"K8s security specialist will review configuration rules."},s.outputFormat],template:`### System Instruction
You are a Kubernetes Security Architect and Cluster Auditor. Assess namespace boundaries, service account roles, and inter-namespace network configurations to detect boundary escapes.

### Context & Parameters
- **Objective**: {{objective}}
- **K8s Config / Context**: {{rbacDefinition}}
- **Output Format**: {{outputFormat}}

### Audit Steps
1. **NetworkPolicy Analysis**: Verify if egress/ingress blocks are missing in default-deny configurations, allowing cross-namespace pod communication.
2. **RBAC Rule auditing**: If YAML configuration was supplied ({{rbacDefinition}}), look for wildcard verbs or dangerous resources (e.g., secrets, pods/exec, daemonsets).
3. **Pod escape commands**: Write commands (using \`kubectl\`) to test namespace privileges and attempt privilege escalations.
4. **Hardening**: Provide the correct YAML configurations for securing NetworkPolicies and Least-Privileged ServiceAccounts.

Deliver report in style: {{outputFormat}}.`},{id:"mob-frida",title:"Mobile App Frida Instrumentation Hooks",description:"Design Frida hook scripts to bypass SSL pinning, root detection, or examine API calls in Android/iOS apps.",category:"pentest",subcategory:"Mobile Security",difficulty:"Expert",tags:["Mobile Sec","Android","Frida","SSL Pinning","Bypass"],fields:[s.objective,{id:"targetClassMethod",label:"Target Class / Method to Hook",type:"text",placeholder:"com.target.app.SecurityCheck.isRooted()",required:!0,helpText:"Java class path or Native function name to target."},{id:"mobilePlatform",label:"Target OS Platform",type:"select",defaultValue:"Android (Java Runtime)",options:["Android (Java Runtime)","iOS (Objective-C Runtime)","Native (C/C++ Shared Library Hooking)"],helpText:"Select mobile target system."},s.outputFormat],template:`### System Instruction
You are a Mobile Security Analyst and instrumentation specialist. Write custom Frida scripts to hook and intercept the target classes and bypass built-in security checks.

### Context & Parameters
- **Objective**: {{objective}}
- **Target OS**: {{mobilePlatform}}
- **Method/Class Target**: {{targetClassMethod}}
- **Output Style**: {{outputFormat}}

### Hook Design
1. **Instrumentation Logic**: Analyze how {{mobilePlatform}} executes the targeted call, and draft a Frida Javascript template to intercept it.
2. **Hook script Code**: Write complete, working Javascript Frida code using \`Java.perform\` or \`Interceptor.attach\` to override the return value of {{targetClassMethod}} to force bypass states.
3. **Execution command**: Provide the Frida shell CLI commands to inject this script into the target package process.

Deliver the complete code and instructions formatted in {{outputFormat}}.`},{id:"reverse-shellcode",title:"x64 Shellcode Assembly Deconstruction",description:"Deconstruct compiled shellcode hex/assembly buffers to identify API calls, socket links, or encryption keys.",category:"defense",subcategory:"Reverse Engineering",difficulty:"Expert",tags:["Reverse Engineering","x64 Assembly","Shellcode","Opcode"],fields:[s.objective,{id:"shellcodeHex",label:"Raw Shellcode Hex Buffer",type:"textarea",placeholder:"e.g., \\x48\\x31\\xc0\\x48\\x31\\xff\\x48\\x31\\xf6...",required:!0,helpText:"Input shellcode byte array."},s.requiredTools,s.outputFormat],template:`### System Instruction
You are an expert Security Researcher and Assembly deconstructor. Analyze the provided compiled shellcode hex payload to identify registers, system calls, endpoints, and shellcode logic.

### Context & Parameters
- **Objective**: {{objective}}
- **Raw shellcode**:
\`\`\`
{{shellcodeHex}}
\`\`\`
- **Tools Permitted**: {{requiredTools}}
- **Output Style**: {{outputFormat}}

### Analysis requirements
1. **Assembly Translation**: Disassemble the raw hex shellcode ({{shellcodeHex}}) and explain the assembly instructions line-by-line.
2. **API resolution**: Identify how the shellcode locates the base address of Kernel32.dll/NTDLL.dll or resolves API function calls (e.g., API hashing algorithms, PEB traversal).
3. **C2 network beacons**: Locate any hardcoded ports, IP addresses, or payload URLs.
4. **Debugging walkthrough**: Detail how to load and step through this shellcode in a debugger using {{requiredTools}}.

Provide disassembled analysis in {{outputFormat}}.`},{id:"dfir-wireshark",title:"PCAP Traffic / Wireshark Network Audit",description:"Analyze network trace PCAP files, tcpdump buffers, or Wireshark streams to track lateral movement or data exfiltration.",category:"defense",subcategory:"Log Analysis",difficulty:"Intermediate",tags:["PCAP","Wireshark","Network Audit","Log Analysis"],fields:[s.objective,{id:"pcapDetails",label:"Observed Network Traffic / Protocol Details",type:"textarea",placeholder:"Describe ports, HTTP requests, DNS queries, or anomalous packet sizes...",required:!0,helpText:"Detail observed anomalies in traffic."},s.requiredTools,s.outputFormat],template:`### System Instruction
You are a Network Forensics Specialist and DFIR Analyst. Analyze network packet details to construct an attack timeline, identify communication paths, and detect exfiltrations.

### Context & Parameters
- **Objective**: {{objective}}
- **Traffic Anomalies**: {{pcapDetails}}
- **Tools**: {{requiredTools}}
- **Output format**: {{outputFormat}}

### Analysis Steps
1. **Protocol Auditing**: Analyze the protocol interactions described ({{pcapDetails}}). Identify potential covert channels, DNS tunneling, HTTP beaconing, or SMTP data exfiltrations.
2. **Wireshark Display Filters**: Generate precise Wireshark display filter strings to search the raw PCAP file using {{requiredTools}} for this exact malicious behavior.
3. **CLI Extraction Command**: Write the exact \`tshark\` command line commands to extract these packet fields programmatically.
4. **Indicators**: List the source/destination IPs, ports, payload sizes, and signatures detected.

Deliver analysis in the format of {{outputFormat}}.`},{id:"intel-threat",title:"MITRE ATT&CK Threat Actor Mapping",description:"Compile Threat Intelligence reports on threat groups (APTs) and map their tactics, techniques, and procedures (TTPs) to the MITRE ATT&CK framework.",category:"defense",subcategory:"Threat Intelligence",difficulty:"Intermediate",tags:["Threat Intel","APT","MITRE ATT&CK","TTPs"],fields:[s.objective,{id:"aptGroup",label:"Threat Actor Name / Details",type:"text",placeholder:"APT29 (Cozy Bear), Lazarus Group, Volt Typhoon...",required:!0,helpText:"Specify target threat group to map."},{id:"observedTtp",label:"Observed Behavior Summary (Optional)",type:"textarea",placeholder:"Describe observed actions, payloads used, credentials accessed...",helpText:"Context to map custom behaviors."},s.outputFormat],template:`### System Instruction
You are a Cyber Threat Intelligence (CTI) Analyst. Analyze the target threat actor behavior to produce a formal MITRE ATT&CK mapping report.

### Context & Parameters
- **Objective**: {{objective}}
- **Threat Actor**: {{aptGroup}}
- **Custom observed actions**: {{observedTtp}}
- **Output Format**: {{outputFormat}}

### Report segments
1. **Threat Profile**: Compile known alias records, origin, targets, and goals of {{aptGroup}}.
2. **MITRE ATT&CK mapping**: Map TTPs to specific MITRE tactics (Initial Access, Execution, Persistence, Evasion, etc.) and write the exact technique IDs (e.g., T1078, T1059).
3. **Detection strategies**: Provide detection logic rules for the mapped techniques.
4. **Mitigation Controls**: Suggest structural mitigations (e.g., MFA policies, network segmentation) to disrupt this actor's killchain.

Provide CTI analysis report in format: {{outputFormat}}.`},{id:"recon-subdomains",title:"Bug Bounty Recon & Subdomain Takeover",description:"Establish a systematic subdomain discovery and reconnaissance methodology to detect orphaned DNS records and subdomain takeover vulnerabilities.",category:"engineering",subcategory:"Bug Bounty Recon",difficulty:"Intermediate",tags:["Recon","Subdomain Takeover","DNS","Amass","Subfinder"],fields:[s.objective,s.scope,s.requiredTools,s.outputFormat],template:`### System Instruction
You are an expert Bug Bounty Hunter. Build a comprehensive reconnaissance workflow targeting subdomain discovery, passive DNS mapping, and takeover scanning.

### Context & Parameters
- **Objective**: {{objective}}
- **Target Domains Scope**: {{scope}}
- **Tools**: {{requiredTools}}
- **Output Format**: {{outputFormat}}

### Recon Playbook
1. **Passive subdomain Discovery**: Write commands using {{requiredTools}} (e.g., subfinder, amass) to extract subdomains.
2. **Active Resolution & DNS Audits**: Write command sequences using tools (e.g., dnsx, massdns) to check CNAME records and locate dangling aliases.
3. **Subdomain Takeover validation**: Provide steps to verify takeover risks on orphaned endpoints (e.g., AWS S3, GitHub Pages, Heroku, Zendesk redirects).
4. **Jira Bug Report Template**: Provide a report structure to submit findings to security teams.

Format output as {{outputFormat}}.`},{id:"osint-social",title:"OSINT Target Profiling & Social Mapping",description:"Develop a framework to collect open-source intelligence (OSINT) data on target organizations, including exposed domains, employee profiles, and metadata leakage.",category:"engineering",subcategory:"OSINT",difficulty:"Intermediate",tags:["OSINT","Recon","MetaData","Target Profile"],fields:[s.objective,{id:"targetOrg",label:"Target Organization Domain",type:"text",placeholder:"example.com",required:!0,helpText:"The target domain name."},s.requiredTools,s.outputFormat],template:`### System Instruction
You are an OSINT Specialist and Penetration Tester. Build a systematic workflow to gather public data on the target organization without directly interacting with their servers.

### Context & Parameters
- **Objective**: {{objective}}
- **Target Domain**: {{targetOrg}}
- **Tools Permitted**: {{requiredTools}}
- **Output Format**: {{outputFormat}}

### OSINT Strategy
1. **Domain & DNS Recon**: Outline passive information gathering steps (WHOIS, DNS records, MX/TXT configurations, Shodan queries).
2. **Human Intelligence (HUMINT) profiling**: Outline search operators to discover employee lists, emails, and roles (e.g., via LinkedIn harvester scripts).
3. **Document Metadata leaks**: Provide commands using {{requiredTools}} (e.g., FOCA, metagoofil) to extract metadata (usernames, internal IPs, software paths) from public documents.
4. **Threat Vector Mapping**: Identify high-potential entry points (e.g., compromised credentials list checks, exposed VPN portals).

Deliver profiling guide in {{outputFormat}}.`},{id:"exploit-bof",title:"Buffer Overflow Exploit Dev Outline",description:"Structure an exploit development outline targeting stack-based buffer overflows on x86/x64 applications.",category:"engineering",subcategory:"Exploit Development",difficulty:"Expert",tags:["Exploit Dev","Buffer Overflow","x86","ASLR","DEP"],fields:[s.objective,{id:"vulnerableApp",label:"Vulnerable Binary Characteristics",type:"text",placeholder:"Windows x86, vuln server, ASLR: disabled, DEP: disabled...",required:!0,helpText:"Input operating system and security mitigations of binary."},s.requiredTools,s.outputFormat],template:`### System Instruction
You are an Exploit Developer and Security Researcher. Formulate a structured exploit development outline to hijack application control flow via stack-based buffer overflow.

### Context & Parameters
- **Objective**: {{objective}}
- **Binary Targets**: {{vulnerableApp}}
- **Debugger tools**: {{requiredTools}}
- **Output Style**: {{outputFormat}}

### Exploit Development Outline
1. **Fuzzing & Crash Discovery**: Write a Python fuzzing script template to crash the service and determine approximate overwrite boundaries.
2. **Offset determination**: Provide commands using {{requiredTools}} (e.g., Mona in Immunity Debugger/WinDbg) to find exact EIP/RIP offset distance.
3. **Bad Character Identification**: Detail steps to locate byte characters (like \\x00) that corrupt payload parsing.
4. **Pointer Redirection**: Write commands to locate JMP ESP/CALL ESP instruction pointers ignoring memory mitigations.
5. **Exploit POC Script**: Provide a working Python skeleton exploit script wrapping payload buffers.

Format report in {{outputFormat}}.`},{id:"purple-emulation",title:"Purple Team Adversary Emulation Script",description:"Design a joint adversary emulation script and blue team detection verify plan targeting specific MITRE ATT&CK techniques.",category:"strategy",subcategory:"Purple Team Exercises",difficulty:"Advanced",tags:["Purple Team","Emulation","Detection Audit","Mitre"],fields:[s.objective,{id:"attackTechnique",label:"Emulated Attack Technique",type:"text",placeholder:"LSASS memory dump (T1003.001)",required:!0,helpText:"Select technique target."},s.requiredTools,s.outputFormat],template:`### System Instruction
You are a Purple Team Consultant and Adversary Emulation lead. Create a unified Purple Team exercise plan coordinating red emulation and blue detection workflows.

### Context & Parameters
- **Objective**: {{objective}}
- **Emulated Attack Technique**: {{attackTechnique}}
- **Tools**: {{requiredTools}}
- **Output Style**: {{outputFormat}}

### Exercise Framework
1. **Red Team Emulation Execution**: Describe step-by-step commands to run using {{requiredTools}} (e.g., Mimikatz, PowerShell, rundll32) to emulate the attack ({{attackTechnique}}).
2. **Blue Team telemetry Validation**: List specific logs (Sysmon Event ID 10, LSASS Access) and telemetry fields to verify in the SIEM database.
3. **Detection Rule Verification**: Provide sample detection queries (e.g., Splunk SPL, KQL, Elastic) to alert on this command string.
4. **Hardening Recommendations**: Provide security architecture controls (e.g., PPL protection, credential guard) to block execution.

Deliver Purple Team exercise plan in {{outputFormat}}.`}];function M(a,i){let e=a;for(const[o,r]of Object.entries(i)){const n=o.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"),c=new RegExp(`{{\\s*${n}\\s*}}`,"g");e=e.replace(c,r||"")}return e}function B(a,i,e,o){let r=a;if(e&&(r=r.filter(n=>n.category===e)),o&&(r=r.filter(n=>n.difficulty===o)),i.trim()){const n=i.toLowerCase().split(/\s+/).filter(Boolean);r=r.filter(c=>{const d=`${c.title} ${c.description} ${c.subcategory} ${c.tags.join(" ")}`.toLowerCase();return n.every(y=>d.includes(y))})}return r}const T="ai_sec_prompt_",h={getFavorites(){try{const a=localStorage.getItem(`${T}favorites`);return a?JSON.parse(a):[]}catch{return[]}},toggleFavorite(a){const i=this.getFavorites(),e=i.indexOf(a);let o=!1;return e>-1?i.splice(e,1):(i.push(a),o=!0),localStorage.setItem(`${T}favorites`,JSON.stringify(i)),o},isFavorite(a){return this.getFavorites().includes(a)},getRecent(){try{const a=localStorage.getItem(`${T}recent`);return a?JSON.parse(a):[]}catch{return[]}},addRecent(a){let i=this.getRecent();i=i.filter(e=>e!==a),i.unshift(a),i.length>10&&i.pop(),localStorage.setItem(`${T}recent`,JSON.stringify(i))}},R={encode(a,i){const e={id:a,vals:i};try{const o=JSON.stringify(e),r=new TextEncoder().encode(o);let n="";return r.forEach(c=>{n+=String.fromCharCode(c)}),btoa(n).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}catch(o){return console.error("Failed to encode URL state",o),""}},decode(a){if(!a)return null;try{let i=a.replace(/-/g,"+").replace(/_/g,"/");for(;i.length%4;)i+="=";const e=atob(i),o=new Uint8Array(e.length);for(let n=0;n<e.length;n++)o[n]=e.charCodeAt(n);const r=new TextDecoder().decode(o);return JSON.parse(r)}catch(i){return console.error("Failed to decode URL state",i),null}}};function j(a,i,e){const o=[];let r=100;const n=e.trim()?e.trim().split(/\s+/).length:0,c=e.length;a.fields.forEach(m=>{const P=(i[m.id]||"").trim();m.required&&!P?(r-=15,o.push({type:"warning",message:`Missing required input: "${m.label}" is highly critical for context.`,fieldId:m.id})):P.length>0&&P.length<15&&m.type==="textarea"&&(r-=5,o.push({type:"tip",message:`Short description for "${m.label}". Provide more context (at least 15 characters) for better LLM output.`,fieldId:m.id}))}),(i.targetTechnology||"").trim()||(r-=10,o.push({type:"warning",message:"No Target Technology specified. LLMs perform best with explicit tech stacks, frameworks, and versions.",fieldId:"targetTechnology"})),(i.constraints||"").trim()===s.constraints.defaultValue&&o.push({type:"info",message:"Using default constraints. Customize these to define your specific testing boundaries.",fieldId:"constraints"}),(i.requiredTools||"").trim()||o.push({type:"tip",message:"Consider defining specific security tools (e.g., Burp, Ghidra) to generate exact tool commands.",fieldId:"requiredTools"}),n<100?(r-=10,o.push({type:"warning",message:"Prompt length is short. Generative responses might lack depth. Consider expanding your context fields."})):n>600&&o.push({type:"info",message:"Excellent granularity. The prompt contains rich system instructions and parameters."}),r=Math.max(0,r);let S="Low";const A=Object.values(i).filter(m=>m.trim().length>0).length;return a.difficulty==="Expert"||A>=6&&n>400?S="Expert":a.difficulty==="Advanced"||A>=4&&n>250?S="High":A>=3&&(S="Medium"),{score:r,complexity:S,wordCount:n,charCount:c,suggestions:o}}let l=v[0],p={},F="",w="",O="",b="all",x="general";const t={themeToggle:document.getElementById("theme-toggle"),kbToggle:document.getElementById("kb-toggle"),kbDrawer:document.getElementById("kb-drawer"),kbClose:document.getElementById("kb-close"),modelOptSelect:document.getElementById("model-opt-select"),searchInput:document.getElementById("search-input"),difficultyFilter:document.getElementById("difficulty-filter"),tabAll:document.getElementById("tab-all"),tabFavs:document.getElementById("tab-favs"),tabRecents:document.getElementById("tab-recents"),categoryButtons:document.getElementById("category-buttons"),templatesContainer:document.getElementById("templates-container"),listHeader:document.getElementById("list-header"),activeCatBadge:document.getElementById("active-category-badge"),activeDiffBadge:document.getElementById("active-difficulty-badge"),activeTitle:document.getElementById("active-template-title"),activeDesc:document.getElementById("active-template-desc"),favToggle:document.getElementById("fav-toggle"),promptForm:document.getElementById("prompt-form"),tabCompiled:document.getElementById("preview-tab-compiled"),tabMarkdown:document.getElementById("preview-tab-markdown"),tabOptimizer:document.getElementById("preview-tab-optimizer"),optimizerCount:document.getElementById("optimizer-count-badge"),contentCompiled:document.getElementById("content-compiled"),contentMarkdown:document.getElementById("content-markdown"),contentOptimizer:document.getElementById("content-optimizer"),rawOutput:document.getElementById("raw-prompt-output"),renderedOutput:document.getElementById("rendered-markdown-output"),scoreCircle:document.getElementById("score-circle"),scoreText:document.getElementById("score-text"),metricComplexity:document.getElementById("metric-complexity"),metricWords:document.getElementById("metric-words"),metricChars:document.getElementById("metric-chars"),suggestionsContainer:document.getElementById("suggestions-container"),btnCopy:document.getElementById("btn-copy"),btnDownloadMd:document.getElementById("btn-download-md"),btnDownloadTxt:document.getElementById("btn-download-txt"),btnShare:document.getElementById("btn-share"),btnExportJson:document.getElementById("btn-export-json"),btnImportJson:document.getElementById("btn-import-json"),importJsonFile:document.getElementById("import-json-file"),toastContainer:document.getElementById("toast-container"),appMain:document.querySelector(".app-main"),mobileBtnSidebar:document.getElementById("mobile-btn-sidebar"),mobileBtnForm:document.getElementById("mobile-btn-form"),mobileBtnPreview:document.getElementById("mobile-btn-preview")};function q(a){let i=a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");return i=i.replace(/^&gt;\s+(.*)$/gm,"<blockquote>$1</blockquote>"),i=i.replace(/^### (.*)$/gm,"<h3>$1</h3>"),i=i.replace(/^## (.*)$/gm,"<h2>$1</h2>"),i=i.replace(/^# (.*)$/gm,"<h1>$1</h1>"),i=i.replace(/```(\w*)\n([\s\S]*?)\n```/g,'<pre><code class="language-$1">$2</code></pre>'),i=i.replace(/`([^`]+)`/g,"<code>$1</code>"),i=i.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),i=i.replace(/^- (.*)$/gm,"<li>$1</li>"),i=i.replace(/\n\n/g,"<br/>"),i}function u(a,i="info"){const e=document.createElement("div");e.className=`toast ${i}`,e.innerHTML=`
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
    <span>${a}</span>
  `,t.toastContainer.appendChild(e),setTimeout(()=>e.remove(),3e3)}function N(){t.categoryButtons.innerHTML=`
    <button class="category-btn ${w===""?"active":""}" data-id="">
      <span class="cat-name">All Categories</span>
      <span class="cat-desc">Browse the entire catalog of prompt tools</span>
    </button>
  `,D.forEach(a=>{const i=document.createElement("button");i.className=`category-btn ${w===a.id?"active":""}`,i.setAttribute("data-id",a.id),i.innerHTML=`
      <span class="cat-name">${a.name}</span>
      <span class="cat-desc">${a.description}</span>
    `,t.categoryButtons.appendChild(i)})}function g(){let a=v;if(b==="favs"){const e=h.getFavorites();a=a.filter(o=>e.includes(o.id)),t.listHeader.textContent=`Favorite Templates (${a.length})`}else b==="recents"?(a=h.getRecent().map(o=>v.find(r=>r.id===o)).filter(Boolean),t.listHeader.textContent=`Recent History (${a.length})`):t.listHeader.textContent="Templates";const i=B(a,F,w,O);if(t.templatesContainer.innerHTML="",i.length===0){t.templatesContainer.innerHTML='<div class="help-text" style="padding:12px; text-align:center;">No templates match your filters.</div>';return}i.forEach(e=>{const o=document.createElement("button");o.className=`template-card ${l.id===e.id?"active":""}`,o.setAttribute("data-id",e.id);const n=h.isFavorite(e.id)?'<span style="color:var(--warning)">★</span> ':"";o.innerHTML=`
      <h4>${n}${e.title}</h4>
      <p>${e.description}</p>
      <div class="card-meta">
        <span class="difficulty-indicator ${e.difficulty}">${e.difficulty}</span>
        <div class="template-tags">
          ${e.tags.slice(0,2).map(c=>`<span class="tag">${c}</span>`).join("")}
        </div>
      </div>
    `,t.templatesContainer.appendChild(o)})}function W(){const a=D.find(e=>e.id===l.category);t.activeCatBadge.textContent=a?a.name:l.category,t.activeDiffBadge.className=`badge-diff ${l.difficulty}`,t.activeDiffBadge.textContent=l.difficulty,t.activeTitle.textContent=l.title,t.activeDesc.textContent=l.description;const i=h.isFavorite(l.id);t.favToggle.classList.toggle("active",i),t.promptForm.innerHTML="",l.fields.forEach(e=>{const o=document.createElement("div");o.className="form-group",o.setAttribute("data-field-id",e.id);const r=document.createElement("label");r.setAttribute("for",`input-${e.id}`),r.innerHTML=`${e.label} ${e.required?'<span class="required-star">*</span>':""}`,o.appendChild(r);const n=p[e.id]!==void 0?p[e.id]:e.defaultValue||"";if(e.type==="textarea"){const c=document.createElement("textarea");c.id=`input-${e.id}`,c.placeholder=e.placeholder||"",c.value=n,c.required=!!e.required,o.appendChild(c)}else if(e.type==="select"&&e.options){const c=document.createElement("select");c.id=`input-${e.id}`,c.required=!!e.required,e.options.forEach(d=>{const y=document.createElement("option");y.value=d,y.textContent=d,d===n&&(y.selected=!0),c.appendChild(y)}),o.appendChild(c)}else{const c=document.createElement("input");c.type="text",c.id=`input-${e.id}`,c.placeholder=e.placeholder||"",c.value=n,c.required=!!e.required,o.appendChild(c)}if(e.helpText){const c=document.createElement("span");c.className="help-text",c.textContent=e.helpText,o.appendChild(c)}t.promptForm.appendChild(o)})}function k(){let a=M(l.template,p);x==="claude"?a=a+`

### Formatting Directive
Optimize the output specifically for Claude. Frame the analysis inputs using explicit XML tagging structure (<context>, <scope>, <constraints>, <technology>, and <tools>) to ensure strict delimiter parsing and prevent prompt leakage.`:x==="reasoning"?a=`[Reasoning Model Instructions: Think exhaustively and step-by-step before answering. Do not rush to a response. Extensively analyze edge-case attack surfaces, verify proof-of-concept steps, and review rules of engagement before producing your output.]

`+a:x==="agent"&&(a=a+`

### Execution Directive
This prompt is designed for agentic executions. The output MUST be strictly valid JSON conforming to the requested schema guidelines. Do not output any chat preambles, greetings, or conversational postscripts. Return ONLY raw JSON data.`),t.rawOutput.value=a,t.renderedOutput.innerHTML=q(a);const i=j(l,p,a);t.optimizerCount.textContent=i.suggestions.length.toString(),t.optimizerCount.style.display=i.suggestions.length>0?"inline":"none";const e=i.score;if(t.scoreText.textContent=`${e}%`,t.scoreCircle.setAttribute("stroke-dasharray",`${e}, 100`),e>80?t.scoreCircle.setAttribute("stroke","var(--accent)"):e>50?t.scoreCircle.setAttribute("stroke","var(--warning)"):t.scoreCircle.setAttribute("stroke","var(--danger)"),t.metricComplexity.textContent=i.complexity,t.metricComplexity.className=`difficulty-indicator ${i.complexity}`,t.metricWords.textContent=i.wordCount.toString(),t.metricChars.textContent=i.charCount.toString(),t.suggestionsContainer.innerHTML="",i.suggestions.length===0){t.suggestionsContainer.innerHTML=`
      <li class="help-text" style="text-align:center; padding:16px;">
        ✨ Excellent job! Your prompt meets all fidelity heuristics.
      </li>
    `;return}i.suggestions.forEach(o=>{const r=document.createElement("li");r.className=`suggestion-item ${o.type}`;let n="ℹ️";o.type==="warning"&&(n="⚠️"),o.type==="tip"&&(n="💡"),r.innerHTML=`
      <span class="suggestion-icon">${n}</span>
      <div>${o.message}</div>
    `,o.fieldId&&r.addEventListener("click",()=>{window.innerWidth<1024&&f("form");const c=document.getElementById(`input-${o.fieldId}`);c&&(c.focus(),c.scrollIntoView({behavior:"smooth",block:"center"}))}),t.suggestionsContainer.appendChild(r)})}function I(){W(),k()}function C(){const a=t.rawOutput.value;navigator.clipboard.writeText(a).then(()=>{u("Prompt copied to clipboard!");const i=t.btnCopy.querySelector("span"),e=i?i.textContent:"Copy Prompt";t.btnCopy.classList.add("copied"),i&&(i.textContent="Copied!"),setTimeout(()=>{t.btnCopy.classList.remove("copied"),i&&(i.textContent=e)},2e3)}).catch(()=>u("Failed to copy. Copy manually.","warning"))}function E(){const a=R.encode(l.id,p);if(a){const i=`${window.location.origin}${window.location.pathname}#${a}`;window.location.hash=a,navigator.clipboard.writeText(i).then(()=>u("Shareable link copied to clipboard!")).catch(()=>u("Failed to copy share link.","warning"))}}function L(a){const i=t.rawOutput.value,e=a==="md"?"text/markdown":"text/plain",o=a==="md"?"md":"txt",r=`${l.id}_prompt.${o}`,n=new Blob([i],{type:e}),c=URL.createObjectURL(n),d=document.createElement("a");d.href=c,d.download=r,document.body.appendChild(d),d.click(),document.body.removeChild(d),URL.revokeObjectURL(c),u(`Downloaded ${o.toUpperCase()} prompt file.`)}function $(){const a={templateId:l.id,values:p,exportedAt:new Date().toISOString()},i=JSON.stringify(a,null,2),e=new Blob([i],{type:"application/json"}),o=URL.createObjectURL(e),r=document.createElement("a");r.href=o,r.download=`sentinel_${l.id}_config.json`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(o),u("Configuration exported as JSON.")}function z(a){const i=new FileReader;i.onload=e=>{var o;try{const r=(o=e.target)==null?void 0:o.result,n=JSON.parse(r);if(n&&n.templateId&&n.values){const c=v.find(d=>d.id===n.templateId);c?(l=c,p=n.values,h.addRecent(c.id),g(),I(),u("Configuration loaded successfully.")):u("Unknown template type in JSON.","warning")}else u("Invalid JSON structure.","warning")}catch{u("Failed to parse JSON file.","warning")}},i.readAsText(a)}function f(a){t.appMain.classList.remove("show-sidebar","show-form","show-preview"),t.mobileBtnSidebar.classList.remove("active"),t.mobileBtnForm.classList.remove("active"),t.mobileBtnPreview.classList.remove("active"),a==="sidebar"?(t.appMain.classList.add("show-sidebar"),t.mobileBtnSidebar.classList.add("active")):a==="form"?(t.appMain.classList.add("show-form"),t.mobileBtnForm.classList.add("active")):a==="preview"&&(t.appMain.classList.add("show-preview"),t.mobileBtnPreview.classList.add("active"))}function J(){var i;t.themeToggle.addEventListener("click",()=>{const e=document.documentElement.classList.toggle("dark");document.documentElement.classList.toggle("light",!e),localStorage.setItem("theme",e?"dark":"light")}),t.modelOptSelect.addEventListener("change",e=>{x=e.target.value,k()}),t.kbToggle.addEventListener("click",()=>t.kbDrawer.classList.add("open")),t.kbClose.addEventListener("click",()=>t.kbDrawer.classList.remove("open")),(i=t.kbDrawer.querySelector(".drawer-overlay"))==null||i.addEventListener("click",()=>{t.kbDrawer.classList.remove("open")}),t.searchInput.addEventListener("input",e=>{F=e.target.value,g()}),t.difficultyFilter.addEventListener("change",e=>{O=e.target.value,g()}),t.tabAll.addEventListener("click",()=>{b="all",t.tabAll.classList.add("active"),t.tabFavs.classList.remove("active"),t.tabRecents.classList.remove("active"),g()}),t.tabFavs.addEventListener("click",()=>{b="favs",t.tabAll.classList.remove("active"),t.tabFavs.classList.add("active"),t.tabRecents.classList.remove("active"),g()}),t.tabRecents.addEventListener("click",()=>{b="recents",t.tabAll.classList.remove("active"),t.tabFavs.classList.remove("active"),t.tabRecents.classList.add("active"),g()}),t.categoryButtons.addEventListener("click",e=>{const o=e.target.closest(".category-btn");o&&(w=o.getAttribute("data-id")||"",t.categoryButtons.querySelectorAll(".category-btn").forEach(r=>r.classList.remove("active")),o.classList.add("active"),g())}),t.templatesContainer.addEventListener("click",e=>{const o=e.target.closest(".template-card");if(o){const r=o.getAttribute("data-id")||"",n=v.find(c=>c.id===r);n&&(l=n,p={},h.addRecent(n.id),t.templatesContainer.querySelectorAll(".template-card").forEach(c=>c.classList.remove("active")),o.classList.add("active"),I(),window.innerWidth<1024&&f("form"))}}),t.favToggle.addEventListener("click",()=>{const e=h.toggleFavorite(l.id);t.favToggle.classList.toggle("active",e),g(),u(e?"Added template to favorites.":"Removed template from favorites.")}),t.promptForm.addEventListener("input",e=>{const o=e.target,r=o.id.replace("input-","");p[r]=o.value,k()});const a=e=>{t.tabCompiled.classList.toggle("active",e==="compiled"),t.tabMarkdown.classList.toggle("active",e==="markdown"),t.tabOptimizer.classList.toggle("active",e==="optimizer"),t.contentCompiled.classList.toggle("active",e==="compiled"),t.contentMarkdown.classList.toggle("active",e==="markdown"),t.contentOptimizer.classList.toggle("active",e==="optimizer")};t.tabCompiled.addEventListener("click",()=>a("compiled")),t.tabMarkdown.addEventListener("click",()=>a("markdown")),t.tabOptimizer.addEventListener("click",()=>a("optimizer")),t.btnCopy.addEventListener("click",C),t.btnShare.addEventListener("click",E),t.btnDownloadMd.addEventListener("click",()=>L("md")),t.btnDownloadTxt.addEventListener("click",()=>L("txt")),t.btnExportJson.addEventListener("click",$),t.btnImportJson.addEventListener("click",()=>t.importJsonFile.click()),t.importJsonFile.addEventListener("change",e=>{const o=e.target.files;o&&o.length>0&&z(o[0])}),document.addEventListener("keydown",e=>{var o,r;e.ctrlKey&&e.key==="/"&&(e.preventDefault(),t.searchInput.focus()),e.ctrlKey&&e.key==="c"&&((o=document.activeElement)==null?void 0:o.tagName)!=="INPUT"&&((r=document.activeElement)==null?void 0:r.tagName)!=="TEXTAREA"&&(e.preventDefault(),C()),e.ctrlKey&&e.key==="s"&&(e.preventDefault(),E()),e.key==="Escape"&&t.kbDrawer.classList.remove("open")}),t.mobileBtnSidebar.addEventListener("click",()=>f("sidebar")),t.mobileBtnForm.addEventListener("click",()=>f("form")),t.mobileBtnPreview.addEventListener("click",()=>f("preview")),t.templatesContainer.addEventListener("mousemove",e=>{const o=e.target.closest(".template-card");if(o){const r=o.getBoundingClientRect(),n=e.clientX-r.left,c=e.clientY-r.top;o.style.setProperty("--mouse-x",`${n}px`),o.style.setProperty("--mouse-y",`${c}px`)}})}function H(){window.innerWidth<1024?f("sidebar"):t.appMain.classList.add("show-sidebar","show-form","show-preview");const a=localStorage.getItem("theme"),i=window.matchMedia("(prefers-color-scheme: dark)").matches,e=a==="dark"||!a&&i;document.documentElement.classList.toggle("dark",e),document.documentElement.classList.toggle("light",!e);let o=!1;if(window.location.hash){const r=window.location.hash.substring(1),n=R.decode(r);if(n&&n.id){const c=v.find(d=>d.id===n.id);c&&(l=c,p=n.vals,o=!0,h.addRecent(c.id),window.innerWidth<1024&&f("form"))}}o||h.addRecent(l.id),N(),g(),I(),J(),"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("./sw.js").then(r=>console.log("Service Worker registered successfully:",r.scope)).catch(r=>console.error("Service Worker registration failed:",r))})}window.addEventListener("DOMContentLoaded",H);
