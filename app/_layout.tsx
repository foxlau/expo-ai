import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Link } from "expo-router";
import Stack from "@/components/ui/Stack";

export const unstable_settings = {
  initialRouteName: "index",
};

export { ErrorBoundary } from "expo-router";
import * as Form from "@/components/ui/Form";
import { IconSymbol } from "@/components/ui/IconSymbol";
import * as AC from "@bacons/apple-colors";
import TouchableBounce from "@/components/ui/TouchableBounce";
import { View } from "react-native";
export default function Layout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <Stack
        screenOptions={{
          title: "Expo AI",
          // headerTransparent: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerLeft: () => (
              <Form.Link href="/settings" asChild>
                <TouchableBounce sensory>
                  <View
                    style={[
                      {
                        flex: 1,
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        alignItems: "center",
                        display: "flex",
                        marginLeft: process.env.EXPO_OS !== "web" ? -16 : 0,
                      },
                    ]}
                  >
                    <IconSymbol name="gear" color={AC.label} />
                  </View>
                </TouchableBounce>
              </Form.Link>
              // <Link href="/_debug" style={{ color: "black" }}>
              //   Debug
              // </Link>
            ),
          }}
        />
        <Stack.Screen
          name="_debug"
          options={{
            headerTransparent: false,
            headerLargeStyle: {
              backgroundColor: undefined,
            },
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: "Settings",
            // headerLargeStyle: {
            //   backgroundColor: undefined,
            // },
            headerTransparent: true,
            presentation: "formSheet",
            headerRight: () => (
              <Form.Link headerRight href="/" dismissTo>
                <IconSymbol
                  name="arrow.down.circle.fill"
                  color={AC.systemGray}
                  size={28}
                />
              </Form.Link>
            ),
          }}
        />
        <Stack.Screen
          name="movie"
          sheet
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="settings/icon"
          sheet
          options={{
            // headerLargeStyle: {
            //   backgroundColor: AC.systemGroupedBackground,
            // },
            // Quarter sheet with no pulling allowed
            headerTransparent: false,
            sheetGrabberVisible: false,
            sheetAllowedDetents: [0.25],
            headerRight: () => (
              <Form.Link headerRight href="/" dismissTo>
                <IconSymbol
                  name="xmark.circle.fill"
                  color={AC.systemGray}
                  size={28}
                />
              </Form.Link>
            ),
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
