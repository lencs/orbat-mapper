import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import ScenarioToolsTabPanel from "@/modules/scenarioeditor/ScenarioToolsTabPanel.vue";

const stubPlugins = vi.hoisted(() => [
  {
    id: "stub-tool",
    name: "Stub tool",
    description: "A test plugin.",
    icon: { name: "StubIcon", template: "<svg />" },
    component: {
      name: "StubTool",
      template: "<p data-test='stub-plugin'>Stub body</p>",
    },
  },
]);

vi.mock("@/plugins/registry", () => ({
  scenarioPlugins: stubPlugins,
}));

describe("ScenarioToolsTabPanel plugins", () => {
  function mountPanel() {
    return mount(ScenarioToolsTabPanel, {
      global: { plugins: [createPinia()] },
    });
  }

  it("lists the export tool and a registered plugin, then opens the plugin", async () => {
    const wrapper = mountPanel();

    expect(wrapper.text()).toContain("Export map image");
    expect(wrapper.text()).toContain("Stub tool");
    expect(wrapper.text()).toContain("A test plugin.");

    const stubButton = wrapper
      .findAll("button")
      .find((button) => button.text().includes("Stub tool"));
    expect(stubButton).toBeTruthy();
    await stubButton!.trigger("click");

    expect(wrapper.get("[data-test='stub-plugin']").text()).toBe("Stub body");
    expect(wrapper.text()).not.toContain("Export map image");
  });
});
