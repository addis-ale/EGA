"use client";
import { Provider } from "react-redux";
import { store } from "@/state/store";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default Providers;
