export interface NebulaPermissions {}

export type PermissionKey =
  NebulaPermissions extends { keys: infer K extends string } ? K : string;

export type PermissionDeniedMode = "hide" | "disable";

export interface PermissionProps {
  permission?: PermissionKey | undefined;
  permissionMode?: PermissionDeniedMode | undefined;
}
