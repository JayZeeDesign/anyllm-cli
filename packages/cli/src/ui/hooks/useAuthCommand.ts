/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect } from 'react';
import { LoadedSettings, SettingScope } from '../../config/settings.js';
import {
  AuthType,
  Config,
  clearCachedCredentialFile,
  getErrorMessage,
  CLAUDE_MODELS,
} from '@google/gemini-cli-core';

async function performAuthFlow(authMethod: AuthType, config: Config) {
  await config.refreshAuth(authMethod);
  console.log(`Authenticated via "${authMethod}".`);
}

export const useAuthCommand = (
  settings: LoadedSettings,
  setAuthError: (error: string | null) => void,
  config: Config,
) => {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(
    settings.merged.selectedAuthType === undefined,
  );

  const openAuthDialog = useCallback(() => {
    setIsAuthDialogOpen(true);
  }, []);

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const authFlow = async () => {
      if (isAuthDialogOpen || !settings.merged.selectedAuthType) {
        return;
      }

      try {
        setIsAuthenticating(true);
        await performAuthFlow(
          settings.merged.selectedAuthType as AuthType,
          config,
        );
      } catch (e) {
        setAuthError(`Failed to login. Message: ${getErrorMessage(e)}`);
        openAuthDialog();
      } finally {
        setIsAuthenticating(false);
      }
    };

    void authFlow();
  }, [isAuthDialogOpen, settings, config, setAuthError, openAuthDialog]);

  const handleAuthSelect = useCallback(
    async (authMethod: string | undefined, scope: SettingScope) => {
      if (authMethod) {
        await clearCachedCredentialFile();
        
        // Update the underlying model BEFORE setting auth type (which triggers refreshAuth)
        if (authMethod === AuthType.USE_CLAUDE) {
          // Update the original model property so refreshAuth uses the Claude model
          config.updateBaseModel(CLAUDE_MODELS.CLAUDE_SONNET_4);
          console.log(`Automatically switched to ${CLAUDE_MODELS.CLAUDE_SONNET_4} for Claude authentication.`);
        } else if (authMethod === AuthType.USE_GEMINI || authMethod === AuthType.USE_VERTEX_AI || authMethod === AuthType.LOGIN_WITH_GOOGLE_PERSONAL) {
          // Switch back to default Gemini model if coming from Claude
          const currentModel = config.getModel();
          if (Object.values(CLAUDE_MODELS).includes(currentModel)) {
            config.updateBaseModel('gemini-2.5-pro');
            console.log('Automatically switched to gemini-2.5-pro for Gemini authentication.');
          }
        }
        
        settings.setValue(scope, 'selectedAuthType', authMethod);
      }
      setIsAuthDialogOpen(false);
      setAuthError(null);
    },
    [settings, setAuthError, config],
  );

  const handleAuthHighlight = useCallback((_authMethod: string | undefined) => {
    // For now, we don't do anything on highlight.
  }, []);

  const cancelAuthentication = useCallback(() => {
    setIsAuthenticating(false);
  }, []);

  return {
    isAuthDialogOpen,
    openAuthDialog,
    handleAuthSelect,
    handleAuthHighlight,
    isAuthenticating,
    cancelAuthentication,
  };
};
