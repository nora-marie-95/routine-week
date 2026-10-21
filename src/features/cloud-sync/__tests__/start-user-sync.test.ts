import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

import { serializeSnapshot, useAppStore } from "@/domains/store";
import {
  SAVE_DELAY_MS,
  type SyncApi,
  startUserSync,
} from "@/features/cloud-sync/client/start-user-sync";

type FakeCloud = {
  api: SyncApi;
  save: jest.Mock<SyncApi["save"]>;
  emit: (data: string | undefined, isLocalEcho?: boolean) => void;
};

const createFakeCloud = (): FakeCloud => {
  let listener: Parameters<SyncApi["watch"]>[1] | undefined;
  const save = jest.fn<SyncApi["save"]>(() => {
    return Promise.resolve();
  });
  const api: SyncApi = {
    watch: (_uid, onChange) => {
      listener = onChange;
      return () => {
        listener = undefined;
      };
    },
    save,
  };
  const emit = (data: string | undefined, isLocalEcho = false) => {
    listener?.({ data, isLocalEcho });
  };
  return { api, save, emit };
};

const routine = (id: string, title = id) => {
  return { id, title, rhythm: { kind: "daily" as const }, createdAt: 1 };
};

const snapshotJson = (routines = [routine("remote")]) => {
  return serializeSnapshot({ routines, todoItems: [] });
};

let stop: (() => void) | undefined;

const start = (cloud: FakeCloud) => {
  stop = startUserSync({
    uid: "u1",
    api: cloud.api,
    onSyncChange: () => {
      return undefined;
    },
  });
};

beforeEach(() => {
  jest.useFakeTimers();
  useAppStore.setState({ routines: [], todoItems: [] });
});

afterEach(() => {
  stop?.();
  stop = undefined;
  jest.useRealTimers();
});

describe("startUserSync", () => {
  it("uploads this device's data on first sign-in when the account has none", () => {
    useAppStore.setState({ routines: [routine("local")] });
    const cloud = createFakeCloud();
    start(cloud);

    cloud.emit(undefined);
    jest.advanceTimersByTime(SAVE_DELAY_MS);

    expect(cloud.save).toHaveBeenCalledTimes(1);
    expect(cloud.save).toHaveBeenCalledWith("u1", expect.stringContaining('"local"'));
  });

  it("merges the account's data with this device's on first sign-in and saves the result", () => {
    useAppStore.setState({ routines: [routine("local")] });
    const cloud = createFakeCloud();
    start(cloud);

    cloud.emit(snapshotJson());
    jest.advanceTimersByTime(SAVE_DELAY_MS);

    expect(
      useAppStore
        .getState()
        .routines.map((item) => {
          return item.id;
        })
        .sort(),
    ).toEqual(["local", "remote"]);
    expect(cloud.save).toHaveBeenCalledTimes(1);
  });

  it("doesn't write back when the account already matches this device", () => {
    const cloud = createFakeCloud();
    start(cloud);

    cloud.emit(snapshotJson([]));
    jest.advanceTimersByTime(SAVE_DELAY_MS);

    expect(cloud.save).not.toHaveBeenCalled();
  });

  it("saves a burst of edits as one write", () => {
    const cloud = createFakeCloud();
    start(cloud);
    cloud.emit(snapshotJson([]));
    jest.advanceTimersByTime(SAVE_DELAY_MS);

    useAppStore.getState().routine.create({ title: "One", rhythm: { kind: "daily" } });
    useAppStore.getState().routine.create({ title: "Two", rhythm: { kind: "daily" } });
    jest.advanceTimersByTime(SAVE_DELAY_MS);

    expect(cloud.save).toHaveBeenCalledTimes(1);
    expect(cloud.save).toHaveBeenCalledWith("u1", expect.stringContaining('"Two"'));
  });

  it("applies changes made on another device without saving them back", () => {
    const cloud = createFakeCloud();
    start(cloud);
    cloud.emit(snapshotJson([]));
    jest.advanceTimersByTime(SAVE_DELAY_MS);

    cloud.emit(snapshotJson([routine("from-phone")]));
    jest.advanceTimersByTime(SAVE_DELAY_MS);

    expect(
      useAppStore.getState().routines.map((item) => {
        return item.id;
      }),
    ).toEqual(["from-phone"]);
    expect(cloud.save).not.toHaveBeenCalled();
  });

  it("ignores the echo of its own pending write", () => {
    const cloud = createFakeCloud();
    start(cloud);
    cloud.emit(snapshotJson([]));
    jest.advanceTimersByTime(SAVE_DELAY_MS);
    useAppStore.getState().routine.create({ title: "Mine", rhythm: { kind: "daily" } });
    jest.advanceTimersByTime(SAVE_DELAY_MS);

    cloud.emit(snapshotJson([]), true);

    expect(
      useAppStore.getState().routines.map((item) => {
        return item.title;
      }),
    ).toEqual(["Mine"]);
  });

  it("never overwrites cloud data it can't read", () => {
    useAppStore.setState({ routines: [routine("local")] });
    const cloud = createFakeCloud();
    start(cloud);

    cloud.emit("{ this is not valid");
    jest.advanceTimersByTime(SAVE_DELAY_MS);

    expect(cloud.save).not.toHaveBeenCalled();
    expect(
      useAppStore.getState().routines.map((item) => {
        return item.id;
      }),
    ).toEqual(["local"]);
  });

  it("stops saving after it is stopped", () => {
    const cloud = createFakeCloud();
    start(cloud);
    cloud.emit(snapshotJson([]));
    stop?.();

    useAppStore.getState().routine.create({ title: "Later", rhythm: { kind: "daily" } });
    jest.advanceTimersByTime(SAVE_DELAY_MS);

    expect(cloud.save).not.toHaveBeenCalled();
  });
});
