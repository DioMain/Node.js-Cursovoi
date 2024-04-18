import { game } from "@prisma/client";
import FilterBase from "./FilterBase";
import { Decimal } from "@prisma/client/runtime/library";

class TagFilter extends FilterBase<game> {

    constructor(tag: string) {
        super(tag);
    }

    filter(elements: Array<game>, filterData: string): Array<game> {
        if (filterData === "") {
            return elements;
        }
        else {
            let arr = new Array<game>();

            elements.forEach(item => {
                let filterTags = filterData.split(',').map(item => item.trim());
                let gameTags = (item.tags as string).split(',').map(item => item.trim());

                if (filterTags.some(filterTag => gameTags.some(gameTag => filterTag === gameTag)))
                    arr.push(item);
            });

            return arr;
        }
    }
}

export default TagFilter;