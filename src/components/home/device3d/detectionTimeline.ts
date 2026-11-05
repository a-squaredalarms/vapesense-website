// Shared timeline for the incident simulation and its 3D detection scene,
// in seconds since the simulation started (matches ProcessSection's steps).
export const SMOKE_START = 0.8; // "Detect" step
export const DETECT_AT = 9; // "Alert" step: red alarm on the device
export const CLEAR_AT = 13; // simulation complete

export type Phase = 'monitoring' | 'analysing' | 'detected';

export function phaseAt(t: number | null): Phase {
  if (t === null) return 'monitoring';
  if (t >= DETECT_AT && t < CLEAR_AT) return 'detected';
  if (t >= SMOKE_START && t < DETECT_AT) return 'analysing';
  return 'monitoring';
}
