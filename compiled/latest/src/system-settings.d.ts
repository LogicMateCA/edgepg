import type { SemanticCommand } from "./types";
export type SystemSettingCommand = Extract<SemanticCommand, {
    kind: "system-setting";
}>;
export declare function executeSystemSettingCommand(db: D1Database, command: SystemSettingCommand): Promise<{
    command: string;
    rowCount: number;
}>;
export declare function loadSystemSettings(db: D1Database): Promise<Map<string, string>>;
export declare function forgetSystemSettings(db: D1Database): void;
export declare function rememberMissingSystemSettingsSchema(db: D1Database): void;
