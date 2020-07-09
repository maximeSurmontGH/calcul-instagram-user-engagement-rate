import { buildExcelFile } from "./services/excel.service"
import { formatAccountDatas } from "./services/data-formattor.service"
import { fetchData } from "./services/fetch-data.service"

const main = async () => {
  const accountDatas = await fetchData()
  const formatedAccountDatas = formatAccountDatas(accountDatas)
  buildExcelFile(formatedAccountDatas)
}

main()
