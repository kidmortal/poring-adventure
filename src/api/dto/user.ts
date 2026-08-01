// Payloads sent to the websocket API.
export {};

declare global {
  type CreateUserPayload = {
    name: string;
    gender: Gender;
    classId: number;
    costume?: string;
  };
}
