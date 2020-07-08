export interface IFormatedAccountData {
  accountLabel: string
  followersCounter: number
  posts: Array<IAccountPost>
}

export interface IAccountPost {
  url: string
  description: string
  date: string
  likesCounter: number
  commentsCounter?: number
  viewsCounter?: number
  engagementRate?: number
}

// obviously incomplete
export interface IInstagramApiResponse {
  graphql: {
    user: {
      full_name: string
      username: string
      edge_followed_by: {
        count: number
      }
      edge_owner_to_timeline_media?: {
        count: number
        edges: [
          {
            node: {
              taken_at_timestamp: number
              display_url: string
              edge_liked_by: {
                count: number
              }
              comments_disabled: boolean
              edge_media_to_comment: {
                count: number
              }
              is_video: boolean
              video_view_count: number
              edge_media_to_caption: {
                edges: Array<{
                  node: {
                    text: string
                  }
                }>
              }
            }
          }
        ]
      }
    }
  }
}
