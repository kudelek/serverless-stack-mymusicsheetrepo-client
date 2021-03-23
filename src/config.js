const config = {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    REGION: "us-east-1",
    BUCKET: "mymusicsheetrepo-app-upload",
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://bcjoyhdumj.execute-api.us-east-1.amazonaws.com/prod",
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_Jv0mN7MPE",
    APP_CLIENT_ID: "7udeu4ti5u8dsime6r84a6rb77",
    IDENTITY_POOL_ID: "us-east-1:e8af8e88-ce3d-44b2-b30b-e4ae612f0929",
  },
};
  
  export default config;