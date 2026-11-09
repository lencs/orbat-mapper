import { defineAsyncComponent } from "vue";
import { ListTreeIcon } from "@lucide/vue";
import type { ScenarioPlugin } from "@/plugins/types";

/**
 * Example plugin. Copy this folder to add a tool; `src/plugins/registry.ts`
 * picks up `src/plugins/<id>/index.ts` and the Tools tab lists it.
 * Delete this folder to remove the tool.
 */
export const plugin: ScenarioPlugin = {
  id: "scenario-summary",
  name: "Order of battle summary",
  description: "Count the units on the map for each side at the current time.",
  icon: ListTreeIcon,
  component: defineAsyncComponent(() => import("./ScenarioSummary.vue")),
};
