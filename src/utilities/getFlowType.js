// @flow

import Logger from '../Logger';
import isNumberType from './isNumberType';
import isStringType from './isStringType';

const log = Logger.child({
  namespace: 'getFlowType'
});

export default (databaseTypeName: string): string => {
  if (databaseTypeName === 'json' || databaseTypeName === 'jsonb') {
    return '{ [key: string]: any }';
  }

  if (databaseTypeName === 'boolean') {
    return 'boolean';
  }

  if (databaseTypeName === 'date') {
    return 'string';
  }

  if (isStringType(databaseTypeName)) {
    return 'string';
  }

  if (isNumberType(databaseTypeName)) {
    return 'number';
  }


  log.warn({
    databaseTypeName
  }, 'unknown type');

  return 'any';
};
