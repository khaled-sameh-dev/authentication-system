import { type ReactNode } from "react";
import { Link } from "react-router";

const AuthShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen py-6 flex justify-center items-center bg-slate-100 px-4">
      <div className="w-full md:max-w-md flex flex-col gap-6">
        <div>
          <Link
            to="/"
            className="flex items-center text-2xl font-bold tracking-tight text-slate-900"
          >
            <h1 className="w-full text-center">
              Welcome!, <span className="text-emerald-500">AuthShop</span>
            </h1>
          </Link>
        </div>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default AuthShell;
