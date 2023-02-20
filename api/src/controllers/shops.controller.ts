import { Service } from 'typedi';
import { Controller, Get } from '../decorators/routing';
import { Request, Response } from 'express';
import { AuthMiddleware } from '../middlewares';
import { ShopHelper } from '../helpers';
import { HTTP_CODES } from '../config/http.codes';

@Service()
@Controller('/shops')
export default class ShopsController {
    constructor(private readonly shopHelper: ShopHelper) {}

    @Get('', [AuthMiddleware])
    public async getList(req: Request, res: Response) {
        const searchText = req.query.search as string;
        const response = await this.shopHelper.getAllWithSearch(searchText);
        return res.status(HTTP_CODES.SUCCESS).json(response);
    }
}
