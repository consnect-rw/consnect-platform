export enum EUserRole {
     ADMIN = 'ADMIN' ,
     USER = 'USER',
     
}

export interface IAuthUser {
     id:string;
     email: string;
     role: EUserRole;
     active: boolean;
     name:string
     phone:string
     company: {id:string, name:string, handle:string, logoUrl: string}
}
