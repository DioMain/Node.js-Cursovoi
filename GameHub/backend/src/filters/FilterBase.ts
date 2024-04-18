abstract class FilterBase<T> {

    public Tag: string;

    constructor(tag: string) {
        this.Tag = tag;
    }
    
    abstract filter(elements: Array<T>, filterData: any): Array<T>;
}

export default FilterBase;