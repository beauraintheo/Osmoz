import { useLayoutEffect, useRef, useState } from "react";
import type { ReactElement, ReactNode } from "react";

import { readToken } from "./read-token";
import type { TokenValue } from "./read-token";

import "./tokens.css";

interface TokensProps {
  children: ReactNode;
}

interface TokenProps {
  children: ReactNode;
  name: string;
}

export const Tokens = ({ children }: TokensProps): ReactElement => (
  <ul className="osmoz-tokens sb-unstyled">{children}</ul>
);

export const Token = ({ children, name }: TokenProps): ReactElement => {
  const item = useRef<HTMLLIElement>(null);
  const [token, setToken] = useState<TokenValue>({ color: false, value: "" });
  const variable = `--${name}`;

  useLayoutEffect(() => {
    const element = item.current;
    const themed = element?.closest("[data-theme]") ?? null;

    if (element === null) {
      return;
    }

    const read = (): void => {
      setToken(readToken(element, name));
    };

    read();

    if (themed === null) {
      return;
    }

    const observer = new MutationObserver(read);

    observer.observe(themed, { attributeFilter: ["data-theme"] });

    return (): void => {
      observer.disconnect();
    };
  }, [name]);

  return (
    <li className="osmoz-token" ref={item}>
      <span
        aria-hidden="true"
        className="osmoz-token-swatch"
        data-color={token.color}
        style={token.color ? { background: token.value } : undefined}
      />
      <span className="osmoz-token-name">
        <code>{variable}</code>
        <span className="osmoz-token-value">{token.value}</span>
      </span>
      <span className="osmoz-token-role">{children}</span>
    </li>
  );
};
