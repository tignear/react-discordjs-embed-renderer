/**
 * @packageDocumentation
 * @module react-discordjs-embed-renderer
 */
import {
  ColorResolvable,
  Message,
  MessageReaction,
  MessageReactionResolvable,
  PartialMessage,
  User,
} from "discord.js";
import * as React from "react";
export type TimestampType = number | Date | boolean | undefined;
export type ReactionAddHandler = (
  reaction: MessageReaction,
  user: User
) => void | Promise<void>;
export type ReactionRemoveHandler = (
  reaction: MessageReaction,
  user: User
) => boolean | void | Promise<boolean | void>;
export type ReactionRemoveEmojiHandler = (
  reaction: MessageReaction
) => boolean | void | Promise<boolean | void>;
export type ReactionRemoveAllHandler = (
  message: Message | PartialMessage
) => boolean | void | Promise<boolean | void>;
/**
 * @external
 * @param elementName
 */
function element<T>(elementName: string): React.FC<T> {
  return (props) => React.createElement(elementName, props);
}
/**
 * This is root for library.
 * @category Elements
 */
export const RenderingMessage: React.FC<RenderingMessageProps> = element(
  "discordjs_message"
);
/**
 * Property of {@link RenderingMessage}.
 * @category Elements
 */
interface RenderingMessageProps {
  /**
   * Accept the following elements.
   * - string(represents [Discord Api Message](https://discord.com/developers/docs/resources/channel#message-object) content)
   * - {@link Embed}
   * - {@link Reactions}
   */
  children: React.ReactNode;
}
/**
 * Represents [Discord Api Embed](https://discord.com/developers/docs/resources/channel#embed-object-embed-structure).
 * @category Elements
 */
export const Embed: React.FC<EmbedProps> = element("discordjs_embed");
/**
 * Property of {@link Embed}.
 * @category Elements
 */
interface EmbedProps {
  /**
   * [Discord Api Embed](https://discord.com/developers/docs/resources/channel#embed-object-embed-structure) color.
   */
  color?: ColorResolvable;
  /**
   * [Discord Api Embed](https://discord.com/developers/docs/resources/channel#embed-object-embed-structure) timestamp<br>
   * If true, timestamp updates with message editing(synchronizing).
   * Otherwise, follow [Discord.js behavior](https://discord.js.org/#/docs/main/stable/class/MessageEmbed?scrollTo=setTimestamp).
   */
  timestamp?: TimestampType;
  /**
   * Accept the following elements.
   * Can only at most once use excluding Field Element.
   * - string(represents [Discord Api Embed](https://discord.com/developers/docs/resources/channel#embed-object-embed-structure) description).
   * - {@link Author}
   * - {@link Title}
   * - {@link Img}
   * - {@link Thumbnail}
   * - {@link Field}
   * - {@link Footer}
   * */
  children?: React.ReactNode;
}
/**
 * Represents [Discord Api Embed author](https://discord.com/developers/docs/resources/channel#embed-object-embed-author-structure).
 * @category Elements
 */
export const Author: React.FC<AuthorProps> = element("discordjs_author");
/**
 * Property of {@link Author}.
 * @category Elements
 */
interface AuthorProps {
  /**
   * Accept only string.
   * Represents [Discord Api Embed author](https://discord.com/developers/docs/resources/channel#embed-object-embed-author-structure) name.
   */
  children: string | React.ReactNode;
  /**
   * Represents [Discord Api Embed author](https://discord.com/developers/docs/resources/channel#embed-object-embed-author-structure) url.
   */
  url?: string;
  /**
   * Represents [Discord Api Embed author](https://discord.com/developers/docs/resources/channel#embed-object-embed-author-structure) icon_url.
   */
  icon?: string;
}
/**
 * Represents [Discord Api Embed](https://discord.com/developers/docs/resources/channel#embed-object-embed-structure) title and url.
 * @category Elements
 */
export const Title: React.FC<TitleProps> = element("discordjs_title");
/**
 * Property of {@link Title}.
 * @category Elements
 */
interface TitleProps {
  /**
   * Accept only string.
   * Represents [Discord Api Embed](https://discord.com/developers/docs/resources/channel#embed-object-embed-structure) title.
   */
  children: string | React.ReactNode;
  /**
   * Represents [Discord Api Embed](https://discord.com/developers/docs/resources/channel#embed-object-embed-structure) url.
   */
  url?: string;
}
/**
 * Represents [Discord Api Embed image](https://discord.com/developers/docs/resources/channel#embed-object-embed-image-structure)
 * @category Elements
 */
