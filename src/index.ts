import dotenv from 'dotenv';
import { server } from './server';

dotenv.config();

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
