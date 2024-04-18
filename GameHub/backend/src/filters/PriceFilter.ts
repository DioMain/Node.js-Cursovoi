import { game, sale } from "@prisma/client";
import FilterBase from "./FilterBase";
import { Decimal } from "@prisma/client/runtime/library";

class PriceFilter extends FilterBase<game> {

    constructor(tag: string) {
        super(tag);
    }

    filter(elements: Array<game>, filterData: { minPrice: number, maxPrice: number }): Array<game> {
        if (filterData.minPrice == 0 && filterData.maxPrice == 0) {
            return elements;
        }
        else {
            let arr = new Array<game>();

            elements.forEach(item => {
                let sale = (item as any).sale_sale_gameTogame[0] as sale;
                let realPrice = sale ? item.priceusd.toNumber() * (1 - (sale.percent as number)) : item.priceusd.toNumber();

                if (realPrice >= filterData.minPrice && realPrice <= filterData.maxPrice)
                    arr.push(item);
            });

            return arr;
        }
    }
}

export default PriceFilter;