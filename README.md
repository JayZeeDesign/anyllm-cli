# AnyLLM CLI

A powerful multi-model AI CLI that supports both Gemini and Claude models with full tool integration.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Build the project
npm run build

# 3. Start the CLI
npm start
```

## Environment Setup

Create a `.env` file in the project root with your API keys:

```env
# For Claude models (Anthropic)
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here

# For Gemini models (Google AI Studio)
GEMINI_API_KEY=your-gemini-api-key-here

# For Vertex AI (Google Cloud - optional)
GOOGLE_CLOUD_PROJECT=your-gcp-project
GOOGLE_CLOUD_LOCATION=us-central1
```

## Changing Models

### Via Command Line
```bash
# Use Claude Sonnet 4
npm start -- --model claude-sonnet-4-20250514

# Use Claude 3.5 Sonnet
npm start -- --model claude-3-5-sonnet-20241022

# Use Gemini 2.5 Pro (default)
npm start -- --model gemini-2.5-pro
```

### Via `/auth` Command
1. Start the CLI: `npm start`
2. Type `/auth` and select your preferred authentication method
3. The model will automatically switch based on your auth selection

## Supported Models

### Claude Models (Anthropic)
- `claude-sonnet-4-20250514` - Latest Claude 4 Sonnet
- `claude-3-5-sonnet-20241022` - Claude 3.5 Sonnet
- `claude-3-5-haiku-20241022` - Claude 3.5 Haiku
- `claude-3-opus-20240229` - Claude 3 Opus

### Gemini Models (Google)
- `gemini-2.5-pro` - Latest Gemini Pro (default)
- `gemini-2.5-flash` - Faster Gemini model
- `gemini-1.5-pro` - Previous generation Pro

## Available Tools

The CLI includes powerful tools for both model providers:
- 📁 File operations (read, write, edit)
- 🖥️ Shell command execution
- 🔍 Web search and fetch
- 🧠 Memory management
- 📊 Project analysis
- 🔧 And many more...

## Usage

```bash
# Ask questions
> How do I optimize this Python code?

# Read files
> @src/main.py What does this file do?

# Execute commands
> !ls -la

# Get help
> /help
```

## Development

```bash
# Run tests
npm test

# Development mode with auto-rebuild
npm run dev

# Type checking
npm run typecheck
```

## API Keys

- **Claude**: Get your API key from [Anthropic Console](https://console.anthropic.com/)
- **Gemini**: Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- **Vertex AI**: Set up through [Google Cloud Console](https://console.cloud.google.com/)

---

Built with ❤️ using Vercel AI SDK for multi-model support.
