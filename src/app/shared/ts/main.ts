/**
 * Easy selector helper function
 */

import {AbstractControl, ValidatorFn, ɵTypedOrUntyped} from "@angular/forms";


/**
 * Returns an object containing the values of the properties of the given form.
 *
 * @param {ɵTypedOrUntyped<any, any, { [p: string]: AbstractControl }>} f - The form object.
 * @returns {{ [p: string]: string }} - An object containing the values of the form properties.
 */
export function getResult(f: ɵTypedOrUntyped<any, any, { [p: string]: AbstractControl }>): {
  [p: string]: string;
} {
  const result: { [key: string]: string } = {};
  Object.keys(f).forEach((key: string): void => {
    result[key] = f[key].value;
  });
  return result;
}

/**
 * Returns a URLSearchParams object containing the key-value pairs from the given data object.
 *
 * @param {Record<string, string>} data - The data object.
 * @returns {URLSearchParams} - The URLSearchParams object.
 */
export function getFormEncodedData(data: Record<string, string>): URLSearchParams {
  const formEncoded: URLSearchParams = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    formEncoded.set(key, value);
  });
  return formEncoded;
}

export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const valid = /^[1-9][0-9]*$/.test(control.value);
    return valid ? null : {invalidPhoneNumber: {value: control.value}};
  };
}

