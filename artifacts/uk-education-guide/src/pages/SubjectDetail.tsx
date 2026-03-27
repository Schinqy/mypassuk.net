import { useParams, Link } from "wouter";
import { useEffect } from "react";
import { useGetSubjectById } from "@workspace/api-client-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ArrowLeft, BookOpen, CheckCircle, FileText, Globe, Lightbulb, PlayCircle } from "lucide-react";
import { useAiStudy } from "@/contexts/AiStudyContext";

export default function SubjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: subject, isLoading, error } = useGetSubjectById(Number(id));
  const { setSubjectContext } = useAiStudy();

  useEffect(() => {
    if (subject) {
      setSubjectContext({
        subjectName: subject.name,
        subjectLevel: subject.level,
        subjectCategory: subject.category,
        keyTopics: subject.keyTopics ?? [],
      });
    }
    return () => setSubjectContext(null);
  }, [subject, setSubjectContext]);

  if (isLoading) return <LoadingSpinner className="mt-32" />;
  if (error || !subject) return <div className="text-center mt-32 text-red-500 font-bold text-xl">Subject not found</div>;

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'Video': return <PlayCircle className="w-5 h-5 text-red-500" />;
      case 'Past Papers': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'Revision Guide': return <BookOpen className="w-5 h-5 text-emerald-500" />;
      default: return <Globe className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-32">
      {/* Header Banner */}
      <div className="bg-foreground text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <Link href="/subjects" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to all subjects
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-md">
              {subject.level}
            </span>
            <span className="px-3 py-1 bg-accent/20 text-accent-foreground rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-md">
              {subject.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{subject.name}</h1>
          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl">
            {subject.description}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 gap-8">

          {/* Assessment & Boards */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-8 justify-between items-center">
            <div className="w-full">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Assessment Structure</h3>
              <p className="text-lg font-medium text-slate-900">{subject.assessmentStructure || "Standard written examinations."}</p>
            </div>
            <div className="w-full md:text-right border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Exam Boards</h3>
               <div className="flex flex-wrap gap-2 md:justify-end">
                 {subject.examBoards?.map(board => (
                   <span key={board} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold">
                     {board}
                   </span>
                 ))}
               </div>
            </div>
          </div>

          {/* Key Topics & Tips Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            {/* Key Topics */}
            <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2.5 rounded-xl"><BookOpen className="w-6 h-6 text-blue-600" /></div>
                <h2 className="text-2xl font-bold">Key Topics</h2>
              </div>
              <ul className="space-y-4">
                {subject.keyTopics?.map((topic, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Study Tips */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 shadow-md border border-indigo-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-100 p-2.5 rounded-xl"><Lightbulb className="w-6 h-6 text-indigo-600" /></div>
                <h2 className="text-2xl font-bold text-indigo-950">Study Tips</h2>
              </div>
              <ul className="space-y-4">
                {subject.studyTips?.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-indigo-900/80">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 mt-2 shrink-0" />
                    <span className="leading-relaxed font-medium">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Resources */}
          {subject.usefulResources && subject.usefulResources.length > 0 && (
            <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-100 mt-4">
              <h2 className="text-2xl font-bold mb-6">Useful Resources</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subject.usefulResources.map((res, i) => (
                  <a
                    key={i}
                    href={res.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-primary/30 hover:bg-slate-50 transition-all group"
                  >
                    <div className="p-3 bg-slate-100 rounded-xl group-hover:scale-110 transition-transform">
                      {getResourceIcon(res.type)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{res.name}</h4>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">{res.type}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
