/**
 * @packageDocumentation
 * @external
 * @module renderer
 */
import { Message } from "discord.js";
import {
  EmbedInstance,
  FooterInstance,
  Instance,
  TitleInstance,
} from "../instances";
import { AuthorInstance } from "../instances/author";
import { CommonImageInstance } from "../instances/commonimage";
import { FieldInstance } from "../instances/field";
import { RenderingMessageInstance } from "../instances/message";
import { ReactionInstance } from "../instances/reaction";
import { ReactionsInstance } from "../instances/reactions";
import { AbortController } from "abort-controller";
import { isDeepStrictEqual } from "util";
import { ChildSet, Container } from "./reconciler";

export const instanceFactory: Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (props: Record<string, any>) => Instance
> = {
  discordjs_embed: (props) =>
    EmbedInstance.create(props.color, props.timestamp),
  discordjs_author: (props) =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    new AuthorInstance({ icon: props.icon, url: props.url }),
  discordjs_title: (props) => new TitleInstance(props.url),
  discordjs_img: (props) => new CommonImageInstance("img", props.src),
  discordjs_thumbnail: (props) =>
    new CommonImageInstance("thumbnail", props.src),
  discordjs_field: (props) => new FieldInstance(props.name, props.inline),
  discordjs_footer: (props) => new FooterInstance(props.icon),
  discordjs_reaction: (props) =>
    new ReactionInstance(
      props.onReactionAdd,
      props.onReactionRemove,
      props.onReactionRemoveEmoji
    ),
  discordjs_message: () => new RenderingMessageInstance(),
  discordjs_reactions: (props) =>
    new ReactionsInstance(props.strategy, props.onReactionRemoveAll),
};
async function* setReactionsToMessage(
  message: Message,
  newReactions: ReactionInstance[],
  signal: AbortSignal
) {
  for (const reaction of newReactions) {
    if (signal.aborted) {
      return;
    }
    yield await message.react(reaction.emoji);
  }
}
function prepareReactionUpdate(container: Container, newChildren?: ChildSet) {
  const reactionAbort = (container.reactionAbort = new AbortController());
  const oldReactions = (container.reactions ?? []).map((e) => e.instance);
  const newReactions = newChildren
    ? newChildren.reactions?.reactions ?? []
    : oldReactions;
  container.reactions = newChildren
    ? newReactions.map((e, i) => ({
        instance: e,
        rendered: container.reactions
          ? container.reactions[i].rendered
          : undefined,
      }))
    : container.reactions;
  if (newChildren) {
    container.reactionUpdateSterategy = newChildren.reactions?.strategy;
  }
  return {
    reactionAbort,
    oldReactions,
    newReactions,
  };
}
function runUpdate(
  container: Container,
  f: (message: Message) => () => Promise<void>
): void {
  if (container.curMessage) {
    if (container.reaction) {
      container.reaction = container.reaction.then(f(container.curMessage));
    } else {
      container.reaction = f(container.curMessage)();
    }
  } else {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    container.reaction = container.message!.then((message) => {
      return f(message)();
    });
  }
}
const local: (c: Container, nc?: ChildSet) => void = (
  container,
  newChildren
) => {
  const f = (message: Message) => async () => {
    if (!newChildren) {
      return;
    }
    const { reactionAbort, oldReactions, newReactions } = prepareReactionUpdate(
      container,
      newChildren
    );
    if (isDeepStrictEqual(oldReactions, newReactions)) {
      return;
    }
    if (message.reactions.cache.size) {
      container.ignoreReactionRemoveEvent = true;
      await message.reactions.removeAll();
    }
    let i = 0;
    for await (const x of setReactionsToMessage(
      message,
      newReactions,
      reactionAbort.signal
    )) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      container.reactions![i].rendered = x;
      ++i;
    }
  };
  container.reactionAbort?.abort();
  runUpdate(container, f);
};
export const reactionUpdateSterategyFactory = {
  local,
  force: (container: Container, newChildren?: ChildSet) => {
    const f = (message: Message) => async () => {
      const { reactionAbort, newReactions } = prepareReactionUpdate(
        container,
        newChildren
      );
      if (message.reactions.cache.size) {
        container.ignoreReactionRemoveEvent = true;
        await message.reactions.removeAll();
        container.ignoreReactionRemoveEvent = false;
      }
      let i = 0;
      for await (const x of setReactionsToMessage(
        message,
        newReactions,
        reactionAbort.signal
      )) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        container.reactions![i].rendered = x;
        ++i;
      }
    };
    container.reactionAbort?.abort();
    runUpdate(container, f);
  },
  remote: local,
} as const;
