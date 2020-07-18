import {
  IFormatedAccountData,
  IInstagramApiRootPageResponse,
  IAccountPost,
  IInstagramApiPageResponse,
} from "../types/types"
import * as moment from "moment"

export const formatRootPageAccountData = (
  unformattedAccountData: IInstagramApiRootPageResponse
): IFormatedAccountData => {
  const posts: IAccountPost[] = unformattedAccountData.graphql.user.edge_owner_to_timeline_media.edges.map(
    (edge) => {
      const commentsCounter = edge.node.comments_disabled
        ? undefined
        : edge.node.edge_media_to_comment.count
      const viewsCounter = edge.node.is_video
        ? edge.node.video_view_count
        : undefined
      const tagsCounter = edge.node.edge_media_to_caption.edges[0]
        ? edge.node.edge_media_to_caption.edges[0].node.text.split("#").length -
          1
        : undefined
      const engagementRate = edge.node.comments_disabled
        ? undefined
        : getEngagementRate(
            edge.node.edge_liked_by.count,
            edge.node.edge_media_to_comment.count,
            unformattedAccountData.graphql.user.edge_followed_by.count
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
        tagsCounter,
        viewsCounter,
        engagementRate,
      }
    }
  )
  return {
    accountLabel: unformattedAccountData.graphql.user.username,
    followersCounter:
      unformattedAccountData.graphql.user.edge_followed_by.count,
    posts,
  }
}

export const formatPageAccountData = (
  unformattedAccountData: IInstagramApiPageResponse,
  followersCounter: number
): IAccountPost[] => {
  const posts: IAccountPost[] = unformattedAccountData.data.user.edge_owner_to_timeline_media.edges.map(
    (edge) => {
      const commentsCounter = edge.node.comments_disabled
        ? undefined
        : edge.node.edge_media_to_comment.count
      const viewsCounter = edge.node.is_video
        ? edge.node.video_view_count
        : undefined
      const tagsCounter = edge.node.edge_media_to_caption.edges[0]
        ? edge.node.edge_media_to_caption.edges[0].node.text.split("#").length -
          1
        : undefined
      const engagementRate = edge.node.comments_disabled
        ? undefined
        : getEngagementRate(
            edge.node.edge_media_preview_like.count,
            edge.node.edge_media_to_comment.count,
            followersCounter
          )
      const date = moment
        .unix(edge.node.taken_at_timestamp)
        .format("DD-MM-YYYY")
      return {
        url: edge.node.display_url,
        description: edge.node.edge_media_to_caption.edges[0]?.node.text ?? "",
        date,
        likesCounter: edge.node.edge_media_preview_like.count,
        commentsCounter,
        tagsCounter,
        viewsCounter,
        engagementRate,
      }
    }
  )
  return posts
}

const getEngagementRate = (
  likesCounter: number,
  commentsCounter: number,
  followersCounter: number
): number => {
  return (likesCounter + commentsCounter) / followersCounter
}
