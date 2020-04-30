export interface IReadableUser {
  readonly email: string
  status: string
  readonly firstName: string
  readonly roles: Array<string>
  accessToken?: string
}
