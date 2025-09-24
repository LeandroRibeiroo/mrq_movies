export interface SignInDto {
  username: string;
  password: string;
}

export interface AuthResponseDto {
  access_token: string;
  user: {
    id: string;
    username: string;
    name: string;
  };
}
