import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Nation = "england" | "wales" | "scotland" | "northern-ireland";

export const NATIONS: { id: Nation; label: string; flag: string; qualifications: string }[] = [
  { id: "england", label: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", qualifications: "GCSEs & A-Levels" },
  { id: "wales", label: "Wales", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", qualifications: "GCSEs, A-Levels & Welsh Bacc" },
  { id: "scotland", label: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", qualifications: "National 5s, Highers & Adv. Highers" },
  { id: "northern-ireland", label: "N. Ireland", flag: "🇬🇧", qualifications: "GCSEs & A-Levels (CCEA)" },
];

const LS_KEY = "mypassuk-nation";

interface NationContextValue {
  nation: Nation | null;
  setNation: (n: Nation) => void;
  showSelector: boolean;
  openSelector: () => void;
  closeSelector: () => void;
}

const NationContext = createContext<NationContextValue>({
  nation: null,
  setNation: () => {},
  showSelector: false,
  openSelector: () => {},
  closeSelector: () => {},
});

export function NationProvider({ children }: { children: ReactNode }) {
  const [nation, setNationState] = useState<Nation | null>(() => {
    const stored = localStorage.getItem(LS_KEY);
    return (stored as Nation) ?? null;
  });
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    if (!nation) {
      const timer = setTimeout(() => setShowSelector(true), 800);
      return () => clearTimeout(timer);
    }
    return;
  }, [nation]);

  const setNation = (n: Nation) => {
    setNationState(n);
    localStorage.setItem(LS_KEY, n);
    setShowSelector(false);
  };

  return (
    <NationContext.Provider value={{
      nation,
      setNation,
      showSelector,
      openSelector: () => setShowSelector(true),
      closeSelector: () => setShowSelector(false),
    }}>
      {children}
    </NationContext.Provider>
  );
}

export function useNation() {
  return useContext(NationContext);
}
