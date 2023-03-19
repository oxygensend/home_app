import { Service } from 'typedi';
import { Shop } from '../../models/shop.model';

@Service()
export class ShopHelper {
    public getAllWithSearch(searchText?: string) {
        const query = Shop.find({});

        if (searchText) {
            query.where('name', new RegExp('^' + searchText, 'i'));
        }

        return query.sort({ name: 1 }).exec();
    }
}
