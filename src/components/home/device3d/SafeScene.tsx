'use client';

import { Component, useSyncExternalStore, type ReactNode } from 'react';

// Some browsers (locked-down school laptops, old devices, disabled GPU) can't run WebGL.
// This wrapper skips the 3D scene there, and catches any 3D crash, so the rest of the page still works.

let webglSupport: boolean | null = null;
function hasWebGL() {
  if (webglSupport === null) {
    try {
      const canvas = document.createElement('canvas');
      webglSupport = !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

const noop = () => () => {};

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function SafeScene({ children }: { children: ReactNode }) {
  // false on the server and during hydration, then the real answer in the browser.
  const supported = useSyncExternalStore(noop, hasWebGL, () => false);
  if (!supported) return null;
  return <SceneBoundary>{children}</SceneBoundary>;
}
