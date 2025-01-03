"use client";
import { useActions, useUIState } from "ai/rsc";
import React, { useCallback, useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputSubmitEditingEventData,
} from "react-native";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { UserMessage } from "./user-message";
import type { AI } from "./ai-context";
import { FirstSuggestions } from "./first-suggestions";
import { BlurView } from "expo-blur";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const nanoid = () => String(Math.random().toString(36).slice(2));

export function ChatToolbarInner({
  messages,
  setMessages,
  onSubmit,
  disabled,
}: {
  messages: ReturnType<typeof useUIState<typeof AI>>[0];
  setMessages: ReturnType<typeof useUIState<typeof AI>>[1];
  onSubmit: ReturnType<typeof useActions<typeof AI>>["onSubmit"];
  disabled?: boolean;
}) {
  const [, setInputValue] = useState("");
  const textInput = useRef<TextInput>(null);
  const { bottom } = useSafeAreaInsets();
  const keyboard = useAnimatedKeyboard();

  const translateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -keyboard.height.value }],
    };
  }, [bottom]);

  const blurStyle = useAnimatedStyle(() => {
    const assumedKeyboardHeight = 100;

    const inverse = Math.max(
      0,
      Math.min(
        1,
        (assumedKeyboardHeight - keyboard.height.value) / assumedKeyboardHeight
      )
    );

    return {
      paddingBottom: 8 + bottom * inverse,
    };
  }, [bottom]);

  const onSubmitMessage = useCallback(
    (value: string) => {
      if (value.trim() === "") {
        return;
      }

      setTimeout(() => {
        textInput.current?.clear();
      });

      // Add user message to UI state
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: nanoid(),
          display: <UserMessage>{value}</UserMessage>,
        },
      ]);

      // Submit and get response message
      onSubmit(value).then((responseMessage) => {
        setMessages((currentMessages) => [...currentMessages, responseMessage]);
      });

      setInputValue("");
    },
    [textInput, setMessages, onSubmit, setInputValue]
  );

  const onSubmitEditing = useCallback(
    (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      onSubmitMessage(e.nativeEvent.text);
    },
    [onSubmitMessage]
  );
  //   const [messages] = useUIState<typeof AI>();

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "transparent",
          gap: 8,
        },
        translateStyle,
      ]}
    >
      {!disabled && messages.length === 0 && <FirstSuggestions />}

      <AnimatedBlurView
        tint="systemChromeMaterialDark"
        style={[
          {
            paddingTop: 8,
            paddingBottom: 8,
            paddingHorizontal: 16,
            flexDirection: "row",
            gap: 8,
          },
          blurStyle,
        ]}
      >
        <TextInput
          ref={textInput}
          onChangeText={setInputValue}
          keyboardAppearance="dark"
          cursorColor={"white"}
          returnKeyType="send"
          blurOnSubmit={false}
          selectionHandleColor={"white"}
          selectionColor={"white"}
          style={{
            pointerEvents: disabled ? "none" : "auto",
            color: "white",
            // #1E1E1E
            borderColor: "rgba(255, 255, 255, 0.3)",
            padding: 16,
            borderWidth: 0.5,
            borderRadius: 999,
            paddingVertical: 8,
            fontSize: 16,
            fontWeight: "bold",
            outline: "none",
            flex: 1,
          }}
          placeholder="Message"
          autoCapitalize="sentences"
          autoCorrect
          placeholderTextColor={"rgba(255, 255, 255, 0.3)"}
          onSubmitEditing={onSubmitEditing}
        />
      </AnimatedBlurView>
    </Animated.View>
  );
}
