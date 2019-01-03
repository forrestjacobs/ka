export enum AsyncStatus { IN_PROGRESS, RESOLVED, ERROR }

export type AsyncState<Response> =
  { status: AsyncStatus.IN_PROGRESS } |
  { status: AsyncStatus.RESOLVED; response: Response } |
  { status: AsyncStatus.ERROR; error: Error };
