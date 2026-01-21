import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    document.title = `Not found`;
  }, []);
  return <div className="p-10">Page not found</div>;
}
