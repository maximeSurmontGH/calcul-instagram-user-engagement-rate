import { buildExcelFile } from "./services/excel.service"
import { fetchAndFormatData } from "./services/fetch-data.service"
import * as moment from "moment"

const main = async () => {
  const startTimestamp = moment()
  const accountDatas = await fetchAndFormatData()
  const dataFetchedTimestamp = moment()
  console.log(
    `Data fetched in ${(startTimestamp.diff(dataFetchedTimestamp), "seconds")}.`
  )
  buildExcelFile(accountDatas)
}

main()
