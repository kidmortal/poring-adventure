declare type User = {
  id: number;
  email: string;
  name: string;
  classname: string;
  level: number;
  experience: number;
  appearance: Appearance;
};

declare type Appearance = {
  id: 1;
  head: string;
  gender: "male" | "female";
  costume: string;
  userEmail: string;
};

declare type CreateUserPayload = {
  email: string;
  name: string;
  classname: string;
  gender: string;
};
