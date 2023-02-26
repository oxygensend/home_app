import {BalanceType} from "../../types";

type BalanceTableType = {
    balance: BalanceType[]
    total: number
}

export const BalanceTable = ({balance, total}: BalanceTableType) => {

    const totalSum: number = balance
        .map(item => item.totalAmount)
        .reduce((prev, curr) => prev + curr, 0);

    return (
        <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs  uppercase bg-pink-600 text-gray-200">
            <tr>
                <th scope="col" className="px-6 py-3 rounded-l-lg">
                    Executor
                </th>
                <th scope="col" className="px-6 py-3">
                    Qty
                </th>
                <th scope="col" className="px-6 py-3 rounded-r-lg">
                    Total
                </th>
            </tr>
            </thead>
            <tbody>
            {balance
                ? balance.map((b, i) => {
                    return (
                        <tr className="bg-gray-800">
                            <th
                                scope="row"
                                className="px-6 py-4 font-medium  whitespace-nowrap text-white"
                            >
                                {b.executor}
                            </th>
                            <td className="px-6 py-4">
                                {b.expensesCount}
                            </td>
                            <td className="px-6 py-4">
                                {b.totalAmount + ' zł'}
                            </td>
                        </tr>
                    );
                })
                : null}
            </tbody>
            <tfoot>
            <tr className="font-semibold text-white">
                <th scope="row" className="px-6 py-3 text-base">
                    Total
                </th>
                <td className="px-6 py-3">{total}</td>
                <td className="px-6 py-3">{totalSum + ' zł'}</td>
            </tr>
            </tfoot>
        </table>
    );
};
