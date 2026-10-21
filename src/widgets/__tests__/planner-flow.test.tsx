import { beforeEach, describe, expect, it } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";

import { useAppStore } from "@/domains/store";
import { todayKey } from "@/shared/util";
import { RoutinesScreen } from "@/widgets/routines-screen";
import { TodayScreen } from "@/widgets/today-screen";
import { WeekScreen } from "@/widgets/week-screen";

beforeEach(() => {
  useAppStore.setState({ routines: [], todoItems: [] });
});

describe("planning a routine across the week", () => {
  it("creates a routine, puts it on today via its day chip, and shows it on Today and Week", async () => {
    await render(<RoutinesScreen />);
    await fireEvent.press(screen.getByTestId("add-routine-fab"));
    await fireEvent.changeText(screen.getByTestId("add-routine-input"), "Stretch");
    await fireEvent.press(screen.getByTestId("rhythm-chip-weekly"));
    await fireEvent.press(screen.getByText("Add"));

    const routine = useAppStore.getState().routines[0];
    expect(routine).toMatchObject({ title: "Stretch", rhythm: { kind: "weekly" } });

    await fireEvent.press(screen.getByTestId(`day-chip-${routine.id}-${todayKey()}`));
    expect(useAppStore.getState().todoItems).toHaveLength(1);

    await render(<TodayScreen />);
    expect(screen.getAllByText("Stretch").length).toBeGreaterThan(0);

    await render(<WeekScreen />);
    expect(screen.getByTestId(`day-section-${todayKey()}`)).toBeTruthy();
  });

  it("adds a todo to a chosen day from the Week tab", async () => {
    await render(<WeekScreen />);
    await fireEvent.press(screen.getByTestId(`add-to-day-${todayKey()}`));
    await fireEvent.changeText(screen.getByTestId("add-week-todo-input"), "Call the dentist");
    await fireEvent.press(screen.getByText("Add"));

    expect(useAppStore.getState().todoItems[0]).toMatchObject({
      title: "Call the dentist",
      dueDate: todayKey(),
    });
    expect(screen.getByText("Call the dentist")).toBeTruthy();
  });

  it("groups routines under the categories they were given", async () => {
    await render(<RoutinesScreen />);
    await fireEvent.press(screen.getByTestId("add-routine-fab"));
    await fireEvent.changeText(screen.getByTestId("add-routine-input"), "Dishes");
    await fireEvent.press(screen.getByTestId("category-chip-new"));
    await fireEvent.changeText(screen.getByTestId("category-new-input"), "chores");
    await fireEvent(screen.getByTestId("category-new-input"), "submitEditing");
    await fireEvent.press(screen.getByText("Add"));

    await fireEvent.press(screen.getByTestId("add-routine-fab"));
    await fireEvent.changeText(screen.getByTestId("add-routine-input"), "Read");
    await fireEvent.press(screen.getByText("Add"));

    expect(
      useAppStore.getState().routines.map((item) => {
        return item.category;
      }),
    ).toEqual(["chores", undefined]);
    expect(screen.getByText("chores")).toBeTruthy();
    expect(screen.getByText("No category")).toBeTruthy();
  });

  it("keeps a new category typed without pressing Enter, and offers it for the next routine", async () => {
    await render(<RoutinesScreen />);
    await fireEvent.press(screen.getByTestId("add-routine-fab"));
    await fireEvent.changeText(screen.getByTestId("add-routine-input"), "Serum");
    await fireEvent.press(screen.getByTestId("category-chip-new"));
    await fireEvent.changeText(screen.getByTestId("category-new-input"), "Skin care");
    await fireEvent.press(screen.getByText("Add"));

    expect(useAppStore.getState().routines[0].category).toBe("Skin care");

    await fireEvent.press(screen.getByTestId("add-routine-fab"));
    await fireEvent.changeText(screen.getByTestId("add-routine-input"), "Moisturiser");
    await fireEvent.press(screen.getByTestId("category-chip-Skin care"));
    await fireEvent.press(screen.getByText("Add"));

    expect(useAppStore.getState().routines[1].category).toBe("Skin care");
  });
});
