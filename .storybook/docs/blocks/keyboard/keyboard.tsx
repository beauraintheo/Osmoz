import type { ReactElement, ReactNode } from "react";

import { KEYBOARD_MESSAGES } from "./keyboard-messages";
import { splitShortcut } from "./split-shortcut";

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
  const keys = splitShortcut(shortcut);

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
  <table className="osmoz-keyboard">
    <thead>
      <tr>
        <th scope="col">{KEYBOARD_MESSAGES.columns.key}</th>
        <th scope="col">{KEYBOARD_MESSAGES.columns.action}</th>
      </tr>
    </thead>
    <tbody>{children}</tbody>
  </table>
);

export const Key = ({ children, keys }: KeyProps): ReactElement => (
  <tr className="osmoz-key">
    <th scope="row">
      <span className="osmoz-key-shortcuts">
        {keys.map((shortcut) => (
          <Shortcut key={shortcut} shortcut={shortcut} />
        ))}
      </span>
    </th>
    <td>{children}</td>
  </tr>
);
