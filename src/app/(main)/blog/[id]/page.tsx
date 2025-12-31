export default async function BlogPage({params}:{params: Promise<{id:string}>}) {
     const {id} = await params;
     return (
          <div className="p-12 my-8 max-w-7xl w-full mx-auto bg-gray-200 rounded-xl">
               <p className="text-lg font-bold text-gray-800">Under development</p>
          </div>
     )
}