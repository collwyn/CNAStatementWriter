import React from "react";
import { UserRound } from "lucide-react";

export default function LandingLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#494760] flex flex-col items-center px-4 py-12">
      <div className="text-center text-white mb-8">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
          <UserRound className="w-10 h-10 text-[#494760]" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Free CNA Statement Generator</h1>
        <p className="text-lg opacity-90">
          Enter incident details to get a grammatically correct, complete statement.
        </p>
      </div>
      
      {children}

      <div className="mt-12 w-full max-w-[720px] h-[90px] border-2 border-white/20 rounded flex items-center justify-center text-white/50">
        Banner ad space 720x90
      </div>
    </div>
  );
}