import {UserJwt} from "../../weche-space/portail/menu-connexion/models/user-jwt";

/**
 * Retrieves the value associated with the given name from the local storage.
 *
 * @param {string} name - The name of the value to retrieve.
 * @returns {string | undefined} - The value associated with the given name, or undefined if it does not exist.
 */
export function getLocalStorageData(name: string): string | undefined {
  const lsValue: string | null = localStorage.getItem(name);
  return lsValue ?? undefined;
}

/**
 * Sets the value associated with the given name in the local storage.
 *
 * @param {string} name - The name of the value.
 * @param {any} data - The data to store.
 */
export function setLocalStorageData(name: string, data: any): void {
  localStorage.setItem(name, data);
}

/**
 * Removes the value associated with the given name from the local storage.
 *
 * @param {string} name - The name of the value to remove.
 */
export function removeLocalStorageData(name: string): void {
  localStorage.removeItem(name);
}


/**
 * Retrieves the JWT data associated with the given name from local storage and parses it as a UserJwt object.
 *
 * @param {string} name - The name of the JWT data in local storage.
 * @returns {UserJwt | undefined} - The parsed UserJwt object, or undefined if there was an error.
 */
export function getJwtLocalDataStorage(name: string): UserJwt | undefined {
  try {
    const lsValue = getLocalStorageData(name);
    if (!lsValue) {
      return undefined;
    }

    return JSON.parse(lsValue);
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
