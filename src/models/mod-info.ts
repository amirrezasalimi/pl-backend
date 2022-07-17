export default interface ModInfo{
    id: number;
    name: string;
    description?: string;
    author?: string;
    version?: string;
    dependencies?: string[];
    disabled?: boolean;
    assets?: []
    priority?: number;
}