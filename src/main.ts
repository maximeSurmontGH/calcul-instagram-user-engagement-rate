import { buildExcelFile } from "./services/excel.service"
import { fetchAndFormatData } from "./services/fetch-data.service"
import { getGlobalAccountDatas } from "./services/global-data.service"

const main = async () => {
  const accountDatas = await fetchAndFormatData()
  const globalAccountDatas = getGlobalAccountDatas(accountDatas)
  buildExcelFile(globalAccountDatas, accountDatas)
}

main()
