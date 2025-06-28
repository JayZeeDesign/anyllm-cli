/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, Newline, Text, useInput } from 'ink';
import { Colors } from '../colors.js';

interface ClaudePrivacyNoticeProps {
  onExit: () => void;
}

export const ClaudePrivacyNotice = ({ onExit }: ClaudePrivacyNoticeProps) => {
  useInput((input, key) => {
    if (key.escape) {
      onExit();
    }
  });

  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text bold color={Colors.AccentPurple}>
        Claude API Key Notice
      </Text>
      <Newline />
      <Text>
        By using the Claude API<Text color={Colors.AccentBlue}>[1]</Text>,
        Anthropic Console
        <Text color={Colors.AccentRed}>[2]</Text>, and the other Anthropic
        developer services that reference these terms (collectively, the
        &quot;APIs&quot; or &quot;Services&quot;), you are agreeing to Anthropic&apos;s
        Terms of Service (the &quot;Terms&quot;)
        <Text color={Colors.AccentGreen}>[3]</Text>, and Anthropic&apos;s
        Privacy Policy (the &quot;Privacy Policy&quot;)
        <Text color={Colors.AccentPurple}>[4]</Text>.
      </Text>
      <Newline />
      <Text>
        <Text color={Colors.AccentBlue}>[1]</Text>{' '}
        https://docs.anthropic.com/en/api/getting-started
      </Text>
      <Text>
        <Text color={Colors.AccentRed}>[2]</Text> https://console.anthropic.com/
      </Text>
      <Text>
        <Text color={Colors.AccentGreen}>[3]</Text>{' '}
        https://www.anthropic.com/terms
      </Text>
      <Text>
        <Text color={Colors.AccentPurple}>[4]</Text>{' '}
        https://www.anthropic.com/privacy
      </Text>
      <Newline />
      <Text color={Colors.Gray}>Press Esc to exit.</Text>
    </Box>
  );
}; 