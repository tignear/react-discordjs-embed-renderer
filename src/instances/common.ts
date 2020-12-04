/**
 * @packageDocumentation
 * @external
 * @module instances
 */
import { Instance } from "./index";
import { TextInstance } from "./text";

export interface InstanceBase<
  Type extends string,
  T extends InstanceBase<Type, T>
> {
  cloneSelf(): T;
  type: Type;
  appendChild(child: TextInstance | Instance | null): void;
}
