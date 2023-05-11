export interface BookingInterface {
  id: string,
  bookedAt: string,
  dateStart: string,
  dateEnd: string,
  user: {
    firstname: string;
    lastname: string;
    email: string;
    department: string;
    id: string;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
  },
  desk: {
    label: string;
    id: string;
    equipment: string[];
    fixdesk?: any;
    type: string;
    office: Office;
    createdAt: string;
    updatedAt: string;
  },
}

export interface Office {
  name: string;
  columns: number;
  rows: number;
  id: string;
  map: string;
  createdAt: string;
  updatedAt: string;

}

export interface UpdatedBy {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  isAdmin: boolean;
  department: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Fixdesk {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  updatedBy: UpdatedBy;
}

export interface BookingErrorInterface {
  message: string;
  statusCode: number;
  fixdesk: Fixdesk;
}

export interface BookingRequest{
  dateStart: string,
  dateEnd: string,
  deskId: string
}

export interface FixDeskRequest{
  desk: string
}




