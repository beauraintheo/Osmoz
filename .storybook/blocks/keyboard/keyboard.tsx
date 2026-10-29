import type { ReactElement, ReactNode } from "react";

import "./keyboard.css";

interface KeyboardProps {
  children: ReactNode;
}

interface KeyProps {
  children: ReactNode;
  keys: string[];
}

interface ShortcutProps {
  shortcut: string;
}

const Shortcut = ({ shortcut }: ShortcutProps): ReactElement => {
  const keys = shortcut.split("+");

  return keys.length === 1 ? (
    <kbd>{shortcut}</kbd>
  ) : (
    <kbd className="osmoz-key-combination">
      {keys.map((key) => (
        <kbd key={key}>{key}</kbd>
      ))}
    </kbd>
  );
};

export const Keyboard = ({ children }: KeyboardProps): ReactElement => (
  <dl className="osmoz-keyboard sb-unstyled">{children}</dl>
);

export const Key = ({ children, keys }: KeyProps): ReactElement => (
  <div className="osmoz-key">
    <dt>
      {keys.map((shortcut) => (
        <Shortcut key={shortcut} shortcut={shortcut} />
      ))}
    </dt>
    <dd>{children}</dd>
  </div>
);
