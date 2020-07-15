import {
  IInstagramApiPageResponse,
  IFormatedAccountData,
  IPageFetchResponse,
  IRootPageFetchResponse,
  IInstagramApiRootPageResponse,
} from "../types/types"
import {
  ACCOUNT_NAMES,
  BASE_URL,
  URL_ADD_ON,
  ROOT_PAGE_SIZE,
  QUERY_HASH,
  PAGE_SIZE,
  DELAY_BETWEEN_TWO_PAGE,
  NUMBER_OF_CONCURRENT_REQUEST,
} from "../variables"
import axios from "axios"
import {
  formatPageAccountData,
  formatRootPageAccountData,
} from "./data-formattor.service"
import Bottleneck from "bottleneck"

const limiter = new Bottleneck({
  maxConcurrent: NUMBER_OF_CONCURRENT_REQUEST,
  minTime: DELAY_BETWEEN_TWO_PAGE,
})

export const fetchAndFormatData = async (): Promise<IFormatedAccountData[]> => {
  const accountDatas = new Array<IFormatedAccountData>()
  for (const accountName of ACCOUNT_NAMES) {
    let {
      formattedAccountData,
      totalPostsNumber,
      postsCounter,
      followersCounter,
      isAllDataFetched,
      accountId,
      endCursor,
    } = await fetchRootPageData(accountName)

    if (isAllDataFetched) {
      accountDatas.push(formattedAccountData)
    } else {
      do {
        postsCounter = postsCounter + PAGE_SIZE

        const pageData = await fetchPageData(
          accountId,
          endCursor,
          totalPostsNumber,
          followersCounter,
          postsCounter
        )

        isAllDataFetched = pageData.isAllDataFetched
        endCursor = pageData.endCursor

        formattedAccountData.posts = [
          ...formattedAccountData.posts,
          ...pageData.posts,
        ]
      } while (!isAllDataFetched)
      accountDatas.push(formattedAccountData)
    }
  }
  return accountDatas
}

const getRootPageUrl = (accountName: string) =>
  `${BASE_URL}/${accountName}/${URL_ADD_ON}`

const getPageUrl = (accountId: string, endCursor: string) =>
  `${BASE_URL}/graphql/query/?query_hash=${QUERY_HASH}&variables=%7B%22id%22%3A%22${accountId}%22%2C%22first%22%3A${PAGE_SIZE}%2C%22after%22%3A%22${endCursor}%22%7D`

const fetchRootPageData = async (
  accountName: string
): Promise<IRootPageFetchResponse> => {
  const url = getRootPageUrl(accountName)
  try {
    const response = await limiter.schedule(() => axios.get(url))
    const unformattedAccountData = response.data as IInstagramApiRootPageResponse
    const totalPostsNumber =
      unformattedAccountData.graphql.user.edge_owner_to_timeline_media.count
    const postsCounter = ROOT_PAGE_SIZE
    const isAllDataFetched = !unformattedAccountData.graphql.user
      .edge_owner_to_timeline_media.page_info.has_next_page
    const accountId = unformattedAccountData.graphql.user.id
    const endCursor =
      unformattedAccountData.graphql.user.edge_owner_to_timeline_media.page_info
        .end_cursor
    const followersCounter =
      unformattedAccountData.graphql.user.edge_followed_by.count
    console.log(`[GET SUCCES] ${url} - ${postsCounter}/${totalPostsNumber}`)
    const formattedAccountData = formatRootPageAccountData(
      unformattedAccountData
    )
    return {
      formattedAccountData,
      totalPostsNumber,
      postsCounter,
      followersCounter,
      isAllDataFetched,
      accountId,
      endCursor,
    }
  } catch (e) {
    console.error(`[GET FAIL] ${url}`)
    throw new Error(e)
  }
}

const fetchPageData = async (
  accountId: string,
  endCursor: string,
  totalPostsNumber: number,
  followersCounter: number,
  postsCounter: number
): Promise<IPageFetchResponse> => {
  const url = getPageUrl(accountId, endCursor)
  try {
    const response = await limiter.schedule(() => axios.get(url))
    const unformattedAccountData = response.data as IInstagramApiPageResponse
    const isAllDataFetched = !unformattedAccountData.data.user
      .edge_owner_to_timeline_media.page_info.has_next_page
    const endCursor =
      unformattedAccountData.data.user.edge_owner_to_timeline_media.page_info
        .end_cursor
    console.log(`[GET SUCCES] ${url} - ${postsCounter}/${totalPostsNumber}`)
    const posts = formatPageAccountData(response.data, followersCounter)
    return {
      posts,
      isAllDataFetched,
      endCursor,
    }
  } catch (e) {
    console.error(`[GET FAIL] ${url}`)
    throw new Error(e)
  }
}
