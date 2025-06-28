# Multi-Model AI CLI (Gemini + Claude)

[![Gemini CLI CI](https://github.com/google-gemini/gemini-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/google-gemini/gemini-cli/actions/workflows/ci.yml)

![Gemini CLI Screenshot](./docs/assets/gemini-screenshot.png)

This repository contains an enhanced version of the Gemini CLI that supports **multiple AI models** - a command-line AI workflow tool that connects to your tools, understands your code and accelerates your workflows using **both Gemini and Claude models**.

## 🚀 Supported AI Models

- **🔷 Google Gemini Models** (default)
  - `gemini-2.5-pro` (default)
  - `gemini-2.5-flash`
  - `gemini-1.5-pro`
  - `gemini-1.5-flash`

- **🔶 Anthropic Claude Models** ⚡ NEW!
  - `claude-sonnet-4-20250514` (Claude 4)
  - `claude-3-5-sonnet-20241022` 
  - `claude-3-5-haiku-20241022`
  - `claude-3-opus-20240229`

With this Multi-Model CLI you can:

- **Switch between Gemini and Claude models** seamlessly using `--model` flag
- Query and edit large codebases in and beyond context windows (1M+ tokens for Gemini, 200k+ for Claude)
- Generate new apps from PDFs or sketches, using multimodal capabilities
- Automate operational tasks, like querying pull requests or handling complex rebases
- Use tools and MCP servers to connect new capabilities, including [media generation with Imagen, Veo or Lyria](https://github.com/GoogleCloudPlatform/vertex-ai-creative-studio/tree/main/experiments/mcp-genmedia)
- Ground your queries with the [Google Search](https://ai.google.dev/gemini-api/docs/grounding) tool, built in to Gemini
- **Access Claude's advanced reasoning** for complex coding and analysis tasks

## Quickstart

1. **Prerequisites:** Ensure you have [Node.js version 18](https://nodejs.org/en/download) or higher installed.
2. **Run the CLI:** Execute the following command in your terminal:

   ```bash
   npx https://github.com/google-gemini/gemini-cli
   ```

   Or install it with:

   ```bash
   npm install -g @google/gemini-cli
   gemini
   ```

3. **Pick a color theme**
4. **Authenticate:** When prompted, sign in with your personal Google account. This will grant you up to 60 model requests per minute and 1,000 model requests per day using Gemini.

You are now ready to use the Multi-Model CLI with Gemini models!

## 🔑 Authentication Setup

### For Gemini Models (Google)

#### Option 1: Personal Google Account (Quickstart)
1. Run `gemini` and sign in when prompted
2. Get 60 requests/minute, 1,000 requests/day for free

#### Option 2: API Key (Advanced/Higher Limits)
1. Generate a key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Set it as an environment variable:
   ```bash
   export GEMINI_API_KEY="YOUR_API_KEY"
   ```

### For Claude Models (Anthropic) ⚡ NEW!

1. **Get Claude API Key:** Sign up at [Anthropic Console](https://console.anthropic.com/)
2. **Set Environment Variable:**
   ```bash
   export ANTHROPIC_API_KEY="YOUR_CLAUDE_API_KEY"
   ```
3. **Use Claude Models:**
   ```bash
   # Use Claude Sonnet 4 (most capable)
   gemini --model claude-sonnet-4-20250514 "Analyze this codebase"
   
   # Use Claude 3.5 Sonnet (balanced)
   gemini --model claude-3-5-sonnet-20241022 "Help me debug this function"
   
   # Use Claude Haiku (fast)
   gemini --model claude-3-5-haiku-20241022 "Quick code review please"
   ```

## 🎯 Model Selection Examples

### Using Gemini (Default)
```bash
# Uses default Gemini model
gemini "Explain this React component"

# Explicit Gemini model selection
gemini --model gemini-2.5-pro "Generate a full-stack app"
```

### Using Claude Models ⚡ NEW!
```bash
# Claude 4 for complex reasoning
gemini --model claude-sonnet-4-20250514 "Architect a microservices system"

# Claude 3.5 Sonnet for balanced performance
gemini --model claude-3-5-sonnet-20241022 "Refactor this legacy code"

# Claude Haiku for quick tasks
gemini --model claude-3-5-haiku-20241022 "Fix this bug quickly"
```

## Examples

Once the CLI is running, you can start interacting with either Gemini or Claude models from your shell.

### Start a project from a new directory:

```sh
cd new-project/

# Using Gemini (default)
gemini
> Write me a Discord bot that answers questions using a FAQ.md file

# Using Claude
gemini --model claude-3-5-sonnet-20241022
> Write me a Discord bot that answers questions using a FAQ.md file
```

### Work with an existing project:

```sh
git clone https://github.com/google-gemini/gemini-cli
cd gemini-cli

# Compare model responses
gemini --model gemini-2.5-pro
> Give me a summary of all changes that went in yesterday

gemini --model claude-sonnet-4-20250514  
> Give me a summary of all changes that went in yesterday
```

### Model-Specific Use Cases:

#### 🔷 **Best for Gemini:**
- Large codebase analysis (1M+ token context)
- Multimodal tasks (images, PDFs)
- Google Search integration
- Real-time web information

#### 🔶 **Best for Claude:**
- Complex reasoning and analysis
- Advanced code architecture 
- Detailed explanations
- Creative problem solving

For other authentication methods, including Google Workspace accounts, see the [authentication](./docs/cli/authentication.md) guide.

## Popular tasks

### Explore a new codebase

Start by `cd`ing into an existing or newly-cloned repository and running `gemini`.

```text
> Describe the main pieces of this system's architecture.
```

```text
> What security mechanisms are in place?
```

### Work with your existing code

```text
> Implement a first draft for GitHub issue #123.
```

```text
> Help me migrate this codebase to the latest version of Java. Start with a plan.
```

### Compare Model Responses

```bash
# Get Gemini's perspective
gemini --model gemini-2.5-pro "Design a scalable chat system"

# Get Claude's perspective  
gemini --model claude-sonnet-4-20250514 "Design a scalable chat system"
```

### Automate your workflows

Use MCP servers to integrate your local system tools with your enterprise collaboration suite.

```text
> Make me a slide deck showing the git history from the last 7 days, grouped by feature and team member.
```

```text
> Make a full-screen web app for a wall display to show our most interacted-with GitHub issues.
```

### Interact with your system

```text
> Convert all the images in this directory to png, and rename them to use dates from the exif data.
```

```text
> Organise my PDF invoices by month of expenditure.
```

### Next steps

- Learn how to [contribute to or build from the source](./CONTRIBUTING.md).
- Explore the available **[CLI Commands](./docs/cli/commands.md)**.
- If you encounter any issues, review the **[Troubleshooting guide](./docs/troubleshooting.md)**.
- For more comprehensive documentation, see the [full documentation](./docs/index.md).
- Take a look at some [popular tasks](#popular-tasks) for more inspiration.

### Troubleshooting

Head over to the [troubleshooting](docs/troubleshooting.md) guide if you're
having issues.

## 🔧 Technical Details

This enhanced CLI uses:
- **Gemini models**: Direct Google GenAI API integration
- **Claude models**: Vercel AI SDK with Anthropic provider for seamless tool calling
- **Unified interface**: Same commands and tools work with both model families
- **Automatic model detection**: CLI auto-detects model type and routes accordingly

## Terms of Service and Privacy Notice

For details on the terms of service and privacy notice applicable to your use of this Multi-Model CLI, see the [Terms of Service and Privacy Notice](./docs/tos-privacy.md).

**Note**: When using Claude models, you're also subject to [Anthropic's Terms of Service](https://www.anthropic.com/terms) and [Privacy Policy](https://www.anthropic.com/privacy).
