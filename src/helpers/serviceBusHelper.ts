import { Context } from '@azure/functions';

function getServiceBusOperationId(context: Context): string | undefined {
  if (context?.bindingData?.applicationProperties?.operationId) {
    return context?.bindingData?.applicationProperties?.operationId;
  }
  return undefined;
}

function getServiceBusParentId(context: Context): string | undefined {
  if (context?.bindingData?.applicationProperties?.parentId) {
    return context?.bindingData?.applicationProperties?.parentId;
  }
  return undefined;
}

export {
  getServiceBusOperationId,
  getServiceBusParentId,
};
