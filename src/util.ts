/**
 * @packageDocumentation
 * @module react-discordjs-embed-renderer
 */
import { EventEmitter } from "events";
/**
 * Complete setup forwarding with the event name.<br>
 * {@see forwardEvent}
 */
export type ForwardFunc = (k: string) => void;
/**
 * Forward event from source to destination.
 * ```typescript
 * const client = new Client();
 * const renderer = new Renderer(() => client.user);
 * const forward = forwardEvent(client,renderer);
 * forward("messageDelete");
 * ```
 * @param source Event source object.
 * @param destination Event destination object.
 */
export function forwardEvent(
  source: EventEmitter,
  destination: EventEmitter
): ForwardFunc {
  return (k) => {
    source.on(k, (...rest) => destination.emit(k, ...rest));
  };
}
