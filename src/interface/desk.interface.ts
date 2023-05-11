export interface DeskRequest {
  label: string,
  office: string,
  equipment: [
    string
  ]
}

  export interface User {
      firstname: string;
      lastname: string;
      email: string;
      department: string;
      id: string;
      isAdmin: boolean;
      createdAt: string;
      updatedAt: string;
  }

  export interface Office {
    id: string;
    name: string;
    map: string;
    columns: number;
    rows: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Desk {
    id: string;
    label: string;
    type: string;
    createdAt: Date;
    updatedAt: Date;
    column: number;
    row: number;
    equipment: string[];
    fixdesk?: any;
    office: Office;
    nextBooking?: Date;
    isUserFavourite: boolean;
}




export interface GetDeskById {
  label: string,
  id: string,
  office: {
    name: string,
    columns: number,
    rows: number,
    id: string,
    map: string,
    createdAt: string,
    updatedAt: string
  },
  bookings: [
    {
      dateStart: string,
      dateEnd: string,
      id: string,
      user: {
        firstname: string,
        lastname: string,
        email: string,
        department: Deparment,
        id: string,
        isAdmin: boolean,
        createdAt: string,
        updatedAt: string
      },
      bookedAt: string
    }
  ],
  row: number,
  column: number,
  fixdesk: {

  },
  type: string,
  equipment: Equipments,
  createdAt: string,
  updatedAt: string
}

export interface Booking {
  id: string;
  bookedAt: Date;
  dateStart: Date;
  dateEnd: Date;
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    isAdmin: boolean;
    department: string;
    createdAt: Date;
    updatedAt: Date;
}
}

export interface Deparment {
  CodingSchool: string,
  Diamir: string,
  WebundSoehne: string,
  DarwinsLab: string,
  DeepDive: string,
  TailoredApps: string
}

export interface Equipments {
  HDMI: string,
  USBC: string,
  HeightAdjustable: string,
  DOCK: string,
  MONITOR: string,
  MONITOR2: string
}

export interface CommentDesk {
  comment: string,
  desk: string
}

