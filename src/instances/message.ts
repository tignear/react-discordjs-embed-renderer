/**
 * @packageDocumentation
 * @external
 * @module instances
 */
import { Instance, ReactionsInstance, TextInstance } from ".";
import { InstanceBase } from "./common";
import { EmbedInstance } from "./embed";
export type MessageBodyType = {
  content?: string;
  embed?: EmbedInstance;
};
export class RenderingMessageInstance
  implements InstanceBase<"message", RenderingMessageInstance> {
  constructor(
    public messageBody: MessageBodyType = {},
    public reactions?: ReactionsInstance
  ) {}
  cloneSelf(): RenderingMessageInstance {
    return new RenderingMessageInstance();
  }
  type: "message" = "message";
  appendChild(child: Instance | TextInstance | null): void {
    if (child == null) {
      return;
    }
    if (typeof child === "string") {
      this.messageBody.content = child;
      return;
    }
    if (child.type === "embed") {
      this.messageBody.embed = child;
      return;
    }
    if (child.type === "reactions") {
      this.reactions = child;
      return;
    }
  }
}
