"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildExcelFile = void 0;
const XLSX = require("xlsx");
exports.buildExcelFile = (formatedAccountDatas) => {
    const workbook = XLSX.utils.book_new();
    formatedAccountDatas.forEach((formatedAccountsData) => {
        const sheet = XLSX.utils.json_to_sheet(formatedAccountsData.posts);
        XLSX.utils.book_append_sheet(workbook, sheet, formatedAccountsData.accountLabel);
    });
    XLSX.writeFile(workbook, `./files/user-engagement-rates.xls`);
    console.log("File generated.");
};
//# sourceMappingURL=excel.service.js.map