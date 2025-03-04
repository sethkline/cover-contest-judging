// types/mailgun-js.d.ts
declare module "mailgun-js" {
  export default function mailgun(options: {
    apiKey: string;
    domain: string;
  }): {
    messages: () => {
      send: (data: any, callback: (error: any, body: any) => void) => void;
    };
  };
}
