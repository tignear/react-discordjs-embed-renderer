/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */
/**
 * @packageDocumentation
 * @internal
 * @module react-discordjs-embed-renderer
 * @preferred
 */
import {
  Channel,
  Collection,
  DMChannel,
  Guild,
  Message,
  MessageReaction,
  NewsChannel,
  PartialDMChannel,
  PartialMessage,
  TextChannel,
  User,
} from "discord.js";
import { reactionUpdateSterategyFactory } from "./factory";
import { EventEmitter } from "events";
import { Container, reconciler } from "./reconciler";

/**
 * Manage message and component.<br>
 * Must handle the error event(use ``on`` method,``addListener`` method, etc), otherwise process exit suddenly.<br>
 * Please emit {@link Renderer.requiredEvents} to this for synchronizing, event firing, and unlinking.<br>
 * Example usage is below.
 * ```typescript
 * const renderer = new Renderer(() => client.user!);
 * const forward = forwardEvent(client, renderer);
 * Renderer.requiredEvents.forEach(forward);
 * renderer.on("error", (err) => console.error(err));
 * ```
 * {@link forwardEvent}
 */
export class Renderer extends EventEmitter {
  /**
   * Required event for synchronizing, event firing, and unlinking.
   */
  static requiredEvents = [
    "messageReactionAdd",
    "messageReactionRemove",
    "messageReactionRemoveEmoji",
    "messageReactionRemoveAll",
    "channelDelete",
    "guildDelete",
    "messageDelete",
    "messageDeleteBulk",
  ] as const;
  /**
   * @external
   * @param messageReaction
   * @param user
   */
  private async onMessageReactionAdd(
    messageReaction: MessageReaction,
    user: User
  ): Promise<void> {
    const conatiner = this.containers.get(messageReaction.message.id);
    if (!conatiner) {
      return;
    }
    const f = conatiner.reactions?.find(
      (e) => e.rendered?.emoji.name === messageReaction.emoji.name
    )?.instance?.onReactionAdd;
    if (!f) {
      return;
    }
    await f(messageReaction, user);
  }
  /**
   * @external
   * @param f eventHandler
   * @param computeCtx compute Error Ctx
   */
  private executeAsyncMethod<Args extends Array<unknown>, R>(
    f: (...args: Args) => Promise<R>,
    computeCtx: (...args: Args) => Record<string, unknown>
  ) {
    return (...args: Args) => {
      f(...args).catch((e) =>
        /**
         * @event error
         * emits error
         */
        this.emit(
          "error",
          new RenderError(
            "An error ocurred while processing event.",
            computeCtx(...args),
            e
          )
        )
      );
    };
  }
  /**
   * @external
   * @param messageReaction
   * @param user
   */
  private async onMessageReactionRemove(
    messageReaction: MessageReaction,
    user: User
  ) {
    const conatiner = this.containers.get(messageReaction.message.id);
    if (!conatiner) {
      return;
    }
    const f = conatiner.reactions?.find(
      (e) => e.rendered?.emoji.name === messageReaction.emoji.name
    )?.instance?.onReactionRemove;

    const v = f ? await f(messageReaction, user) : false;
    if (typeof v === "boolean" && v) {
      return;
    }
    if (!conatiner.reactionUpdateSterategy) {
      return;
    }
    if (
      this.clientUser()?.id === user.id &&
      conatiner.reactionUpdateSterategy !== "local"
    ) {
      reactionUpdateSterategyFactory.force(conatiner);
    }
  }
  /**
   * @external
   * @param message
   */
  private async onMessageReactionRemoveEmoji(messageReaction: MessageReaction) {
    const conatiner = this.containers.get(messageReaction.message.id);
    if (!conatiner) {
      return;
    }
    const f = conatiner.reactions?.find(
      (e) => e.rendered?.emoji.name === messageReaction.emoji.name
    )?.instance?.onReactionRemoveEmoji;

    const v = f ? await f(messageReaction) : false;
    if (typeof v === "boolean" && v) {
      return;
    }
    if (!conatiner.reactionUpdateSterategy) {
      return;
    }
    if (conatiner.reactionUpdateSterategy !== "local") {
      reactionUpdateSterategyFactory.force(conatiner);
    }
  }
  /**
   * @external
   * @param message
   */
  private async onMessageReactionRemoveAll(message: Message | PartialMessage) {
    const conatiner = this.containers.get(message.id);
    if (!conatiner) {
      return;
    }
    const f = conatiner.onReactionRemoveAll;
    const v = f ? await f(message) : false;
    if (typeof v === "boolean" && v) {
      return;
    }
    const ig = conatiner.ignoreReactionRemoveEvent;
    conatiner.ignoreReactionRemoveEvent = false;
    if (!conatiner.reactionUpdateSterategy || ig) {
      return;
    }
    if (conatiner.reactionUpdateSterategy !== "local") {
      reactionUpdateSterategyFactory.force(conatiner);
    }
  }
  /**
   * @param clientUser lazy loadable client user
   */
  constructor(
    /**
     * @external
     */
    private clientUser: () => User | undefined | null
  ) {
    super();
    this.on(
      "messageReactionAdd",
      this.executeAsyncMethod(
        this.onMessageReactionAdd.bind(this),
        (messageReaction, user) => ({
          messageReaction,
          user,
        })
      )
    );
    this.on(
      "messageReactionRemove",
      this.executeAsyncMethod(
        this.onMessageReactionRemove.bind(this),
        (messageReaction, user) => ({
          messageReaction,
          user,
        })
      )
    );
    this.on(
      "messageReactionRemoveEmoji",
      this.executeAsyncMethod(
        this.onMessageReactionRemoveEmoji.bind(this),
        (messageReaction) => ({
          messageReaction,
        })
      )
    );
    this.on(
      "messageReactionRemoveAll",
      this.executeAsyncMethod(
        this.onMessageReactionRemoveAll.bind(this),
        (message) => ({
          message,
        })
      )
    );
    this.on("channelDelete", (channel: Channel | PartialDMChannel) => {
      for (const [k, container] of this.containers) {
        if (container.channel.id === channel.id) {
          this.containers.delete(k);
        }
      }
    });
    this.on("guildDelete", (guild: Guild) => {
      for (const [k, container] of this.containers) {
        const channel = container.channel;
        if (channel.type === "dm") {
          continue;
        }
        if (channel.guild.id === guild.id) {
          this.containers.delete(k);
        }
      }
    });
    this.on("messageDelete", (message: Message | PartialMessage) => {
      this.unlink(message);
    });
    this.on(
      "messageDeleteBulk",
      (collection: Collection<string, Message | PartialMessage>) => {
        collection.forEach((e) => this.unlink(e));
      }
    );
  }
  /**
   * @external
   */
  private containers = new Map<string, Container>();
  /**
   * @external
   * @param what
   * @param channel
   * @param message
   * @param once
   */
  private renderBase(
    what: React.ReactNode,
    channel: TextChannel | NewsChannel | DMChannel,
    message: Message | undefined,
    once: boolean
  ): Promise<Message> {
    let _ignoreReactionRemoveEvent = false;
    const containerInfo: Container = {
      channel,
      get ignoreReactionRemoveEvent() {
        return !!_ignoreReactionRemoveEvent;
      },
      set ignoreReactionRemoveEvent(v: boolean) {
        _ignoreReactionRemoveEvent = v;
      },
      message: message ? Promise.resolve(message) : undefined,
      curMessage: message,
      errorHandler: (err) => {
        this.emit(
          "error",
          new RenderError("An error ocurred while rendering.", { message }, err)
        );
      },
    };
    const fiberRoot = reconciler.createContainer(containerInfo, true, false);
    return new Promise((resolve) => {
      reconciler.updateContainer(what, fiberRoot, null, () => {
        if (!once) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises,@typescript-eslint/no-non-null-assertion
          containerInfo.message!.then((e) =>
            this.containers.set(e.id, containerInfo)
          );
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        resolve(containerInfo.message!);
      });
    });
  }
  /**
   * Rendering message once to channel.
   * Not reacting discord api gateway message.
   * @param what Accepts only {@link RenderingMessage}.
   * @param channel Channel for send message.
   */
  renderOnce(
    what: React.ReactNode,
    channel: TextChannel | NewsChannel | DMChannel
  ): Promise<Message> {
    return this.renderBase(what, channel, undefined, true);
  }
  /**
   * Rendering message to channel.
   * Reacting discord api gateway message.
   * When finish using, must call {@link unlink}.
   * @param what Accepts only {@link RenderingMessage}.
   * @param channel Channel for send message.
   */
  render(
    what: React.ReactNode,
    channel: TextChannel | NewsChannel | DMChannel
  ): Promise<Message> {
    return this.renderBase(what, channel, undefined, false);
  }
  /**
   * Edit message with what parametor.
   * Not reacting discord api gateway message.
   * @param what Accepts only {@link RenderingMessage}.
   * @param message Link to message.
   */
  link(what: React.ReactNode, message: Message): Promise<Message> {
    return this.renderBase(what, message.channel, message, false);
  }
  /**
   * Edit message once with what parametor.
   * Reacting discord api gateway message.
   * When finish using, must call {@link unlink}.
   * @param what Accepts only {@link RenderingMessage}.
   * @param message Link to message.
   */
  linkOnce(what: React.ReactNode, message: Message): Promise<Message> {
    return this.renderBase(what, message.channel, message, true);
  }
  /**
   * Finish using.
   * @param message Target of unlink.
   */
  unlink(message: Message | PartialMessage): void {
    this.containers.delete(message.id);
  }
}
