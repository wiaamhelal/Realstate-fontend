import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "../../store/authSlice";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return children;
};

export default AuthInitializer;
