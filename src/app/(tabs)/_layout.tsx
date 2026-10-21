import { Tabs } from "expo-router";

import { CalendarCheckIcon, CalendarDaysIcon, RepeatIcon } from "lucide-react-native";

const TAB_ICON_SIZE = 24;
const ACTIVE_TAB_COLOR = "#1C1C1E";

const TabsLayout = () => {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: ACTIVE_TAB_COLOR }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Today",
          tabBarIcon: ({ color }) => {
            return <CalendarCheckIcon size={TAB_ICON_SIZE} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="week"
        options={{
          title: "Week",
          tabBarIcon: ({ color }) => {
            return <CalendarDaysIcon size={TAB_ICON_SIZE} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="routines"
        options={{
          title: "Routines",
          tabBarIcon: ({ color }) => {
            return <RepeatIcon size={TAB_ICON_SIZE} color={color} />;
          },
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
