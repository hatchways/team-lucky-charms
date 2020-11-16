const aws = require("aws-sdk");
const { AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID, AWS_REGION } = process.env;

// To update configuration settings for aws sdk

function setConfig() {
  aws.config.update({
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    accessKeyId: AWS_ACCESS_KEY_ID,
    region: AWS_REGION,
  });
}
module.exports = setConfig;
