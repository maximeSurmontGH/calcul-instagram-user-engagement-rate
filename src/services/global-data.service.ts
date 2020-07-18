import {
  IFormatedAccountData,
  IGlobalAccountData,
  IAccountPost,
} from "../types/types"
import * as moment from "moment"

export const getGlobalAccountDatas = (
  formatedAccountDatas: IFormatedAccountData[]
): IGlobalAccountData[] => {
  return formatedAccountDatas.map((formatedAccountData) => {
    const globalEngagementRate = getEngagementRateMedian(
      formatedAccountData.posts
    )
    const lastYearDate = moment().subtract(1, "year").format("DD-MM-YYYY")
    const lastYearPosts = formatedAccountData.posts.filter(
      (post) => post.date > lastYearDate
    )
    const lastYearEngagementRate = getEngagementRateMedian(lastYearPosts)
    return {
      accountLabel: formatedAccountData.accountLabel,
      followersCounter: formatedAccountData.followersCounter,
      globalEngagementRate,
      lastYearEngagementRate,
    }
  })
}

const getEngagementRateMedian = (posts: IAccountPost[]): number => {
  const sum = posts.reduce((sumAcc, post) => {
    return sumAcc + (post.engagementRate ?? 0)
  }, 0)
  return sum / posts.length
}
