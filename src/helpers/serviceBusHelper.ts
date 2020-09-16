import { Context } from '@azure/functions';

function getServiceBusOperationId(context: Context): string | undefined {
  if (context?.bindingData?.userProperties?.operationId) {
    return context?.bindingData?.userProperties?.operationId;
  }
  return undefined;
}

function getServiceBusParentId(context: Context): string | undefined {
  if (context?.bindingData?.userProperties?.parentId) {
    return context?.bindingData?.userProperties?.parentId;
  }
  return undefined;
}

export {
  getServiceBusOperationId,
  getServiceBusParentId,
};
