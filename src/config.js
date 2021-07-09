const dev = {
  s3: {
    REGION: "us-east-1",
    BUCKET: "dev-mymusicsheetrepo-infra-s3-uploads4f6eb0fd-sbvq6xfgi1xh"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://api.mymusicsheetrepo.com/dev",
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_1gcxPqwds",
    APP_CLIENT_ID: "60gsveok5jrf3jausgr12iokqg",
    IDENTITY_POOL_ID: "us-east-1:ff80017e-3b69-434d-89ca-0a3670f3b599"
  }
};

const prod = {
  s3: {
    REGION: "us-east-1",
    BUCKET: "prod-mymusicsheetrepo-infra-s3-uploads4f6eb0fd-1qw3ujobnuijh"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://api.mymusicsheetrepo.com/prod",
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_n9G0p1jTK",
    APP_CLIENT_ID: "34hqkidu9jvnmua87mluqjvsor",
    IDENTITY_POOL_ID: "us-east-1:8bc2dade-f16f-44f6-94d8-0167706d182c"
  }
}



const config = {
  // Add  common config values here
  MAX_ATTACHMENT_SIZE: 10000000,
  // Default to dev if not set
  ...(process.env.REACT_APP_STAGE === "prod" ? prod : dev),
};
  
  export default config;