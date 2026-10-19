import crypto from 'crypto';

const W3C_TRACEPARENT_REGEX = /^([\da-f]{2})-([\da-f]{32})-([\da-f]{16})-([\da-f]{2})$/i;
const TRACE_ID_REGEX = /^[\da-f]{32}$/i;
const SPAN_ID_REGEX = /^[\da-f]{16}$/i;

export type ParsedTraceParent = {
  version: string;
  traceId: string;
  spanId: string;
  traceFlag: string;
};

function normalizeHex(value: string): string {
  return value.trim().toLowerCase();
}

export function parseTraceParent(traceParent?: string | null): ParsedTraceParent | undefined {
  const trimmedValue = traceParent?.trim();

  if (!trimmedValue) {
    return undefined;
  }

  const match = trimmedValue.match(W3C_TRACEPARENT_REGEX);

  if (!match) {
    return undefined;
  }

  return {
    version: normalizeHex(match[1]),
    traceId: normalizeHex(match[2]),
    spanId: normalizeHex(match[3]),
    traceFlag: normalizeHex(match[4]),
  };
}

export function getOperationIdFromTraceParent(traceParent?: string | null): string | undefined {
  const parsedTraceParent = parseTraceParent(traceParent);

  if (parsedTraceParent) {
    return parsedTraceParent.traceId;
  }

  return traceParent?.trim() || undefined;
}

export function getParentIdFromTraceParent(traceParent?: string | null): string | undefined {
  const parsedTraceParent = parseTraceParent(traceParent);

  if (parsedTraceParent) {
    return parsedTraceParent.spanId;
  }

  return traceParent?.trim() || undefined;
}

export function normalizeTraceId(traceId?: string | null): string | undefined {
  const parsedTraceParent = parseTraceParent(traceId);

  if (parsedTraceParent) {
    return parsedTraceParent.traceId;
  }

  if (traceId && TRACE_ID_REGEX.test(traceId.trim())) {
    return normalizeHex(traceId);
  }

  return undefined;
}

export function normalizeSpanId(spanId?: string | null): string | undefined {
  const parsedTraceParent = parseTraceParent(spanId);

  if (parsedTraceParent) {
    return parsedTraceParent.spanId;
  }

  if (spanId && SPAN_ID_REGEX.test(spanId.trim())) {
    return normalizeHex(spanId);
  }

  return undefined;
}

function randomHex(bytes: number, length: number): string {
  const randomValue = crypto.randomBytes(bytes) as unknown;

  if (Buffer.isBuffer(randomValue)) {
    return randomValue.toString('hex');
  }

  if (typeof randomValue === 'string' && randomValue.length > 0) {
    return randomValue.slice(0, length);
  }

  return crypto.randomUUID().replace(/-/g, '').slice(0, length);
}

export function createTraceId(): string {
  return randomHex(16, 32);
}

export function createSpanId(): string {
  return randomHex(8, 16);
}


