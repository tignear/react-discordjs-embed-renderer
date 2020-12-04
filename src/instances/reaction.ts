/**
 * @packageDocumentation
 * @external
 * @module instances
 */
import { Instance, TextInstance } from "./index";
import { InstanceBase } from "./common";
import { EmojiIdentifierResolvable } from "discord.js";
import {
  ReactionAddHandler,
  ReactionRemoveEmojiHandler,
  ReactionRemoveHandler,
} from "../elements";

export class ReactionInstance
  implements InstanceBase<"reaction", ReactionInstance> {
  public emoji!: EmojiIdentifierResolvable;
  constructor(
    public onReactionAdd?: ReactionAddHandler,
    public onReactionRemove?: ReactionRemoveHandler,
    public onReactionRemoveEmoji?: ReactionRemoveEmojiHandler
  ) {}
  cloneSelf(): ReactionInstance {
    return new ReactionInstance(
      this.onReactionAdd,
      this.onReactionRemove,
      this.onReactionRemoveEmoji
    );
  }
  type: "reaction" = "reaction";
  appendChild(child: TextInstance | Instance | null): void {
    if (typeof child === "string") {
      this.emoji = child;
      return;
    }
    throw new TypeError();
  }
}
