import axios from "axios"
import { ACCOUNTS, BASE_URL, URL_ADD_ON } from "./varaibles"
import * as XLSX from "xlsx"
import { IFormatedAccountData } from "./types"

const main = async () => {
  const accountDatas = await fetchData()
  const formatedAccountDatas = formatAccountDatas(accountDatas)
  buildExcel(formatedAccountDatas)
}

const fetchData = async () => {
  const accountDatas = ACCOUNTS.map((accountName) =>
    axios.get(`${BASE_URL}${accountName}${URL_ADD_ON}`)
  )
  return Promise.all(accountDatas)
}

const formatAccountDatas = (
  unformatedAccountDatas: any[]
): IFormatedAccountData[] => {
  return unformatedAccountDatas.reduce((acc, unformatedAccountaData) => {
      acc.push({
        accountLabel: string
        followersCounter: number
        posts: [
          {
            url: string
            description: string
            likesCounter: number
            commentsCounter: number
            viewsCounter?: number
            engagementRate: number
          }
        ]   
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
