import type { ReactElement, ReactNode } from "react";

import "./guidelines.css";

interface GuidelinesProps {
  children: ReactNode;
}

interface GuidelineProps {
  children: ReactNode;
  kind: "do" | "avoid";
  title: string;
}

const DoIcon = (): ReactElement => (
  <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
    <path
      d="M5 12l5 5L20 7"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
    />
  </svg>
);

const AvoidIcon = (): ReactElement => (
  <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
  </svg>
);

export const Guidelines = ({ children }: GuidelinesProps): ReactElement => (
  <div className="osmoz-guidelines">{children}</div>
);

export const Guideline = ({ children, kind, title }: GuidelineProps): ReactElement => (
  <section className="osmoz-guideline" data-kind={kind}>
    <h3 className="osmoz-guideline-title">
      {kind === "do" ? <DoIcon /> : <AvoidIcon />}
      {title}
    </h3>
    {children}
  </section>
);
