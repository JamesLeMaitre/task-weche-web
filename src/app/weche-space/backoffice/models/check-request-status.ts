import {User} from "../../portail/menu-connexion/models/user";

export class CheckRequestStatus {
  id!: string;
  requestNumber!: string;
  requestStatus!: string;
  user!: User;
  comment!: string;
  createdAt!: number;
  createdBySupAt!: number;
  createByDpafAt!: number
}
