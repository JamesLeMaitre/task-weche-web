import {Injectable} from '@angular/core';
import {RxStomp} from "@stomp/rx-stomp";
import {rxStompConfig} from "../../event-stomp.config";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService extends RxStomp {
  constructor() {
    super();
  }
}

/**
 * Factory function to create an instance of RxStomp service.
 *
 * @returns {RxStomp} - An instance of RxStomp service.
 */
export function rxStompServiceFactory(): RxStomp {
  const rxStomp = new WebsocketService();
  rxStomp.configure(rxStompConfig);
  rxStomp.activate();
  return rxStomp;
}

