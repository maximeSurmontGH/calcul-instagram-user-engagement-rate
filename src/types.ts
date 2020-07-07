export interface IFormatedAccountData {
  accountLabel: string
  posts: [
    {
      url: string
      description: string
      likesCounter: number
      commentsCounter: number
      viewsCounter?: number
    }
  ]
}
