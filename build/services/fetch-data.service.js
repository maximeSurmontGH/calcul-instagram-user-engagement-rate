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
exports.fetchData = void 0;
const variables_1 = require("../variables");
const axios_1 = require("axios");
exports.fetchData = () => __awaiter(void 0, void 0, void 0, function* () {
    const accountDatasPromises = variables_1.ACCOUNT_NAMES.map((accountName) => __awaiter(void 0, void 0, void 0, function* () {
        const accountData = yield fetchRootData(accountName);
        const totalPostsNumber = accountData.graphql.user.edge_owner_to_timeline_media.count;
        let postsCounter = variables_1.ROOT_PAGE_SIZE;
        let isAllDataFetched = !accountData.graphql.user
            .edge_owner_to_timeline_media.page_info.has_next_page;
        if (isAllDataFetched) {
            return accountData;
        }
        const accountId = accountData.graphql.user.id;
        let endCursor = accountData.graphql.user.edge_owner_to_timeline_media.page_info.end_cursor;
        do {
            yield sleep(7000);
            const pageUrl = getDataUrl(accountId, endCursor);
            let pageAxiosResponse;
            try {
                pageAxiosResponse = yield axios_1.default.get(pageUrl);
            }
            catch (e) {
                console.error(`[GET FAIL] ${pageUrl}`);
                throw new Error(e);
            }
            const accountDataToAdd = pageAxiosResponse.data;
            accountDataToAdd.data.user.edge_owner_to_timeline_media.edges.forEach((edge) => {
                accountData.graphql.user.edge_owner_to_timeline_media.edges.push({
                    node: {
                        taken_at_timestamp: edge.node.taken_at_timestamp,
                        display_url: edge.node.display_url,
                        edge_liked_by: {
                            count: edge.node.edge_media_preview_like.count,
                        },
                        comments_disabled: edge.node.comments_disabled,
                        edge_media_to_comment: {
                            count: edge.node.edge_media_to_comment.count,
                        },
                        is_video: edge.node.is_video,
                        video_view_count: edge.node.video_view_count,
                        edge_media_to_caption: {
                            edges: [
                                {
                                    node: {
                                        text: edge.node.edge_media_to_caption.edges[0]
                                            ? edge.node.edge_media_to_caption.edges[0].node.text
                                            : "",
                                    },
                                },
                            ],
                        },
                    },
                });
            });
            isAllDataFetched = !accountDataToAdd.data.user
                .edge_owner_to_timeline_media.page_info.has_next_page;
            if (!isAllDataFetched) {
                endCursor =
                    accountDataToAdd.data.user.edge_owner_to_timeline_media.page_info
                        .end_cursor;
            }
            postsCounter = postsCounter + variables_1.PAGE_SIZE;
            console.log(`[GET SUCCES] ${pageUrl} - ${postsCounter}/${totalPostsNumber}`);
        } while (!isAllDataFetched);
        return accountData;
    }));
    const accountDatas = yield Promise.all(accountDatasPromises);
    return accountDatas;
});
const getRootDataUrl = (accountName) => `${variables_1.BASE_URL}/${accountName}/${variables_1.URL_ADD_ON}`;
const getDataUrl = (accountId, endCursor) => `${variables_1.BASE_URL}/graphql/query/?query_hash=${variables_1.QUERY_HASH}&variables=%7B%22id%22%3A%22${accountId}%22%2C%22first%22%3A${variables_1.PAGE_SIZE}%2C%22after%22%3A%22${endCursor}%22%7D`;
const fetchRootData = (accountName) => __awaiter(void 0, void 0, void 0, function* () {
    const url = getRootDataUrl(accountName);
    try {
        const response = yield axios_1.default.get(url);
        const totalPostsNumber = response.data.graphql.user.edge_owner_to_timeline_media.count;
        let postsCounter = variables_1.ROOT_PAGE_SIZE;
        console.log(`[GET SUCCES] ${url} - ${postsCounter}/${totalPostsNumber}`);
        return response.data;
    }
    catch (e) {
        console.error(`[GET FAIL] ${url}`);
        throw new Error(e);
    }
});
const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
//# sourceMappingURL=fetch-data.service.js.map