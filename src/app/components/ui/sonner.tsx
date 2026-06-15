import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={
        {
          "--normal-bg": "#fbf6ef",
          "--normal-text": "#2b2d42",
          "--normal-border": "#ebdfd3",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
