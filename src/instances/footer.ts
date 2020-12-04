/**
 * @packageDocumentation
 * @external
 * @module instances
 */
import { Instance, TextInstance } from ".";
import { InstanceBase } from "./common";

export class FooterInstance implements InstanceBase<"footer", FooterInstance> {
  value!: string;
  constructor(public icon?: string) {}
  cloneSelf(): FooterInstance {
    return new FooterInstance(this.icon);
  }
  type: "footer" = "footer";
  appendChild(child: TextInstance | Instance | null): void {
    if (typeof child === "string") {
      this.value = child;
      return;
    }
    throw new TypeError("FooterInstance#appendChild");
  }
}
