/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "cosmos.base.store.v1beta1";

/**
 * CommitInfo defines commit information used by the multi-store when committing
 * a version/height.
 */
export interface CommitInfo {
  version: number;
  store_infos: StoreInfo[];
}

/**
 * StoreInfo defines store-specific commit information. It contains a reference
 * between a store name and the commit ID.
 */
export interface StoreInfo {
  name: string;
  commit_id: CommitID | undefined;
}

/**
 * CommitID defines the committment information when a specific store is
 * committed.
 */
export interface CommitID {
  version: number;
  hash: Uint8Array;
}

const baseCommitInfo: object = { version: 0 };

export const CommitInfo = {
  encode(
    message: CommitInfo,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.version !== 0) {
      writer.uint32(8).int64(message.version);
    }
    for (const v of message.store_infos) {
      StoreInfo.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CommitInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseCommitInfo } as CommitInfo;
    message.store_infos = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.version = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.store_infos.push(StoreInfo.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CommitInfo {
    const message = { ...baseCommitInfo } as CommitInfo;
    message.version =
      object.version !== undefined && object.version !== null
        ? Number(object.version)
        : 0;
    message.store_infos = (object.store_infos ?? []).map((e: any) =>
      StoreInfo.fromJSON(e)
    );
    return message;
  },

  toJSON(message: CommitInfo): unknown {
    const obj: any = {};
    message.version !== undefined &&
      (obj.version = Math.round(message.version));
    if (message.store_infos) {
      obj.store_infos = message.store_infos.map((e) =>
        e ? StoreInfo.toJSON(e) : undefined
      );
    } else {
      obj.store_infos = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CommitInfo>, I>>(
    object: I
  ): CommitInfo {
    const message = { ...baseCommitInfo } as CommitInfo;
    message.version = object.version ?? 0;
    message.store_infos =
      object.store_infos?.map((e) => StoreInfo.fromPartial(e)) || [];
    return message;
  },
};

const baseStoreInfo: object = { name: "" };

export const StoreInfo = {
  encode(
    message: StoreInfo,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.commit_id !== undefined) {
      CommitID.encode(message.commit_id, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StoreInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseStoreInfo } as StoreInfo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.commit_id = CommitID.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StoreInfo {
    const message = { ...baseStoreInfo } as StoreInfo;
    message.name =
      object.name !== undefined && object.name !== null
        ? String(object.name)
        : "";
    message.commit_id =
      object.commit_id !== undefined && object.commit_id !== null
        ? CommitID.fromJSON(object.commit_id)
        : undefined;
    return message;
  },

  toJSON(message: StoreInfo): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.commit_id !== undefined &&
      (obj.commit_id = message.commit_id
        ? CommitID.toJSON(message.commit_id)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<StoreInfo>, I>>(
    object: I
  ): StoreInfo {
    const message = { ...baseStoreInfo } as StoreInfo;
    message.name = object.name ?? "";
    message.commit_id =
      object.commit_id !== undefined && object.commit_id !== null
        ? CommitID.fromPartial(object.commit_id)
        : undefined;
    return message;
  },
};

const baseCommitID: object = { version: 0 };

export const CommitID = {
  encode(
    message: CommitID,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.version !== 0) {
      writer.uint32(8).int64(message.version);
    }
    if (message.hash.length !== 0) {
      writer.uint32(18).bytes(message.hash);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CommitID {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseCommitID } as CommitID;
    message.hash = new Uint8Array();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.version = longToNumber(reader.int64() as Long);
          break;
        case 2:
          message.hash = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CommitID {
    const message = { ...baseCommitID } as CommitID;
    message.version =
      object.version !== undefined && object.version !== null
        ? Number(object.version)
        : 0;
    message.hash =
      object.hash !== undefined && object.hash !== null
        ? bytesFromBase64(object.hash)
        : new Uint8Array();
    return message;
  },

  toJSON(message: CommitID): unknown {
    const obj: any = {};
    message.version !== undefined &&
      (obj.version = Math.round(message.version));
    message.hash !== undefined &&
      (obj.hash = base64FromBytes(
        message.hash !== undefined ? message.hash : new Uint8Array()
      ));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CommitID>, I>>(object: I): CommitID {
    const message = { ...baseCommitID } as CommitID;
    message.version = object.version ?? 0;
    message.hash = object.hash ?? new Uint8Array();
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  throw "Unable to locate global object";
})();

const atob: (b64: string) => string =
  globalThis.atob ||
  ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; ++i) {
    arr[i] = bin.charCodeAt(i);
  }
  return arr;
}

const btoa: (bin: string) => string =
  globalThis.btoa ||
  ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr: Uint8Array): string {
  const bin: string[] = [];
  for (const byte of arr) {
    bin.push(String.fromCharCode(byte));
  }
  return btoa(bin.join(""));
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<
        Exclude<keyof I, KeysOfUnion<P>>,
        never
      >;

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
