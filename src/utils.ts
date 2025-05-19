import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';

export const isIdValid = (id: string) => {
  return uuidValidate(id) && uuidVersion(id) === 4;
};
