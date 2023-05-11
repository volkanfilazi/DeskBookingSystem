export interface FavouritesRequest{
  desk: string
}

  export interface User {
      id: string;
      firstname: string;
      lastname: string;
      email: string;
      isAdmin: boolean;
      department: string;
      createdAt: Date;
      updatedAt: Date;
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
      office: Office;
  }

  export interface FavouritesResponse {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      user: User;
      desk: Desk;
  }