export const Img: React.FC<ImgProps> = element("discordjs_img");
/**
 * Property of {@link Img}.
 * @category Elements
 */
interface ImgProps {
  /**
   * Represents [Discord Api Embed image](https://discord.com/developers/docs/resources/channel#embed-object-embed-image-structure) url.
   */
  src: string;
}
/**
 * Represents [Discord Api Embed thumbnail](https://discord.com/developers/docs/resources/channel#embed-object-embed-thumbnail-structure)
 * @category Elements
 */
export const Thumbnail: React.FC<ThumbnailProps> = element(
  "discordjs_thumbnail"
);
/**
 * Property of {@link Thumbnail}.
 * @category Elements
 */
interface ThumbnailProps {
  /**
   * Represents [Discord Api Embed thumbnail](https://discord.com/developers/docs/resources/channel#embed-object-embed-thumbnail-structure) url.
   */
  src: string;
}
/**
 * Represents [Discord Api Embed field](https://discord.com/developers/docs/resources/channel#embed-object-embed-field-structure)
 * @category Elements
 */
export const Field: React.FC<FieldProps> = element("discordjs_field");
/**
 * Property of {@link Field}.
 * @category Elements
 */
interface FieldProps {
  /**
   * Represents [Discord Api Embed field](https://discord.com/developers/docs/resources/channel#embed-object-embed-field-structure) name.
   */
  name: string;
  /**
   * Represents [Discord Api Embed field](https://discord.com/developers/docs/resources/channel#embed-object-embed-field-structure) inline.
   */
  inline?: boolean;
  /**
   * Accept only string.
   * Represents [Discord Api Embed field](https://discord.com/developers/docs/resources/channel#embed-object-embed-field-structure) value.
   */
  children: string | React.ReactNode;
}
/**
 * Represents [Discord Api Embed footer](https://discord.com/developers/docs/resources/channel#embed-object-embed-footer-structure).
 * @category Elements
 */
export const Footer: React.FC<FooterProps> = element("discordjs_footer");
/**
 * Property of {@link Footer}.
 * @category Elements
 */
interface FooterProps {
  /**
   * Represents [Discord Api's Embed footer](https://discord.com/developers/docs/resources/channel#embed-object-embed-footer-structure) icon_url.
   */
  icon?: string;
  /**
   * Accept only string.
   * Represents [Discord Api's Embed footer](https://discord.com/developers/docs/resources/channel#embed-object-embed-footer-structure) text.
   */
  children: string | React.ReactNode;
}
/**
 * Represents client user reaction.
 * @category Elements
 */
export const Reaction: React.FC<ReactionProps> = element("discordjs_reaction");
/**
 * Property of {@link Reaction}.
 * @category Elements
 */
interface ReactionProps {
  /**
   * Accept only (EmojiIdentifierResolvable)[https://discord.js.org/#/docs/main/stable/typedef/EmojiIdentifierResolvable].
   */
  children: MessageReactionResolvable | React.ReactNode;
  /**
   * Handler of onReactionAdd.
   */
  onReactionAdd?: ReactionAddHandler;
  /**
   * Handler of onReactionRemove.
   * If returns true, libraries default behavior canceled.
   */
  onReactionRemove?: ReactionRemoveHandler;
  /**
   * Handler of onReactionRemoveEmoji.
   * If returns true, libraries default behavior canceled.
   */
  onReactionRemoveEmoji?: ReactionRemoveEmojiHandler;
}
/**
 * Represents client user reactions.
 * @category Elements
 */
export const Reactions: React.FC<ReactionsProps> = element(
  "discordjs_reactions"
);
/**
 * Property of {@link Reactions}.
 * @category Elements
 */
interface ReactionsProps {
  /**
   * Accept only {@link Reaction}
   */
  children: React.ReactNode;
  /**
   * If sets ``local``, it will be updated if an update is confirmed locally(Virtual DOM level).
   * If sets ``remote``, it will be updated if an update is confirmed with remote(received gateway API message).
   * If sets ``force``, update anyway.
   */
  strategy?: "local" | "remote" | "force";
  /**
   * Handler of onReactionRemoveAll.
   * If returns true, libraries default behavior canceled.
   */
  onReactionRemoveAll?: ReactionRemoveAllHandler;
}
