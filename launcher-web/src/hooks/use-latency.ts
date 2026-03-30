import { useState, useEffect, useRef, useCallback } from "react";

interface ApiTarget {
  location_name: string;
  strategy: "api";
  ping_code: string;
}

interface IpTarget {
  location_name: string;
  strategy: "ip";
  ip: string;
}

export type LatencyTarget = ApiTarget | IpTarget;

async function pingApi(code: string): Promise<number> {
  const start = performance.now();
  try {
    await fetch(`https://${code}.ping.cubepath.com/ping`, {
      cache: "no-cache",
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    return -1;
  }
  return Math.round(performance.now() - start);
}

async function pingIp(ip: string): Promise<number> {
  const start = performance.now();
  try {
    await fetch(`http://${ip}:80`, {
      mode: "no-cors",
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // TCP handshake time still captured
  }
  return Math.round(performance.now() - start);
}

interface UseLatencyOptions {
  intervalMs?: number;
  enableFallback?: boolean;
}

export function useLatency(targets: LatencyTarget[], options: UseLatencyOptions = {}) {
  const { intervalMs = 3000, enableFallback = true } = options;
  const [latencies, setLatencies] = useState<Record<string, number>>({});
  const targetsRef = useRef(targets);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  targetsRef.current = targets;

  const ping = useCallback(async () => {
    if (document.hidden) return;

    const results = await Promise.all(
      targetsRef.current.map(async (t) => {
        let ms: number;
        if (t.strategy === "api") {
          ms = await pingApi(t.ping_code);
        } else if (enableFallback) {
          ms = await pingIp(t.ip);
        } else {
          ms = -1;
        }
        return [t.location_name, ms] as const;
      }),
    );

    setLatencies(Object.fromEntries(results.filter(([, ms]) => ms >= 0)));
  }, [enableFallback]);

  useEffect(() => {
    ping();
    intervalRef.current = setInterval(ping, intervalMs);

    function handleVisibility() {
      if (document.hidden) {
        clearInterval(intervalRef.current);
      } else {
        ping();
        intervalRef.current = setInterval(ping, intervalMs);
      }
    }

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [ping, intervalMs]);

  return latencies;
}
