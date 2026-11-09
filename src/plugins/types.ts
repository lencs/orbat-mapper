import type { Component } from "vue";

/**
 * A tool shipped in this repo under `src/plugins/<id>/`.
 *
 * The Tools tab lists every `index.ts` that exports `plugin`. The panel component
 * is ordinary app code: call `useScenario()` and `useGeoStore()` directly. Writes
 * go through the scenario actions (or `store.update` / `groupUpdate`) so undo and
 * redo keep recording them. Remove map listeners and overlays in `onUnmounted`;
 * the Tools tab unmounts the component when the user returns to the list.
 *
 * `id` must be unique. `export` is reserved by the built-in map-image tool.
 * `available`, when set, is called while the tool list renders, so it can read
 * stores and the result stays reactive.
 */
export interface ScenarioPlugin {
  id: string;
  name: string;
  description: string;
  icon: Component;
  component: Component;
  available?: () => boolean;
  unavailableHint?: string;
}
