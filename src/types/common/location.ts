export interface IDefaultLocation {
     id:string
     country:string
     city:string 
}

export interface IBaseLocation {
     id:string
     country:string
     city:string 
     address:string
}

export interface ILocationCreate{
     country:string
     city:string
     state?:string
     zipCode?:string
     address?:string
     company?: {connect: {id:string}}
}

export interface ILocationUpdate{
     country?:string
     city?:string
     state?:string
     zipCode?:string
     address?:string
}