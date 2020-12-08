/**
 * @packageDocumentation
 * @external
 * @module instances
 */
import { Instance } from "./index";
import { InstanceBase } from "./common";
import { TextInstance } from "./text";
import { RenderError } from "../renderer/error";

export class TitleInstance implements InstanceBase<"title", TitleInstance> {
  static create(url: string): TitleInstance {
    return new TitleInstance(url);
  }
  children!: string;
  constructor(public url?: string) {}
  appendChild(child: Instance | TextInstance | null): void {
    if (child === null) {
      throw new RenderError("TitleInstance#appendChild", { child, self: this });
    }
    if (typeof child === "string") {
      this.children = child;
      return;
    }
    throw new RenderError("TitleInstance#appendChild", { child, self: this });
  }
  cloneSelf(): TitleInstance {
    return new TitleInstance(this.url);
  }
  type: "title" = "title";
}
