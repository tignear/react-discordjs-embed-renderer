/**
 * @packageDocumentation
 * @external
 * @module instances
 */
import { ColorResolvable, MessageEmbedOptions } from "discord.js";
import { Instance } from "./index";
import { InstanceBase } from "./common";
import { TextInstance } from "./text";
import { TimestampType } from "../elements";
import { isDeepStrictEqual } from "util";
import { RenderError } from "../renderer/error";

export class EmbedInstance implements InstanceBase<"embed", EmbedInstance> {
  type: "embed" = "embed";
  static create(
    color: ColorResolvable,
    timestamp: TimestampType
  ): EmbedInstance {
    return new EmbedInstance({ color }, timestamp);
  }
  constructor(
    public body: MessageEmbedOptions = {},
    public timestamp: TimestampType
  ) {}
  appendChild(child: TextInstance | Instance | null): void {
    if (child == null) {
      throw new RenderError(
        "EmbedInstance#appendChild: child must not be null",
        { child, self: this }
      );
    }
    if (typeof child === "string") {
      this.body.description = child;
      return;
    }
    switch (child.type) {
      case "title":
        this.body.title = child.children;
        this.body.url = child.url;
        return;
      case "author":
        this.body.author = {
          iconURL: child.icon,
          url: child.url,
          name: child.value,
        };
        return;
      case "field":
        this.body.fields = [
          ...(this.body.fields ?? []),
          { name: child.name, value: child.value, inline: child.inline },
        ];
        return;
      case "footer":
        this.body.footer = {
          iconURL: child.icon,
          text: child.value,
        };
        return;
      case "img":
        this.body.image = {
          url: child.src,
        };
        return;
      case "thumbnail":
        this.body.thumbnail = {
          url: child.src,
        };
        return;
      default:
        throw new RenderError("EmbedInstance#appendChild", {
          child,
          self: this,
        });
    }
  }
  cloneSelf(): EmbedInstance {
    return new EmbedInstance({ color: this.body.color }, this.timestamp);
  }
  compare(other: EmbedInstance): boolean {
    return isDeepStrictEqual(this, other);
  }
}
