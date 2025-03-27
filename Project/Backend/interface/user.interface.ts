export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: "admin" | "teacher" | "finance-manager" | "student";
}