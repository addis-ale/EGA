import { getCurrentUser } from "./actions/getCurrentUser";

const User = async () => {
  const currentUser = await getCurrentUser();
  return <div>{currentUser?.name}</div>;
};

export default User;
