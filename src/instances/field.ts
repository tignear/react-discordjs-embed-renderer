/**
 * @packageDocumentation
 * @external
 * @module instances
 */
import { Instance } from ".";
import { RenderError } from "../renderer/error";
import { InstanceBase } from "./common";
import { TextInstance } from "./text";

export class FieldInstance implements InstanceBase<"field", FieldInstance> {
  value!: string;
  static create(name: string, option: { inline?: boolean }): FieldInstance {
    return new FieldInstance(name, option.inline || false);
  }
  constructor(public name: string, public inline: boolean) {}
  cloneSelf(): FieldInstance {
    return new FieldInstance(this.name, this.inline);
  }
  type: "field" = "field";
  appendChild(child: TextInstance | Instance | null): void {
    if (typeof child === "string") {
      this.value = child;
      return;
    }
    throw new RenderError("FieldInstance#appendChild", {
      child,
      self: this,
    });
  }
}
