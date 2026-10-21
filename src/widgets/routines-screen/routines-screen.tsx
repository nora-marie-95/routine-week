import { RhythmPicker, RoutineList, useRoutineComposer } from "@/features/routines";
import { ComposerModal, Fab, Screen } from "@/shared/ui-kit";

/** routine green, matching tailwind.config.js colors.routine. */
const ROUTINE_COLOR = "#2BB673";

export const RoutinesScreen = () => {
  const composer = useRoutineComposer();
  return (
    <Screen>
      <RoutineList />
      <Fab accentColor={ROUTINE_COLOR} onPress={composer.open} testID="add-routine-fab" />
      <ComposerModal
        visible={composer.visible}
        label="New Routine"
        value={composer.title}
        onChangeValue={composer.onChangeTitle}
        onSubmit={composer.submit}
        onClose={composer.close}
        testID="add-routine-input"
      >
        <RhythmPicker value={composer.rhythm} onChange={composer.onChangeRhythm} />
      </ComposerModal>
    </Screen>
  );
};
