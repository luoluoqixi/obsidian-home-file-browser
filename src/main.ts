import {
  App,
  Plugin,
  PluginSettingTab,
  Setting,
  type PluginManifest,
} from "obsidian";
import { HOME_FILE_BROWSER_VIEW_TYPE } from "./consts";
import { FileBrowserPageView } from "./pages";

// Remember to rename these classes and interfaces!

interface HomeFileBrowserPluginSettings {
  mySetting: string;
}

const DEFAULT_SETTINGS: HomeFileBrowserPluginSettings = {
  mySetting: "default",
};

export default class HomeFileBrowserPlugin extends Plugin {
  settings: HomeFileBrowserPluginSettings;
  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
    this.settings = DEFAULT_SETTINGS;
  }

  registerHomePageUI() {
    this.registerView(
      HOME_FILE_BROWSER_VIEW_TYPE,
      (leaf) => new FileBrowserPageView(leaf, this)
    );
  }

  activeHomePage() {
    const leaf = this.app.workspace.getMostRecentLeaf();
    if (leaf && leaf.getViewState().type === "empty") {
      leaf.setViewState({
        type: HOME_FILE_BROWSER_VIEW_TYPE,
      });
      this.app.workspace.revealLeaf(leaf);
    }
  }
  closeOtherPage() {
    const leafTypes: string[] = [];
    this.app.workspace.iterateRootLeaves((leaf) => {
      const leafType = leaf.view.getViewType();
      if (
        leafTypes.indexOf(leafType) === -1 &&
        leafType != HOME_FILE_BROWSER_VIEW_TYPE
      ) {
        leafTypes.push(leafType);
      }
    });
    leafTypes.forEach((type) => this.app.workspace.detachLeavesOfType(type));
  }
  onInitHomePage() {
    this.app.workspace.onLayoutReady(() => {
      this.registerHomePageUI();
      const leaves = this.app.workspace.getLeavesOfType(
        HOME_FILE_BROWSER_VIEW_TYPE
      );
      if (leaves.length > 0) {
        this.app.workspace.revealLeaf(leaves[0]);
        leaves.forEach((leaf, index) => {
          if (index < 1) return;
          leaf.detach();
        });
      } else {
        this.activeHomePage();
      }
      this.closeOtherPage();
      console.log("init home file browser");
    });
  }

  async onload() {
    await this.loadSettings();

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new HomeFileBrowserPluginSettingTab(this.app, this));

    this.onInitHomePage();

    // const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
    // 	new Notice('This is a notice!');
    // });
    // // Perform additional things with the ribbon
    // ribbonIconEl.addClass('my-plugin-ribbon-class');

    // // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
    // // Using this function will automatically remove the event listener when this plugin is disabled.
    // this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
    // 	console.log('click', evt);
    // });

    // // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
    // this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
  }

  onunload() {
    this.app.workspace.detachLeavesOfType(HOME_FILE_BROWSER_VIEW_TYPE);
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class HomeFileBrowserPluginSettingTab extends PluginSettingTab {
  plugin: HomeFileBrowserPlugin;

  constructor(app: App, plugin: HomeFileBrowserPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Setting #1")
      .setDesc("It's a secret")
      .addText((text) =>
        text
          .setPlaceholder("Enter your secret")
          .setValue(this.plugin.settings.mySetting)
          .onChange(async (value) => {
            this.plugin.settings.mySetting = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
