import { IFormatedAccountData } from "../types/types"
import * as XLSX from "xlsx"
import * as moment from "moment"

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

  const now = moment().format("DD-MM-YYYY")

  XLSX.writeFile(workbook, `./files/engagement-rates-${now}.xls`)
  console.log("File generated in the folder './files'.")
}
