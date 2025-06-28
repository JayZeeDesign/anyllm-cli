/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ContentGenerator,
  ContentGeneratorConfig,
} from './contentGenerator.js';
import {
  GenerateContentParameters,
  GenerateContentResponse,
  CountTokensParameters,
  CountTokensResponse,
  EmbedContentParameters,
  EmbedContentResponse,
  Part,
  FinishReason,
} from '@google/genai';
import { generateText, tool } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
// Removed unused imports since we're not executing tools directly
import { Config } from '../config/config.js';
import { ToolRegistry } from '../tools/tool-registry.js';

/**
 * AI SDK-based ContentGenerator for Claude with tool calling support
 * Implements the ContentGenerator interface using Vercel AI SDK
 */
export class AISDKContentGenerator implements ContentGenerator {
  private config?: Config;
  private toolRegistry?: ToolRegistry;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(config: ContentGeneratorConfig, geminiConfig?: Config) {
    this.config = geminiConfig;
  }

  private async getToolRegistry(): Promise<ToolRegistry | undefined> {
    return this.config?.getToolRegistry?.();
  }

  async generateContent(request: GenerateContentParameters): Promise<GenerateContentResponse> {
    try {
      // Extract prompt from request (simplified approach)
      const prompt = this.extractPromptFromRequest(request);
      const tools = await this.convertToolsForAISDK(request.config?.tools);
      
      console.log('Sending request to Claude with prompt and', Object.keys(tools).length, 'tools');

      const result = await generateText({
        model: anthropic(this.config?.getModel?.() || 'claude-3-5-sonnet-20241022'),
        prompt,
        tools: Object.keys(tools).length > 0 ? tools : undefined,
        maxSteps: 1, // Only allow one step at a time so CLI can handle tool execution
      });

      console.log('Claude response received');

      // Convert AI SDK response to Gemini format
      return this.buildGeminiResponse(result);
    } catch (error) {
      throw new Error(
        `Claude generateContent failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async generateContentStream(request: GenerateContentParameters): Promise<AsyncGenerator<GenerateContentResponse>> {
    try {
      // Extract prompt from request (simplified approach)
      const prompt = this.extractPromptFromRequest(request);
      const tools = await this.convertToolsForAISDK(request.config?.tools);
      
      console.log('Sending streaming request to Claude with prompt and', Object.keys(tools).length, 'tools');

      const result = await generateText({
        model: anthropic(this.config?.getModel?.() || 'claude-3-5-sonnet-20241022'),
        prompt,
        tools: Object.keys(tools).length > 0 ? tools : undefined,
        maxSteps: 1, // Only allow one step at a time so CLI can handle tool execution
      });

      console.log('Claude streaming response received');

      // Convert to Gemini response format and yield as a single chunk
      const geminiResponse = this.buildGeminiResponse(result);
      
      // Return a properly structured stream
      async function* claudeStream() {
        yield geminiResponse;
      }
      
      return claudeStream();
    } catch (error) {
      // Return an error by throwing from the main function
      throw new Error(
        `Claude generateContentStream failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async countTokens(request: CountTokensParameters): Promise<CountTokensResponse> {
    // Simple token estimation for Claude (roughly 4 chars per token)
    // This is a rough approximation since we don't have direct access to Claude's tokenizer
    const prompt = this.extractPromptFromRequest(request);
    const estimatedTokens = Math.ceil(prompt.length / 4);
    
    return {
      totalTokens: estimatedTokens
    };
  }

  async embedContent(_request: EmbedContentParameters): Promise<EmbedContentResponse> {
    throw new Error('Embeddings not supported by Claude');
  }

  /**
   * Extract prompt text from Gemini request format
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private extractPromptFromRequest(request: GenerateContentParameters): string {
    if (!request.contents) {
      return '';
    }

    // Handle ContentListUnion - could be array or single item
    const contentsArray = Array.isArray(request.contents) ? request.contents : [request.contents];
    
    // Build conversation from all contents
    const conversationParts: string[] = [];
    
    for (const content of contentsArray) {
      if (typeof content === 'string') {
        conversationParts.push(`User: ${content}`);
        continue;
      }
      
      if (content && typeof content === 'object' && 'parts' in content) {
        const role = content.role === 'model' ? 'Assistant' : 'User';
        const textParts = content.parts?.filter((part) => 
          part && typeof part === 'object' && 'text' in part && part.text
        ) || [];
        
        if (textParts.length > 0) {
          const text = textParts.map((part) => (part as { text: string }).text).join('');
          conversationParts.push(`${role}: ${text}`);
        }
        
        // Handle function calls in conversation
        const functionCalls = content.parts?.filter((part) => 
          part && typeof part === 'object' && 'functionCall' in part
        ) || [];
        
        for (const part of functionCalls) {
          const call = (part as any).functionCall;
          conversationParts.push(`Assistant called tool: ${call.name} with args: ${JSON.stringify(call.args)}`);
        }
        
        // Handle function responses  
        const functionResponses = content.parts?.filter((part) => 
          part && typeof part === 'object' && 'functionResponse' in part
        ) || [];
        
        for (const part of functionResponses) {
          const response = (part as any).functionResponse;
          conversationParts.push(`Tool ${response.name} returned: ${JSON.stringify(response.response)}`);
        }
      }
    }
    
    return conversationParts.join('\n\n') || 'Hello';
  }

  /**
   * Convert Gemini tools to AI SDK format
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async convertToolsForAISDK(geminiTools: any): Promise<Record<string, any>> {
    const tools: Record<string, any> = {};
    
    if (!geminiTools || !Array.isArray(geminiTools)) {
      return tools;
    }
    
     // Note: toolRegistry not needed since we're not executing tools here
    
    for (const geminiTool of geminiTools) {
      if (!geminiTool.functionDeclarations) continue;
      
      for (const func of geminiTool.functionDeclarations) {
        tools[func.name] = tool({
          description: func.description || func.name,
          parameters: this.buildZodSchema(func.parameters),
          execute: async (args: Record<string, unknown>) => {
            // Debug logging
            console.log(`[AISDKContentGenerator] Tool call requested: ${func.name} with args:`, args);
            
            // Don't actually execute the tool here - let the CLI handle it
            // Just return a placeholder so the tool call gets included in the response
                         return {
               status: 'pending',
               message: `Tool ${func.name} will be executed by CLI`,
               args
             };
          }
        });
      }
    }
    
    return tools;
  }

  /**
   * Build Zod schema from Gemini function parameters
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private buildZodSchema(schema: any): z.ZodSchema {
    if (!schema || schema.type !== 'object') {
      return z.object({});
    }
    
    const shape: Record<string, z.ZodSchema> = {};
    
    if (schema.properties) {
      for (const [key, prop] of Object.entries(schema.properties)) {
        const propSchema = prop as any;
        let zodType: z.ZodSchema = z.any();
        
        if (propSchema.type === 'string') {
          zodType = z.string();
        } else if (propSchema.type === 'number') {
          zodType = z.number();
        } else if (propSchema.type === 'boolean') {
          zodType = z.boolean();
        } else if (propSchema.type === 'array') {
          zodType = z.array(z.any());
        }
        
        if (propSchema.description) {
          zodType = zodType.describe(propSchema.description);
        }
        
        if (!schema.required?.includes(key)) {
          zodType = zodType.optional();
        }
        
        shape[key] = zodType;
      }
    }
    
    return z.object(shape);
  }

  /**
   * Build Gemini response from AI SDK result
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private buildGeminiResponse(result: any): GenerateContentResponse {
    const response = new GenerateContentResponse();
    const parts: Part[] = [];
    
    // Add text content
    if (result.text) {
      parts.push({ text: result.text });
    }
    
    // Add tool calls if present
    if (result.toolCalls?.length > 0) {
      for (const toolCall of result.toolCalls) {
        parts.push({
          functionCall: {
            name: toolCall.toolName,
            args: toolCall.args
          }
        });
      }
    }
    
    // Add tool results if present 
    if (result.toolResults?.length > 0) {
      for (const toolResult of result.toolResults) {
        parts.push({
          functionResponse: {
            name: toolResult.toolCallId,
            response: toolResult.result
          }
        });
      }
    }
    
    response.candidates = [{
      content: {
        parts,
        role: 'model'
      },
      finishReason: 'STOP' as FinishReason,
      index: 0,
      safetyRatings: []
    }];
    
    response.usageMetadata = result.usage ? {
      promptTokenCount: result.usage.promptTokens || 0,
      candidatesTokenCount: result.usage.completionTokens || 0,
      totalTokenCount: result.usage.totalTokens || 0,
    } : undefined;
    
    return response;
  }
}

/**
 * Factory function to create AI SDK ContentGenerator for Claude
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createAISDKContentGenerator(
  config: ContentGeneratorConfig,
  geminiConfig?: any,
): AISDKContentGenerator {
  if (!config.apiKey) {
    throw new Error('API key is required for Claude');
  }

  // Set API key for Anthropic SDK
  process.env.ANTHROPIC_API_KEY = config.apiKey;
  
  return new AISDKContentGenerator(config, geminiConfig);
} 