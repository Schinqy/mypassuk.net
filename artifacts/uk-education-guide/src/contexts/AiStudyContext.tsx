import { createContext, useContext, useState, type ReactNode } from "react";

interface AiStudyContextValue {
  subjectName?: string;
  subjectLevel?: string;
  subjectCategory?: string;
  keyTopics?: string[];
  setSubjectContext: (ctx: Omit<AiStudyContextValue, "setSubjectContext"> | null) => void;
}

const AiStudyContext = createContext<AiStudyContextValue>({
  setSubjectContext: () => {},
});

export function AiStudyProvider({ children }: { children: ReactNode }) {
  const [ctx, setCtx] = useState<Omit<AiStudyContextValue, "setSubjectContext"> | null>(null);

  return (
    <AiStudyContext.Provider value={{ ...ctx, setSubjectContext: setCtx }}>
      {children}
    </AiStudyContext.Provider>
  );
}

export const useAiStudy = () => useContext(AiStudyContext);
