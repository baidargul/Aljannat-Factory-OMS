import UploadButton from "@/components/File/UploadButton"

export default function Home() {

  return (
    <div className={`flex flex-col gap-2 justify-center items-center p-4 cursor-default`}>
      <UploadButton />
    </div>
  );
}
