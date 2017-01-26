
export default class Model<T>  {
    constructor(obj?: any)
    find(obj?: any): Model<T>
    skip(number?: any): Model<T>
    limit(number?: any): Model<T>
    findByText(str: string);

    projection(str: string); Model<T>
    sort(key: any, direction?: string) : Model<T>;
    set(obj: any, value?: any);
    get(key: string, defaultValue?: any): any
    getStringId(): string
    toJSON(): any;
    unset(key: string): T
    inArray(target: Model<any>): boolean
    required(message?: string): T
    with(key: string, obj: Model<any> | { (...args): any }): T
    exclude(target: Model<any>, key: string)
    add(target: Model<any>, key: string): Promise<Model<T>>
    equals(target: Model<any>): boolean

    save(): Promise<Model<T>>
    remove(): Promise<Model<T>>;
    removeAll(): Promise<any>
    first(): Promise<Model<T>>
    count(): Promise<number>
    firstRandom(): Promise<Model<T>>
    all(): Promise<Model<T>[]>

    paginate(obj: any): Promise<any>
    drop(): Promise<any>
    static drop(): Promise<any>
    static find<U>(obj?: any): Model<U>;
    static createCollection(opts? : any);
    static collectionExists(name? : string) : Promise<boolean>;
    static tail(opts? : any, criteria? : any) : Promise<any>;
    static getConnection() : any;
}
