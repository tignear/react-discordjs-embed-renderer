/**
 * @packageDocumentation
 * @external
 * @module instances
 */
import { AuthorInstance } from "./author";
import { EmbedInstance } from "./embed";
import { ImgInstance, ThumbnailInstance } from "./commonimage";
import { TitleInstance } from "./title";
import { FieldInstance } from "./field";
import { FooterInstance } from "./footer";
import { TextInstance } from "./text";
import { ReactionInstance } from "./reaction";
import { RenderingMessageInstance } from "./message";
import { ReactionsInstance } from "./reactions";
export type Instance =
  | EmbedInstance
  | TitleInstance
  | AuthorInstance
  | ImgInstance
  | ThumbnailInstance
  | FieldInstance
  | FooterInstance
  | ReactionInstance
  | RenderingMessageInstance
  | ReactionsInstance;
export {
  EmbedInstance,
  TitleInstance,
  AuthorInstance,
  ImgInstance,
  ThumbnailInstance,
  FieldInstance,
  FooterInstance,
  TextInstance,
  ReactionInstance,
  RenderingMessageInstance,
  ReactionsInstance,
};
