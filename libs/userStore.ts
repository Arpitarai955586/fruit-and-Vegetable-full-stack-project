// Shared in-memory user storage for demo purposes

interface User {
  id: string
  name: string
  email: string
  password: string
}

let users: User[] = [
  {
    id: '1',
    name: 'Arpita',
    email: 'arpita@gmail.com',
    password: 'arpita123'
  },
  {
    id: '2',
    name: 'Test User',
    email: 'user@test.com',
    password: 'user123'
  }
];

export const addUser = (user: User): void => {
  users.push(user);
};

export const findUser = (email: string): User | undefined => {
  return users.find(u => u.email === email);
};

export const getUsers = (): User[] => {
  return users;
};
