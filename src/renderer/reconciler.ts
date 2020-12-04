/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */
/**
 * @packageDocumentation
 * @external
 * @module reconciler
 */
import {
  Message,
  TextChannel,
  NewsChannel,
  DMChannel,
  MessageReaction,
  MessageEmbed,
} from "discord.js";
import ReactReconciler = require("react-reconciler");
import { TimestampType, ReactionRemoveAllHandler } from "../elements";
import {
  EmbedInstance,
  ReactionInstance,
  ReactionsInstance,
  Instance,
  TextInstance,
} from "../instances";
import { instanceFactory, reactionUpdateSterategyFactory } from "./factory";

type HostConfig<
  Type,
  Props,
  Container,
  Instance,
  TextInstance,
  HydratableInstance,
  PublicInstance,
  HostContext,
  UpdatePayload,
  ChildSet,
  TimeoutHandle,
  NoTimeout
> = ReactReconciler.HostConfig<
  Type,
  Props,
  Container,
  Instance,
  TextInstance,
  HydratableInstance,
  PublicInstance,
  HostContext,
  UpdatePayload,
  ChildSet,
  TimeoutHandle,
  NoTimeout
>;

export type Container = {
  embed?: EmbedInstance;
  content?: string;
  timestamp?: TimestampType;
  curMessage?: Message;
  message?: Promise<Message>;
  channel: TextChannel | NewsChannel | DMChannel;
  reaction?: Promise<void>;
  reactionAbort?: AbortController;
  reactions?: {
    instance: ReactionInstance;
    rendered?: MessageReaction;
  }[];
  reactionUpdateSterategy?: "local" | "remote" | "force";
  onReactionRemoveAll?: ReactionRemoveAllHandler;
  ignoreReactionRemoveEvent: boolean;
  errorHandler: (err: unknown) => void;
};
export type UpdatePayload = never;
export type TimeoutHandle = NodeJS.Timeout;
export type NoTimeout = undefined;
export type HostContext = {};
export type Child = {};
export type ChildSet = {
  messageBody?: {
    embed?: EmbedInstance;
    content?: string;
  };
  onReactionRemoveAll?: ReactionRemoveAllHandler;
  reactions?: ReactionsInstance;
};
export type PublicInstance = {};

function createEmbed(container: Container) {
  if (!container.embed) {
    return {};
  }
  const embed = new MessageEmbed(container.embed.body);
  if (container.timestamp != null && container.timestamp != false) {
    embed.setTimestamp(
      container.timestamp == true ? undefined : container.timestamp
    );
  }
  if (container.embed.body.color) {
    embed.setColor(container.embed.body.color);
  }
  return embed;
}
export type MessagePayload = { content?: string; embed?: EmbedInstance };
function messageUpdated(oldvalue: MessagePayload, newValue: MessagePayload) {
  if (oldvalue.content !== newValue.content) {
    return true;
  }
  if (oldvalue.embed === newValue.embed) {
    return false;
  }
  if (oldvalue.embed == null || newValue.embed == null) {
    return true;
  }
  return !oldvalue.embed.compare(newValue.embed);
}
type Type = "discordjs_embed" | "discordjs_title";
type Props = Record<string, unknown>;
export const reconciler = ReactReconciler<
  Type,
  Props,
  Container,
  Instance,
  TextInstance,
  never,
  PublicInstance,
  HostContext,
  UpdatePayload,
  ChildSet,
  TimeoutHandle,
  NoTimeout
>({
  supportsMutation: false,
  supportsHydration: false,
  supportsPersistence: true,
  appendInitialChild: (parentInstance, child) => {
    parentInstance.appendChild(child);
  },
  cancelDeferredCallback: (handle) => {},
  clearTimeout: (handle) => {
    if (handle) {
      clearTimeout(handle);
    }
  },
  createInstance: (type, props) => {
    const f = instanceFactory[type];
    if (f == null) {
      throw new TypeError("type is not implemented:" + type);
    }
    return f(props);
  },
  createTextInstance: (text) => {
    return text;
  },
  finalizeInitialChildren: () => {
    return false;
  },
  getChildHostContext: () => {
    return {};
  },
  getPublicInstance: (instance) => {
    return instance;
  },
  getRootHostContext: () => {
    return {};
  },
  isPrimaryRenderer: false,
  noTimeout: undefined,
  now: () => {
    return Date.now();
  },
  prepareForCommit: () => {
    return null;
  },
  prepareUpdate: () => {
    throw new Error("not implemented");
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  resetAfterCommit: () => {},
  scheduleDeferredCallback: () => {},
  setTimeout: (handler: (...args: unknown[]) => void, timeout: number) => {
    return setTimeout(handler, timeout);
  },
  shouldDeprioritizeSubtree: () => {
    return false;
  },
  shouldSetTextContent: () => {
    return false;
  },
  unhideInstance: () => {},
  appendChildToContainerChildSet: (childSet, child) => {
    if (child == null) {
      return;
    }
    if (typeof child === "string") {
      return;
    }
    if (child.type !== "message") {
      return;
    }
    childSet.messageBody = child.messageBody;
    childSet.onReactionRemoveAll = child.reactions?.onReactionRemoveAll;
    childSet.reactions = child.reactions;
  },
  cloneInstance: (instance) => {
    if (typeof instance === "string") {
      return instance;
    }
    return instance.cloneSelf();
  },
  createContainerChildSet: () => {
    return {};
  },
  finalizeContainerChildren: () => {
    //noop
  },
  replaceContainerChildren: (container, newChildren) => {
    // processing messages
    if (
      !messageUpdated(
        { content: container.content, embed: container.embed },
        newChildren.messageBody ?? {}
      )
    ) {
      return;
    }
    Object.assign(container, {
      content: newChildren.messageBody?.content,
      embed: newChildren.messageBody?.embed,
      timestamp: newChildren.messageBody?.embed?.timestamp,
    });
    container.onReactionRemoveAll = newChildren.onReactionRemoveAll;
    const embed = createEmbed(container);
    if (container.message) {
      container.message = container.message.then((e) =>
        e.edit(container.content, embed)
      );
    } else {
      container.message = container.channel.send(container.content, embed);
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    container.message.then((message) => {
      container.curMessage = message;
    });

    // processing reactions
    if (newChildren.reactions) {
      reactionUpdateSterategyFactory[newChildren.reactions.strategy](
        container,
        newChildren
      );
    }
  },
} as HostConfig<Type, Props, Container, Instance, TextInstance, never, PublicInstance, HostContext, UpdatePayload, ChildSet, TimeoutHandle, NoTimeout>);
