import UploadButton, { tableHeaders } from "@/components/File/UploadButton"

export default function Home() {
  const headers = tableHeaders;

  return (
    <div className={`flex flex-col gap-2 justify-center items-center p-4 cursor-default`}>
      <UploadButton />
    </div>
  );
}
