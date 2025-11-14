export default async function OfferPage ({params}:{params: Promise<{id:string}>}) {
     const {id} = await params;
     return (
          <div>Viewing: {id}</div>
     )
}