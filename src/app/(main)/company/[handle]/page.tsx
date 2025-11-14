export default async function CompanyPage ({params}:{params: Promise<{handle: string}>}) {
     const {handle} = await params;

     return (
          <div>Company Page: {handle}</div>
     )
}