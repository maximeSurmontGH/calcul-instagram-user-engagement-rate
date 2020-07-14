import {
  IInstagramApiRootPageResponse,
  IInstagramApiPageResponse,
} from "../types/types"
import {
  ACCOUNT_NAMES,
  BASE_URL,
  URL_ADD_ON,
  ROOT_PAGE_SIZE,
  QUERY_HASH,
  PAGE_SIZE,
} from "../variables"
import axios from "axios"

export const fetchData = async (): Promise<IInstagramApiRootPageResponse[]> => {
  const accountDatas = new Array<IInstagramApiRootPageResponse>()
  for (const accountName of ACCOUNT_NAMES) {
    const accountData = await fetchRootData(accountName)
    const totalPostsNumber =
      accountData.graphql.user.edge_owner_to_timeline_media.count
    let postsCounter = ROOT_PAGE_SIZE

    let isAllDataFetched = !accountData.graphql.user
      .edge_owner_to_timeline_media.page_info.has_next_page
    if (isAllDataFetched) {
      accountDatas.push(accountData)
    } else {
      const accountId = accountData.graphql.user.id
      let endCursor =
        accountData.graphql.user.edge_owner_to_timeline_media.page_info
          .end_cursor
      do {
        // used because request end up in 429 ... cheap throttling
        await sleep(1000)
        const pageUrl = getDataUrl(accountId, endCursor)
        let pageAxiosResponse
        try {
          pageAxiosResponse = await axios.get(pageUrl)
        } catch (e) {
          console.error(`[GET FAIL] ${pageUrl}`)
          console.error(e)
          // throw new Error(e)
        }
        const accountDataToAdd: IInstagramApiPageResponse =
          pageAxiosResponse.data

        accountDataToAdd.data.user.edge_owner_to_timeline_media.edges.forEach(
          (edge) => {
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
            })
          }
        )

        isAllDataFetched = !accountDataToAdd.data.user
          .edge_owner_to_timeline_media.page_info.has_next_page
        if (!isAllDataFetched) {
          endCursor =
            accountDataToAdd.data.user.edge_owner_to_timeline_media.page_info
              .end_cursor
        }

        postsCounter = postsCounter + PAGE_SIZE
        console.log(
          `[GET SUCCES] ${pageUrl} - ${postsCounter}/${totalPostsNumber}`
        )
      } while (!isAllDataFetched)
      accountDatas.push(accountData)
    }
  }
  return accountDatas
}

const getRootDataUrl = (accountName: string) =>
  `${BASE_URL}/${accountName}/${URL_ADD_ON}`

const getDataUrl = (accountId: string, endCursor: string) =>
  `${BASE_URL}/graphql/query/?query_hash=${QUERY_HASH}&variables=%7B%22id%22%3A%22${accountId}%22%2C%22first%22%3A${PAGE_SIZE}%2C%22after%22%3A%22${endCursor}%22%7D`

const fetchRootData = async (
  accountName: string
): Promise<IInstagramApiRootPageResponse> => {
  const url = getRootDataUrl(accountName)
  try {
    const response = await axios.get(url)
    const totalPostsNumber =
      response.data.graphql.user.edge_owner_to_timeline_media.count
    let postsCounter = ROOT_PAGE_SIZE
    console.log(`[GET SUCCES] ${url} - ${postsCounter}/${totalPostsNumber}`)
    return response.data
  } catch (e) {
    console.error(`[GET FAIL] ${url}`)
    console.error(e)

    // throw new Error(e)
  }
}

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
