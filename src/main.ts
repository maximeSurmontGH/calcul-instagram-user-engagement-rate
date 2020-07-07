import axios from "axios"
import { ACCOUNTS, BASE_URL, URL_ADD_ON } from "./varaibles"
import XLSX from "xlsx"
import { IFormatedAccountData } from "./types"

const main = async () => {
  const accountasData = await fetchData()
}

const fetchData = async () => {
  const accountasData = ACCOUNTS.map((accountName) =>
    axios.get(`${BASE_URL}${accountName}${URL_ADD_ON}`)
  )
  return Promise.all(accountasData)
}

const formatAccountData = (
  unformatedAccountasData: any[]
): IFormatedAccountData[] => {
  return unformatedAccountasData.reduce(
    acc,
    (unformatedAccountaData) => {
      return acc
    },
    new Array<IFormatedAccountData>()
  )
}

const buildExcel = (formatedAccountasData: IFormatedAccountData[]): void => {
  const workbook = XLSX.utils.book_new()
  XLSX.writeFile(workbook, `user-engagement-rates.xls`)
}

main()
