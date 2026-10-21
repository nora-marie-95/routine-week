import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { UserRoundIcon } from "lucide-react-native";

import { type SyncStatus, useAccountStore } from "@/features/cloud-sync/client/use-account-store";
import { signInWithGoogle, signOutUser } from "@/lib/firebase";

const ICON_SIZE = 22;

const SYNC_LABELS: Record<SyncStatus, string> = {
  idle: "Saved to your account",
  saving: "Saving…",
  error: "Couldn't save — will retry on your next change",
};

const SIGN_IN_FAILED = "Sign-in didn't complete. Please try again.";

type AccountSheetProps = {
  visible: boolean;
  onClose: () => void;
};

const AccountSheet = (props: AccountSheetProps) => {
  const { visible, onClose } = props;
  const status = useAccountStore((state) => {
    return state.status;
  });
  const user = useAccountStore((state) => {
    return state.user;
  });
  const sync = useAccountStore((state) => {
    return state.sync;
  });
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const onSignInPress = () => {
    setErrorMessage(undefined);
    signInWithGoogle().catch(() => {
      setErrorMessage(SIGN_IN_FAILED);
    });
  };
  const onSignOutPress = () => {
    signOutUser().finally(onClose);
  };
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Pressable className="absolute inset-0 bg-black/30" onPress={onClose} />
        <View className="gap-3 rounded-t-2xl bg-canvas p-4 pb-8">
          <Text className="text-sm font-semibold uppercase tracking-wide text-subtle">Account</Text>
          {status === "signedIn" ? (
            <>
              <Text testID="account-email" className="text-base text-ink">
                {user?.email ?? user?.name ?? "Signed in"}
              </Text>
              <Text testID="account-sync" className="text-sm text-subtle">
                {SYNC_LABELS[sync]}
              </Text>
              <Pressable
                onPress={onSignOutPress}
                testID="sign-out-button"
                className="self-start rounded-full border-hair border-hairline px-4 py-2"
              >
                <Text className="text-ink">Sign out</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text className="text-base text-ink">
                Your routines and todos are only saved in this browser. Sign in with Google to keep
                them in your account and use them on any device.
              </Text>
              {errorMessage ? <Text className="text-sm text-red-600">{errorMessage}</Text> : null}
              <Pressable
                onPress={onSignInPress}
                testID="sign-in-button"
                className="self-start rounded-full bg-ink px-4 py-2"
              >
                <Text className="font-medium text-white">Sign in with Google</Text>
              </Pressable>
            </>
          )}
          <View className="flex-row justify-end pt-2">
            <Pressable onPress={onClose} testID="account-close" className="px-4 py-2">
              <Text className="text-subtle">Close</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

/** Header button that opens the account sheet; absent when Firebase isn't set up. */
export const AccountButton = () => {
  const status = useAccountStore((state) => {
    return state.status;
  });
  const [visible, setVisible] = useState(false);
  const onPress = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };
  if (status === "disabled") {
    return null;
  }
  return (
    <>
      <Pressable
        hitSlop={8}
        onPress={onPress}
        testID="account-button"
        accessibilityLabel="Account"
        className="mr-4"
      >
        <UserRoundIcon size={ICON_SIZE} color={status === "signedIn" ? "#2BB673" : "#1C1C1E"} />
      </Pressable>
      <AccountSheet visible={visible} onClose={onClose} />
    </>
  );
};
