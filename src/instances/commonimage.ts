/**
 * @packageDocumentation
 * @external
 * @module instances
 */
import { InstanceBase } from "./common";
export class CommonImageInstance<Type extends string>
  implements InstanceBase<Type, CommonImageInstance<Type>> {
  constructor(public type: Type, public src: string) {}
  cloneSelf(): CommonImageInstance<Type> {
    return new CommonImageInstance(this.type, this.src);
  }
  appendChild(): void {
    throw new Error("CommonImageInstance#appendChild");
  }
}
export type ThumbnailInstance = CommonImageInstance<"thumbnail">;
export type ImgInstance = CommonImageInstance<"img">;
