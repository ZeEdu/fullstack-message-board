export interface Message {
  _id?: string;
  email: string;
  username: string;
  user_id: string;
  message: string;
  likeCount: number;
  likes: string[];
  createdAt?: string;
  updatedAt?: string;
}
