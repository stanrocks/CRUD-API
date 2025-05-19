import http from 'node:http';

import {
  addUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from './users';
import { isIdValid } from './utils';

import { User } from './types';

export const server = http.createServer((req, res) => {
  try {
    console.log(`Request received: ${req.method} ${req.url}`);

    // create new user
    if (req.url === '/api/users' && req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        try {
          const userData = JSON.parse(body) as Omit<User, 'id'>;

          if (
            typeof userData.username !== 'string' ||
            typeof userData.age !== 'number' ||
            !Array.isArray(userData.hobbies)
          ) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(
              JSON.stringify({
                message:
                  'Request body must contain username (string), age (number), and hobbies (array).',
              }),
            );
            return;
          }

          const newUser = addUser(userData as User);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newUser));
        } catch (error) {
          console.error('Error parsing request body:', error);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Invalid JSON in request body' }));
        }
      });
      return;
    }

    // get all users
    if (req.url === '/api/users' && req.method === 'GET') {
      const allUsers = getUsers();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(allUsers));
      return;
    }

    const userIdMatch = req.url?.match(/^\/api\/users\/([a-f0-9-]+)$/);

    // get user by id
    if (req.method === 'GET' && userIdMatch) {
      const userId = userIdMatch[1];

      if (!isIdValid(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid userId format' }));
        return;
      }

      const user = getUserById(userId);
      if (user) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
        return;
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ message: `User with id '${userId}' not found` }),
        );
        return;
      }
    }

    // update user
    if (req.method === 'PUT' && userIdMatch) {
      const userId = userIdMatch[1];

      if (!isIdValid(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid userId format' }));
        return;
      }

      const existingUser = getUserById(userId);
      if (!existingUser) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ message: `User with id '${userId}' not found` }),
        );
        return;
      }

      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          const userData = JSON.parse(body) as Partial<User>;

          if (
            (userData.username !== undefined &&
              typeof userData.username !== 'string') ||
            (userData.age !== undefined && typeof userData.age !== 'number') ||
            (userData.hobbies !== undefined && !Array.isArray(userData.hobbies))
          ) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(
              JSON.stringify({ message: 'Invalid data types in request body' }),
            );
            return;
          }
          const updatedUser = updateUser(userId, userData);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(updatedUser));
        } catch (error) {
          console.error('Error parsing request body:', error);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Invalid JSON in request body' }));
        }
      });
      return;
    }

    // delete user
    if (req.method === 'DELETE' && userIdMatch) {
      const userId = userIdMatch[1];

      if (!isIdValid(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid userId format' }));
        return;
      }

      const deleted = deleteUser(userId);
      if (deleted) {
        res.writeHead(204, { 'Content-Type': 'application/json' });
        res.end();
        return;
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({ message: `User with id '${userId}' not found` }),
        );
        return;
      }
    }

    // handle 404 for other routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        message: 'Resource not found',
      }),
    );
  } catch (error) {
    console.error('Error handling request:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        error: 'Internal Server Error',
      }),
    );
  }
});
