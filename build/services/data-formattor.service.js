"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatAccountDatas = void 0;
const moment = require("moment");
exports.formatAccountDatas = (unformatedAccountDatas) => {
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
//# sourceMappingURL=data-formattor.service.js.map