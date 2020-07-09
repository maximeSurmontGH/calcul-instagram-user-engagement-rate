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
const excel_service_1 = require("./services/excel.service");
const data_formattor_service_1 = require("./services/data-formattor.service");
const fetch_data_service_1 = require("./services/fetch-data.service");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const accountDatas = yield fetch_data_service_1.fetchData();
    const formatedAccountDatas = data_formattor_service_1.formatAccountDatas(accountDatas);
    excel_service_1.buildExcelFile(formatedAccountDatas);
});
main();
//# sourceMappingURL=main.js.map