/**
 * @packageDocumentation
 * @external
 * @module instances
 */
import { Instance } from "./index";
import { InstanceBase } from "./common";
export class AuthorInstance implements InstanceBase<"author", AuthorInstance> {
  icon?: string;
  url?: string;
  value!: string;
  type: "author" = "author";
  constructor(obj: { icon?: string; url?: string }) {
    Object.assign(this, obj);
  }
  cloneSelf(): AuthorInstance {
    return new AuthorInstance({ icon: this.icon, url: this.url });
  }
  appendChild(child: string | Instance | null): void {
    if (typeof child === "string") {
      this.value = child;
      return;
    }
    throw new TypeError("AuthorInstance#appendChild");
  }
}
