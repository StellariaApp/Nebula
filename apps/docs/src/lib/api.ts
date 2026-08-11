import registry from "../../generated/api.json";

export interface ApiProp {
  name: string;
  type: string;
  required: boolean;
  default: string | null;
  doc: string | null;
  slot: boolean;
}

export interface ApiInherited {
  group: string;
  count: number;
}

export interface ApiComponent {
  name: string;
  contract: string;
  own: ApiProp[];
  slots: ApiProp[];
  inherited: ApiInherited[];
  gaps: string[];
  subComponents: string[];
}

export interface Api {
  version: number;
  count: number;
  documented: number;
  styleProps: { count: number; page: string };
  gaps: Record<string, string[]>;
  components: ApiComponent[];
}

export const API = registry as Api;

export function FindApi(name: string): ApiComponent | undefined {
  return API.components.find((entry) => entry.name === name);
}
