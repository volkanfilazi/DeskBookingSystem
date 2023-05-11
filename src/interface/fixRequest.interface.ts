  export interface FixRequests {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: Status;
        updatedBy?: any;
        desk: Desk;
        user: User;
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

    export enum Status {
        Approved = "approved",
        Rejected = "rejected"
    }

    

    

