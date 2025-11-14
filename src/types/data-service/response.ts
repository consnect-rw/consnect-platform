/* eslint-disable @typescript-eslint/no-explicit-any */
export enum EStatusCode {
     SUCCESS = 200,
     CREATED = 201,
     BAD_REQUEST = 400,
     NOT_FOUND = 404,
     INTERNAL_ERROR = 500, 
     UNAUTHORIZED = 401
}

export interface IServiceResponse <T =undefined> {
     success: boolean
     message:string 
     data?: T 
     statusCode: EStatusCode
     error?: any
}