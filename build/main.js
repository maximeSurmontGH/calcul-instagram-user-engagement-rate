"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const varaibles_1 = require("./varaibles");
const XLSX = require("xlsx");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const accountasData = yield fetchData();
    buildExcel([
        {
            accountLabel: "test",
            posts: [
                {
                    url: "url 1",
                    description: "descr 1",
                    likesCounter: 1,
                    commentsCounter: 2,
                    viewsCounter: 3,
                },
            ],
        },
    ]);
});
const fetchData = () => __awaiter(void 0, void 0, void 0, function* () {
    const accountasData = varaibles_1.ACCOUNTS.map((accountName) => axios_1.default.get(`${varaibles_1.BASE_URL}${accountName}${varaibles_1.URL_ADD_ON}`));
    return Promise.all(accountasData);
});
const buildExcel = (formatedAccountsData) => {
    const workbook = XLSX.utils.book_new();
    formatedAccountsData.forEach((formatedAccountsData) => {
        const sheet = XLSX.utils.json_to_sheet(formatedAccountsData.posts);
        XLSX.utils.book_append_sheet(workbook, sheet, formatedAccountsData.accountLabel);
    });
    XLSX.writeFile(workbook, `./files/user-engagement-rates.xls`);
};
main();
//# sourceMappingURL=main.js.map