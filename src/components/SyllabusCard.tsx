import Link from 'next/link'

export interface Syllabus {
  id: number
  title: string
  exam_name: string
  file_link: string
}

export default function SyllabusCard({ syllabus }: { syllabus: Syllabus }) {
  return (
    <div className="bg-white rounded-sm p-5 border border-gray-200 flex flex-col justify-between hover:border-blue-400 transition-colors shadow-sm relative">
      <div className="absolute top-0 left-0 w-1 h-full bg-slate-200"></div>
      {syllabus.exam_name && (
        <div className="mb-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-sm">
            {syllabus.exam_name}
          </span>
        </div>
      )}
      <h3 className="text-lg font-bold text-blue-800 mb-4 leading-snug">
        {syllabus.file_link ? (
           <a href={syllabus.file_link} target="_blank" rel="noopener noreferrer" className="hover:text-red-700 transition-colors">{syllabus.title}</a>
        ) : syllabus.title}
      </h3>
      <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
        {syllabus.file_link ? (
          <a href={syllabus.file_link} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-red-700 hover:underline uppercase tracking-wide">
            Download PDF
          </a>
        ) : (
          <span className="text-xs text-gray-400 italic">Not Available</span>
        )}
        <span className="text-[10px] text-gray-300 font-mono">#{syllabus.id}</span>
      </div>
    </div>
  )
}
