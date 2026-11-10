import type { ThemeTokens } from "../theme/theme-tokens";

export const managerStyle = (tokens: ThemeTokens): string => `
:root {
  --osmoz-cloud: ${tokens.osmozCloud};
  --osmoz-o: ${tokens.osmozO};
}

.osmoz-brand {
  align-items: center;
  color: ${tokens.foreground};
  display: flex;
  gap: 10px;
}

.osmoz-brand-symbol {
  height: auto;
  width: 32px;
}

.osmoz-brand-texts {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.osmoz-brand-name {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.osmoz-brand-name-mono {
  font-family: ${tokens.fontCode};
  font-size: 17px;
  letter-spacing: -0.02em;
}

.osmoz-brand-tagline {
  color: ${tokens.mutedForeground};
  font-size: 12px;
  font-weight: 400;
}

.osmoz-breadcrumb {
  color: ${tokens.mutedForeground};
  font-size: 13px;
  padding: 0 8px;
  white-space: nowrap;
}

.osmoz-breadcrumb-current {
  color: ${tokens.foreground};
  font-weight: 600;
}

.osmoz-theme-picker {
  align-items: center;
  background: ${tokens.background};
  border: 1px solid ${tokens.border};
  border-radius: 8px;
  display: flex;
  gap: 4px;
  padding: 3px;
}

.osmoz-theme-picker-label {
  align-items: center;
  color: ${tokens.mutedForeground};
  display: flex;
  font-size: 12px;
  font-weight: 600;
  gap: 6px;
  padding: 0 8px;
}

.osmoz-theme-picker-label::before {
  background: ${tokens.primary};
  border-radius: 99px;
  content: "";
  height: 8px;
  width: 8px;
}

.osmoz-theme-picker button {
  background: transparent;
  border: 0;
  border-radius: 6px;
  color: ${tokens.mutedForeground};
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  height: 26px;
  padding: 0 10px;
}

.osmoz-theme-picker button:hover {
  color: ${tokens.foreground};
}

.osmoz-theme-picker button[aria-pressed="true"] {
  background: ${tokens.foreground};
  color: ${tokens.background};
}

.osmoz-theme-picker button:focus-visible {
  outline: 2px solid ${tokens.primary};
  outline-offset: 2px;
}

div:has(> div > .sidebar-header) {
  gap: 24px !important;
  padding: 24px 16px !important;
}

.sidebar-subheading[data-nodetype="root"]:not(:first-child) {
  margin-top: 24px !important;
}

.sidebar-subheading button {
  font-weight: 600 !important;
  letter-spacing: 0.06em !important;
}

.search-field {
  border-radius: 6px !important;
}

.sidebar-item {
  border-radius: 6px;
}

.sidebar-item a,
.sidebar-item > button {
  font-size: 13px !important;
}

[data-testid="sb-preview-toolbar"],
[data-testid="sb-preview-toolbar"] > div {
  height: 56px !important;
  min-height: 56px !important;
}

[data-testid="sb-preview-toolbar"] > div {
  margin: 0 40px !important;
}

.sidebar-item[data-selected="true"],
.sidebar-item[data-selected="true"] a svg {
  background: ${tokens.accent} !important;
  color: ${tokens.accentForeground} !important;
}

.sidebar-item[data-selected="true"] :is([data-testid="context-menu"], [data-testid="tree-change-status-button"]) {
  background: ${tokens.accent} !important;
}

.sidebar-item :is([data-testid="context-menu"], [data-testid="tree-change-status-button"]) svg {
  color: inherit !important;
}

.sidebar-item[data-selected="true"] {
  font-weight: 600;
}

.sidebar-item :is([data-testid="context-menu"], [data-testid="tree-change-status-button"]) {
  border-radius: 6px;
  box-shadow: none !important;
  color: ${tokens.mutedForeground} !important;
}

.sidebar-item :is([data-testid="context-menu"], [data-testid="tree-change-status-button"]):hover {
  background: ${tokens.muted} !important;
  color: ${tokens.foreground} !important;
}

[role="tab"] {
  color: ${tokens.mutedForeground} !important;
}

[role="tab"][aria-selected="true"] {
  color: ${tokens.primary} !important;
}
`;
