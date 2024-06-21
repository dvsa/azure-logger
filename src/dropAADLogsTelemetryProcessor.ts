import { EnvelopeTelemetry } from 'applicationinsights/out/Declarations/Contracts';

export const dropAADLogsTelemetryProcessor = (envelope: EnvelopeTelemetry): boolean => {
  const shouldDrop = envelope?.data?.baseData?.success
    && typeof envelope?.data?.baseData?.type === 'string'
    && envelope?.data?.baseData?.type.includes('InProc | Microsoft.AAD');

  return !shouldDrop;
};
