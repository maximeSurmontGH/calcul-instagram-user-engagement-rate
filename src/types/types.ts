export interface IRootPageFetchResponse {
  formattedAccountData: IFormatedAccountData
  totalPostsNumber: number
  postsCounter: number
  followersCounter: number
  isAllDataFetched: boolean
  accountId: string
  endCursor: string
}

export interface IPageFetchResponse {
  posts: IAccountPost[]
  isAllDataFetched: boolean
  endCursor: string
}

export interface IGlobalAccountData {
  accountLabel: string
  followersCounter: number
  globalEngagementRate?: number
  lastYearEngagementRate?: number
}

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
  tagsCounter?: number
  viewsCounter?: number
  engagementRate?: number
}

// obviously incomplete
export interface IInstagramApiRootPageResponse {
  graphql: {
    user: {
      full_name: string
      username: string
      id: string
      edge_followed_by: {
        count: number
      }
      edge_owner_to_timeline_media?: {
        count: number
        page_info: {
          has_next_page: boolean
          end_cursor: string
        }
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

// obviously incomplete
export interface IInstagramApiPageResponse {
  data: {
    user: {
      edge_owner_to_timeline_media?: {
        count: number
        page_info: {
          has_next_page: boolean
          end_cursor: string
        }
        edges: [
          {
            node: {
              taken_at_timestamp: number
              display_url: string
              edge_media_preview_like: {
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
