export interface PlPgSqlParseTree {
    plpgsql_funcs: Array<Record<string, unknown>>;
}
export declare function parsePlPgSql(definition: string): Promise<PlPgSqlParseTree>;
