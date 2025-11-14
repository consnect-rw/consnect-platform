export default async function TenderPage ({params}:{params: Promise<{id:string}>}) {
     const {id} = await params;
     return (
          <div>Viewind Tender: {id}</div>
     )
}