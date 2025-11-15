import * as Minio from 'minio';

const minioClient = new Minio.Client({
  endPoint: '35.199.68.66',
  port: 9000,
  useSSL: false,
  accessKey: process.env.ACCESS_KEY,
  secretKey: process.env.SECRET_KEY,
});



export default minioClient;