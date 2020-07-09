import {
  IFormatedAccountData,
  IInstagramApiRootPageResponse,
  IAccountPost,
} from "../types/types"
import * as moment from "moment"

export const formatAccountDatas = (
  unformatedAccountDatas: IInstagramApiRootPageResponse[]
): IFormatedAccountData[] => {
  return unformatedAccountDatas.reduce((acc, unformatedAccountaData) => {
    const posts: IAccountPost[] = unformatedAccountaData.graphql.user.edge_owner_to_timeline_media.edges.map(
      (edge) => {
        const commentsCounter = edge.node.comments_disabled
          ? undefined
          : edge.node.edge_media_to_comment.count
        const viewsCounter = edge.node.is_video
          ? edge.node.video_view_count
          : undefined
        const engagementRate = edge.node.comments_disabled
          ? undefined
          : getEngagementRate(
              edge.node.edge_liked_by.count,
              edge.node.edge_media_to_comment.count,
              unformatedAccountaData.graphql.user.edge_followed_by.count
            )
        const date = moment
          .unix(edge.node.taken_at_timestamp)
          .format("DD-MM-YYYY")
        return {
          url: edge.node.display_url,
          description: edge.node.edge_media_to_caption.edges[0]?.node.text,
          date,
          likesCounter: edge.node.edge_liked_by.count,
          commentsCounter,
          viewsCounter,
          engagementRate,
        }
      }
    )
    acc.push({
      accountLabel: unformatedAccountaData.graphql.user.username,
      followersCounter:
        unformatedAccountaData.graphql.user.edge_followed_by.count,
      posts,
    })
    return acc
  }, new Array<IFormatedAccountData>())
}

const getEngagementRate = (
  likesCounter: number,
  commentsCounter: number,
  followersCounter: number
): number => {
  return (likesCounter + commentsCounter) / followersCounter
}
