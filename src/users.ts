import { v4 as uuidv4 } from 'uuid';

import { User } from './types';

const users: User[] = [];

export const addUser = (userData: User): User => {
  const user: User = {
    ...userData,
    id: uuidv4(),
  };

  users.push(user);
  return user;
};

export const getUsers = (): User[] => {
  return users;
};

export const getUserById = (id: string): User | undefined => {
  return users.find((user) => user.id === id);
};

export const updateUser = (
  id: string,
  userData: Partial<User>,
): User | undefined => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) {
    return undefined;
  }

  const updatedUser = {
    ...users[userIndex],
    ...userData,
    id: users[userIndex].id,
  };
  users[userIndex] = updatedUser;
  return updatedUser;
};

export const deleteUser = (id: string): boolean => {
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return false;
  }

  users.splice(userIndex, 1);
  return true;
};
