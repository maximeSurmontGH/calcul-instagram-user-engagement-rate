import { buildExcelFile } from "./services/excel.service"
import { fetchAndFormatData } from "./services/fetch-data.service"

const main = async () => {
  const accountDatas = await fetchAndFormatData()
  buildExcelFile(accountDatas)
}

main()
