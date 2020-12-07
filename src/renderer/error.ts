/**
 * @packageDocumentation
 * @internal
 * @module react-discordjs-embed-renderer
 */
/**
 * An error that wraps the error that occurred in this library.
 */
export class RenderError extends Error {
  constructor(
    message: string,
    public ctx: Record<string, unknown>,
    public cause?: unknown
  ) {
    super(message);
  }
}
