import { ItemView, Plugin, WorkspaceLeaf } from "obsidian";
import { HOME_FILE_BROWSER_VIEW_TYPE } from "../consts";
import FileBrowserPage from "./FileBrowserPage.svelte";

export class FileBrowserPageView extends ItemView {
  component: FileBrowserPage | undefined;
  constructor(leaf: WorkspaceLeaf, plugin: Plugin) {
    super(leaf);
    console.log("FileBrowserPageView");
  }
  getViewType(): string {
    return HOME_FILE_BROWSER_VIEW_TYPE;
  }
  getDisplayText(): string {
    return "Example view";
  }
  async onOpen() {
    this.component = new FileBrowserPage({
      target: this.contentEl,
      props: {
        variable: 1,
      },
    });
  }
  async onClose() {
    this.component?.$destroy();
  }
}
