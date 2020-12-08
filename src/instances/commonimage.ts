/**
 * @packageDocumentation
 * @external
 * @module instances
 */
import { RenderError } from "../renderer/error";
import { InstanceBase } from "./common";
export class CommonImageInstance<Type extends string>
  implements InstanceBase<Type, CommonImageInstance<Type>> {
  constructor(public type: Type, public src: string) {}
  cloneSelf(): CommonImageInstance<Type> {
    return new CommonImageInstance(this.type, this.src);
  }
  appendChild(child: unknown): void {
    throw new RenderError("CommonImageInstance#appendChild", {
      child,
      self: this,
    });
  }
}
export type ThumbnailInstance = CommonImageInstance<"thumbnail">;
export type ImgInstance = CommonImageInstance<"img">;
