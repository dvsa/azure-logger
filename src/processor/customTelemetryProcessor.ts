import {
  EnvelopeTelemetry, TelemetryType, telemetryTypeToBaseType,
} from 'applicationinsights/out/Declarations/Contracts';
import { getObfuscatedPath, getObfuscatedUrl } from '../helpers/urlHelper';
import { BaseData } from '../interfaces';

const customTelemetryProcessor = (envelope: EnvelopeTelemetry): boolean => {
  const { data } = envelope;

  if (data.baseType === telemetryTypeToBaseType(TelemetryType.Dependency)) {
    const baseData = ((data.baseData) as BaseData);
    baseData.name = getObfuscatedPath(baseData.data);
    baseData.data = getObfuscatedUrl(baseData.data);
  }

  return true;
};

export {
  customTelemetryProcessor,
};
