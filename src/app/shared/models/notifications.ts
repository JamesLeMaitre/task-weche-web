import {User} from "../../weche-space/portail/menu-connexion/models/user";

/**
 * Represents a notification.
 */
export class Notifications {
  /**
   * The ID of the notification.
   */
  id!: string;

  /**
   * The user associated with the notification.
   */
  user!: User;

  /**
   * The message of the notification.
   */
  message!: string;

  /**
   * Indicates whether the notification has been read.
   */
  read!: boolean;
}
