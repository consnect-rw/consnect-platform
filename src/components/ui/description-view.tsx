"use client";

export const DetailedDescriptionView = ({description}:{description: string}) => {
     return (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div 
                className="prose prose-sm max-w-none prose-slate prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-sky-600 prose-strong:text-slate-900"
                dangerouslySetInnerHTML={{ __html: description ?? "" }}
              />
            </div>
     )
}