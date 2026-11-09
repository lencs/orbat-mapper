<script setup lang="ts">
import { computed } from "vue";
import { useScenario } from "@/scenariostore";
import type { NSide, NUnit } from "@/types/internalModels";
import type { EntityId } from "@/types/base";

interface SideSummary {
  id: EntityId;
  name: string;
  visibleUnits: number;
}

function unitCountLabel(count: number) {
  return `${count} ${count === 1 ? "unit" : "units"} on the map`;
}

function summarizeSides(
  sideIds: readonly EntityId[],
  sideMap: Record<EntityId, NSide>,
  units: readonly NUnit[],
): SideSummary[] {
  const counts = new Map<EntityId, number>();
  for (const unit of units) {
    counts.set(unit._sid, (counts.get(unit._sid) ?? 0) + 1);
  }
  return sideIds.map((id) => ({
    id,
    name: sideMap[id]?.name ?? id,
    visibleUnits: counts.get(id) ?? 0,
  }));
}

const { scenario, isReady } = useScenario();

const sides = computed(() => {
  if (!isReady.value) return [];
  const { store, geo } = scenario.value;
  // Read the clock so a time change recounts. A hierarchy move can change a
  // unit's side without replacing the visible-unit array.
  void store.state.currentTime;
  return summarizeSides(
    store.state.sides,
    store.state.sideMap,
    geo.everyVisibleUnit.value,
  );
});
</script>

<template>
  <p v-if="!isReady" class="text-muted-foreground text-sm">No scenario is open.</p>
  <p v-else-if="sides.length === 0" class="text-muted-foreground text-sm">
    This scenario has no sides.
  </p>
  <ul v-else class="divide-border divide-y text-sm">
    <li
      v-for="side in sides"
      :key="side.id"
      class="flex items-baseline justify-between gap-3 py-2"
    >
      <span class="text-sidebar-foreground font-medium">{{ side.name }}</span>
      <span class="text-muted-foreground tabular-nums">{{
        unitCountLabel(side.visibleUnits)
      }}</span>
    </li>
  </ul>
</template>
