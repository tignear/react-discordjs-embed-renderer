/**
 * @packageDocumentation
 * @external
 * @module instances
 */
import { Instance } from ".";
import { ReactionRemoveAllHandler } from "../elements";
import { RenderError } from "../renderer/error";
import { InstanceBase } from "./common";
import { ReactionInstance } from "./reaction";

export class ReactionsInstance
  implements InstanceBase<"reactions", ReactionsInstance> {
  public reactions: ReactionInstance[] = [];
  constructor(
    public strategy: "local" | "remote" | "force" = "local",
    public onReactionRemoveAll?: ReactionRemoveAllHandler
  ) {}
  cloneSelf(): ReactionsInstance {
    return new ReactionsInstance(this.strategy, this.onReactionRemoveAll);
  }
  type: "reactions" = "reactions";
  appendChild(child: string | Instance | null): void {
    if (child == null) {
      return;
    }
    if (typeof child === "string") {
      return;
    }
    if (child.type === "reaction") {
      this.reactions.push(child);
      return;
    }
    throw new RenderError("ReactionsInstance#appendChild", {
      child,
      self: this,
    });
  }
}
