import { useState } from "react";

export function useTableExpand<T>(data: T[], initialRows = 6) {
  const [expanded, setExpanded] = useState(false);

  const needsExpand = data.length > initialRows;
  const visible = expanded || !needsExpand ? data : data.slice(0, initialRows);
  const remaining = data.length - initialRows;

  return {
    visible,
    expanded,
    needsExpand,
    remaining,
    toggle: () => setExpanded(!expanded),
  };
}
