import { type Telemetry } from 'applicationinsights';

export const dropAADLogsTelemetryProcessor = (envelope: any): boolean => {
  const shouldDrop = envelope?.data?.baseData?.success
    && typeof envelope?.data?.baseData?.type === 'string'
    && envelope?.data?.baseData?.type.includes('InProc | Microsoft.AAD');

  return !shouldDrop;
};
