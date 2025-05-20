export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  residence: string;
  profileImageId?: string;
  usernameSearchKeywords: string[];
  emailSearchKeywords: string[];
}
