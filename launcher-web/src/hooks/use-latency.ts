import { useState, useEffect, useRef } from "react";

interface LatencyTarget {
  location_name: string;
  test_ipv4: string;
}

async function measureLatency(ip: string): Promise<number> {
  const start = performance.now();
  try {
    await fetch(`http://${ip}:80`, {
      mode: "no-cors",
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // Even on failure, the TCP handshake time is captured
  }
  return Math.round(performance.now() - start);
}

export function useLatency(targets: LatencyTarget[], intervalMs = 3000) {
  const [latencies, setLatencies] = useState<Record<string, number>>({});
  const targetsRef = useRef(targets);
  targetsRef.current = targets;

  useEffect(() => {
    let active = true;

    async function ping() {
      const results = await Promise.all(
        targetsRef.current.map(async (t) => {
          const ms = await measureLatency(t.test_ipv4);
          return [t.location_name, ms] as const;
        }),
      );

      if (active) {
        setLatencies(Object.fromEntries(results));
      }
    }

    ping();
    const id = setInterval(ping, intervalMs);

    return () => {
      active = false;
      clearInterval(id);
    };
  }, [intervalMs]);

  return latencies;
}
