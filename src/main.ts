import axios from "axios"
import { ACCOUNTS, BASE_URL, URL_ADD_ON } from "./varaibles"
import * as XLSX from "xlsx"
import {
  IFormatedAccountData,
  IInstagramApiResponse,
  IAccountPost,
} from "./types"
import * as moment from "moment"

const main = async () => {
  const accountDatas = await fetchData()
  const formatedAccountDatas = formatAccountDatas(accountDatas)
  buildExcel(formatedAccountDatas)
}

const fetchData = async (): Promise<IInstagramApiResponse[]> => {
  const axiosResponsePromises = ACCOUNTS.map((accountName) => {
    console.log(`[GET] ${BASE_URL}${accountName}${URL_ADD_ON}`)
    return axios.get(`${BASE_URL}${accountName}${URL_ADD_ON}`)
  })
  const axiosResponses = await Promise.all(axiosResponsePromises)
  return axiosResponses.map((axiosResponse) => axiosResponse.data)
}

const formatAccountDatas = (
  unformatedAccountDatas: IInstagramApiResponse[]
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

const buildExcel = (formatedAccountDatas: IFormatedAccountData[]): void => {
  const workbook = XLSX.utils.book_new()

  formatedAccountDatas.forEach((formatedAccountsData) => {
    const sheet = XLSX.utils.json_to_sheet(formatedAccountsData.posts)
    XLSX.utils.book_append_sheet(
      workbook,
      sheet,
      formatedAccountsData.accountLabel
    )
  })

  XLSX.writeFile(workbook, `./files/user-engagement-rates.xls`)
}

main()
