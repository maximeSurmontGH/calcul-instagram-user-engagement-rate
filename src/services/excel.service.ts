import { IFormatedAccountData } from "../types/types"
import * as XLSX from "xlsx"

export const buildExcelFile = (
  formatedAccountDatas: IFormatedAccountData[]
): void => {
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
  console.log("File generated.")
}
