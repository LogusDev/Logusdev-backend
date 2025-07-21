import * as Minio from 'minio';

const minioClient = new Minio.Client({
  endPoint: '34.151.235.1',
  port: 9000,
  useSSL: false,
  accessKey: process.env.ACCESS_KEY,
  secretKey: process.env.SECRET_KEY,
});



export default minioClient;