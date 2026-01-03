export interface CaseStudy {
  name: string;
  scenario: string;
  aiSolution: string;
  expertLogic: string;
  tags: string[];
}

export interface SimulationCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  description_before: string;
  description_after: string;
  impact_before: string;
  impact_after: string;
  pose: 'guide' | 'success' | 'work' | 'insight';
  cases: CaseStudy[];
}

export interface NavItem {
  label: string;
  href: string;
}