// Define an interface for the document structure
interface IBlacklistedToken extends Document {
  token: string;
  createdAt: Date;
}

export default IBlacklistedToken;