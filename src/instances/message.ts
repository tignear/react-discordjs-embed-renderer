/**
 * @packageDocumentation
 * @external
 * @module instances
 */
import { Message } from "discord.js";
import { Instance, ReactionsInstance, TextInstance } from ".";
import { RenderingDoneHandler } from "../elements";
import { InstanceBase } from "./common";
import { EmbedInstance } from "./embed";
export type MessageBodyType = {
  content?: string;
  embed?: EmbedInstance;
};
/**
 * @external
 */
export class RenderingMessageInstance
  implements InstanceBase<"message", RenderingMessageInstance> {
  /**
   * @external
   */
  constructor(
    private messageGetter: () => Message | undefined,
    public onRenderingDone: RenderingDoneHandler,
    public messageBody: MessageBodyType = {},
    public reactions?: ReactionsInstance
  ) {}
  /**
   * @external
   */
  cloneSelf(): RenderingMessageInstance {
    return new RenderingMessageInstance(
      this.messageGetter,
      this.onRenderingDone
    );
  }
  /**
   * @external
   */
  type: "message" = "message";
  /**
   * @external
   * @param child
   */
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
  /**
   * @internal
   * rendered message
   */
  get message(): Message | undefined {
    return this.messageGetter() ?? undefined;
  }
}
