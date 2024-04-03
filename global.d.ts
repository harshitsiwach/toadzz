// global.d.ts
interface Window {
    ethereum?: {
      request: ({ method }: { method: string }) => Promise<any>;
      // You can add other properties and methods you need here
    };
  }
  