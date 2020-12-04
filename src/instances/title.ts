/**
 * @packageDocumentation
 * @external
 * @module instances
 */
import { Instance } from "./index";
import { InstanceBase } from "./common";
import { TextInstance } from "./text";

export class TitleInstance implements InstanceBase<"title", TitleInstance> {
  static create(url: string): TitleInstance {
    return new TitleInstance(url);
  }
  children!: string;
  constructor(public url?: string) {}
  appendChild(child: Instance | TextInstance | null): void {
    if (child === null) {
      throw new TypeError("TitleInstance#appendChild");
    }
    if (typeof child === "string") {
      this.children = child;
      return;
    }
    throw new TypeError("TitleInstance#appendChild");
  }
  cloneSelf(): TitleInstance {
    return new TitleInstance(this.url);
  }
  type: "title" = "title";
}
