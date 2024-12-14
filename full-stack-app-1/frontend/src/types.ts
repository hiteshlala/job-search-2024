export type Pet = {
  id: number;
  image: string;
  name: string;
  age: number;
  description: string;
  checkedOutBy: number;
}

export type User = {
  id: number;
  name: string;
  pets: Pet[];
}
