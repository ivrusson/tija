import { TijaApiHandler, TijaServerSideHandler } from "@/core/types";


export function withTijaRoute<T extends TijaApiHandler>(handler: T) {
  return handler;
}

export function withTijaSsr<T extends TijaServerSideHandler>(handler: T) {
  return handler;
}