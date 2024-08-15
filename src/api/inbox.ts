import type { ServerResponse, Inbox } from "@/types/api";
import client from "@/api/request";

export const getInboxes = (): ServerResponse<Inbox[]> => {
  return client.get("/v1/inboxes");
};
