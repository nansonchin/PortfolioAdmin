"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

type Phase = "idle" | "closing" | "closed" | "opening";

export class TransitionError extends Error {}

export type NavigateOptions = {
  label?: string;
  replace?: boolean;
  refresh?: boolean;
  /** Runs behind the closed door, before the route changes (e.g. the logout request). */
  before?: () => Promise<void>;
  /** Skip the "unsaved changes" confirmation. */
  skipGuard?: boolean;
};

type TransitionApi = {
  navigate: (href: string, options?: NavigateOptions) => void;
  /** Close the door, run a long task, open the door again. */
  run: <T>(label: string, task: () => Promise<T>) => Promise<T>;
  setDirty: (id: string, dirty: boolean) => void;
};

const CLOSE_MS = 380; // keep in sync with --door-close
const OPEN_MS = 480; // keep in sync with --door-open
const MIN_CLOSED_MS = 700; // never flash the door
const TIMEOUT_MS = 10_000; // never trap the user behind it

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const fallback: TransitionApi = {
  navigate: (href) => window.location.assign(href),
  run: (_label, task) => task(),
  setDirty: () => {},
};

const TransitionContext = createContext<TransitionApi>(fallback);

export function useTransitionRouter() {
  return useContext(TransitionContext);
}

export type TransitionState = {
  phase: Phase;
  label: string;
  target: string | null;
};

const TransitionStateContext = createContext<TransitionState>({
  phase: "idle",
  label: "Loading",
  target: null,
});

export function useTransitionState() {
  return useContext(TransitionStateContext);
}

/** Registers a form's dirty state so in-app navigation can ask before discarding it. */
export function useUnsavedGuard(dirty: boolean) {
  const { setDirty } = useTransitionRouter();
  const id = useId();

  useEffect(() => {
    setDirty(id, dirty);
    return () => setDirty(id, false);
  }, [dirty, id, setDirty]);
}

function labelFor(href: string): string {
  const path = href.split(/[?#]/)[0];
  if (path === "/projects/new") return "Creating Project";
  if (path.startsWith("/projects/") && path.endsWith("/translate"))
    return "Translation";
  if (path.startsWith("/projects/")) return "Project editor";
  if (path === "/profile/translate") return "Profile translation";
  if (path === "/dashboard") return "Dashboard";
  if (path === "/projects") return "Projects";
  if (path === "/profile") return "Profile";
  if (path === "/publish") return "Publish";
  if (path === "/login") return "Sign in";
  return "Loading";
}

export default function TransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [phase, setPhaseState] = useState<Phase>("idle");
  const [label, setLabel] = useState("Loading");
  const [target, setTarget] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const phaseRef = useRef<Phase>("idle");
  const pathRef = useRef(pathname);
  const waitRef = useRef<((arrived: boolean) => void) | null>(null);
  const dirtyRef = useRef(new Map<string, boolean>());

  const setPhase = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhaseState(next);
  }, []);

  // The route actually changed: release whoever is waiting behind the door.
  useEffect(() => {
    pathRef.current = pathname;
    waitRef.current?.(true);
  }, [pathname]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 6000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const setDirty = useCallback((id: string, dirty: boolean) => {
    if (dirty) dirtyRef.current.set(id, true);
    else dirtyRef.current.delete(id);
  }, []);

  const closeDoor = useCallback(
    async (nextLabel: string) => {
      setLabel(nextLabel);
      setPhase("closing");
      await sleep(CLOSE_MS);
      setPhase("closed");
      return Date.now();
    },
    [setPhase],
  );

  const openDoor = useCallback(
    async (closedAt: number) => {
      const wait = MIN_CLOSED_MS - (Date.now() - closedAt);
      if (wait > 0) await sleep(wait);
      setPhase("opening");
      await sleep(OPEN_MS);
      setPhase("idle");
      setTarget(null);
    },
    [setPhase],
  );

  const navigate = useCallback<TransitionApi["navigate"]>(
    (href, options = {}) => {
      if (phaseRef.current !== "idle") return;

      if (
        !options.skipGuard &&
        dirtyRef.current.size > 0 &&
        !window.confirm("You have unsaved changes. Leave this page anyway?")
      ) {
        return;
      }

      const url = new URL(href, window.location.href);
      const go = () =>
        options.replace ? router.replace(href) : router.push(href);

      // Same page (query/hash only): nothing to wait for, no door.
      if (url.pathname === window.location.pathname && !options.before) {
        go();
        return;
      }

      void (async () => {
        setTarget(url.pathname);
        const closedAt = await closeDoor(
          options.label ?? labelFor(url.pathname),
        );

        try {
          await options.before?.();

          const arrived = new Promise<boolean>((resolve) => {
            const timer = window.setTimeout(() => {
              waitRef.current = null;
              resolve(false);
            }, TIMEOUT_MS);
            waitRef.current = (ok) => {
              window.clearTimeout(timer);
              waitRef.current = null;
              resolve(ok);
            };
          });

          go();
          if (options.refresh) router.refresh();

          if (!(await arrived))
            setNotice("The page took too long to load. Please try again.");
        } catch(error) {
          setNotice(
            error instanceof TransitionError
              ? error.message
              : "Something went wrong. Please try again.",
          );
        }

        await openDoor(closedAt);
      })();
    },
    [closeDoor, openDoor, router],
  );

  const run = useCallback<TransitionApi["run"]>(
    async (nextLabel, task) => {
      if (phaseRef.current !== "idle") return task();

      const closedAt = await closeDoor(nextLabel);
      try {
        return await task();
      } finally {
        void openDoor(closedAt);
      }
    },
    [closeDoor, openDoor],
  );

  const api = useMemo<TransitionApi>(
    () => ({ navigate, run, setDirty }),
    [navigate, run, setDirty],
  );

  const state = useMemo<TransitionState>(
    () => ({ phase, label, target }),
    [phase, label, target],
  );

  return (
    <TransitionContext.Provider value={api}>
      <TransitionStateContext.Provider value={state}>
        {children}

        {notice && (
          <div
            role="alert"
            className="chamfer fixed right-6 bottom-6 z-[110] max-w-sm border-l-4 border-alert bg-navy px-5 py-3 text-sm text-white"
          >
            {notice}
          </div>
        )}
      </TransitionStateContext.Provider>
    </TransitionContext.Provider>
  );
}
