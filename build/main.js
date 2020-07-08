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
const moment = require("moment");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const accountDatas = yield fetchData();
    const formatedAccountDatas = formatAccountDatas(accountDatas);
    buildExcel(formatedAccountDatas);
});
const fetchData = () => __awaiter(void 0, void 0, void 0, function* () {
    const axiosResponsePromises = varaibles_1.ACCOUNTS.map((accountName) => {
        console.log(`[GET] ${varaibles_1.BASE_URL}${accountName}${varaibles_1.URL_ADD_ON}`);
        return axios_1.default.get(`${varaibles_1.BASE_URL}${accountName}${varaibles_1.URL_ADD_ON}`);
    });
    const axiosResponses = yield Promise.all(axiosResponsePromises);
    return axiosResponses.map((axiosResponse) => axiosResponse.data);
});
const formatAccountDatas = (unformatedAccountDatas) => {
    return unformatedAccountDatas.reduce((acc, unformatedAccountaData) => {
        const posts = unformatedAccountaData.graphql.user.edge_owner_to_timeline_media.edges.map((edge) => {
            var _a;
            const commentsCounter = edge.node.comments_disabled
                ? undefined
                : edge.node.edge_media_to_comment.count;
            const viewsCounter = edge.node.is_video
                ? edge.node.video_view_count
                : undefined;
            const engagementRate = edge.node.comments_disabled
                ? undefined
                : getEngagementRate(edge.node.edge_liked_by.count, edge.node.edge_media_to_comment.count, unformatedAccountaData.graphql.user.edge_followed_by.count);
            const date = moment
                .unix(edge.node.taken_at_timestamp)
                .format("DD-MM-YYYY");
            return {
                url: edge.node.display_url,
                description: (_a = edge.node.edge_media_to_caption.edges[0]) === null || _a === void 0 ? void 0 : _a.node.text,
                date,
                likesCounter: edge.node.edge_liked_by.count,
                commentsCounter,
                viewsCounter,
                engagementRate,
            };
        });
        acc.push({
            accountLabel: unformatedAccountaData.graphql.user.username,
            followersCounter: unformatedAccountaData.graphql.user.edge_followed_by.count,
            posts,
        });
        return acc;
    }, new Array());
};
const getEngagementRate = (likesCounter, commentsCounter, followersCounter) => {
    return (likesCounter + commentsCounter) / followersCounter;
};
const buildExcel = (formatedAccountDatas) => {
    const workbook = XLSX.utils.book_new();
    formatedAccountDatas.forEach((formatedAccountsData) => {
        const sheet = XLSX.utils.json_to_sheet(formatedAccountsData.posts);
        sheet["!cols"] = [
            { wch: 500 },
            { wch: 200 },
            { wch: 200 },
            { wch: 200 },
            { wch: 200 },
            { wch: 200 },
            { wch: 200 },
        ];
        XLSX.utils.book_append_sheet(workbook, sheet, formatedAccountsData.accountLabel);
    });
    XLSX.writeFile(workbook, `./files/user-engagement-rates.xls`);
};
main();
//# sourceMappingURL=main.js.map