export default interface Mod {
    id: number;
    name: string;
    description: string;
    author: string;
    version: string;
    dependencies: string[];
    status: "mounted" | "deactive" | "not-mounted";
    client_file: string;
    server_file: string;
    
    new_server_file: string | null;
    new_client_file: string | null;

    assets_dir: string;
    last_cache_client_ts: number;
    last_cache_server_ts: number;

    last_updated_ts: number; // timestamp

    server_instance: any;
    priority: number;
    tsconfig?: any;
}