import * as Minio from 'minio';

const minioClient = new Minio.Client({
  endPoint: '34.95.142.166',
  port: 9000,
  useSSL: false,
  accessKey: process.env.ACCESS_KEY,
  secretKey: process.env.SECRET_KEY,
});



export default minioClient;